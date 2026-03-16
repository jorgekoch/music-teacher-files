import Stripe from "stripe";
import { AppError } from "../errors/AppError";
import { stripe } from "./stripeService";
import {
  findUserById,
  findUserByStripeCustomerId,
  findUserByStripeSubscriptionId,
  updateUserBillingData,
} from "../repositories/userRepository";

export async function createCheckoutSession(userId: number) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (user.plan === "PRO") {
    throw new AppError(
      "Você já possui acesso ao plano PRO. Use o portal para gerenciar sua assinatura.",
      400
    );
  }

  let stripeCustomerId = user.stripeCustomerId;

  if (stripeCustomerId) {
    try {
      await stripe.customers.retrieve(stripeCustomerId);
    } catch {
      stripeCustomerId = null;
    }
  }

  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
        userId: String(user.id),
      },
    });

    stripeCustomerId = customer.id;

    await updateUserBillingData(user.id, {
      stripeCustomerId,
      stripeSubscriptionId: null,
      subscriptionStatus: null,
      plan: "FREE",
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID,
        quantity: 1,
      },
    ],

    allow_promotion_codes: true,
    
    success_url: `${process.env.FRONTEND_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND_URL}/`,
    metadata: {
      userId: String(user.id),
      targetPlan: "PRO",
    },
  });

  if (!session.url) {
    throw new AppError("Não foi possível iniciar o checkout", 500);
  }

  return {
    url: session.url,
  };
}

export async function createCustomerPortalSession(userId: number) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  if (!user.stripeCustomerId) {
    throw new AppError("Cliente Stripe não encontrado para este usuário", 400);
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL}/dashboard`,
  });

  return {
    url: portalSession.url,
  };
}

export async function handleStripeWebhook(rawBody: Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new AppError("Webhook secret do Stripe não configurado", 500);
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    throw new AppError("Assinatura do webhook inválida", 400);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;

      if (session.mode !== "subscription") break;

      const customerId =
        typeof session.customer === "string" ? session.customer : null;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      if (!customerId) break;

      const user = await findUserByStripeCustomerId(customerId);

      if (!user) break;

      await updateUserBillingData(user.id, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "pending",
      });

      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;

      if (!customerId) break;

      const user = await findUserByStripeCustomerId(customerId);

      if (!user) break;

      await updateUserBillingData(user.id, {
        plan: "PRO",
        stripeCustomerId: customerId,
        subscriptionStatus: "active",
      });

      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;

      const customerId =
        typeof invoice.customer === "string" ? invoice.customer : null;

      if (!customerId) break;

      const user = await findUserByStripeCustomerId(customerId);

      if (!user) break;

      await updateUserBillingData(user.id, {
        subscriptionStatus: "past_due",
      });

      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      const user = await findUserByStripeSubscriptionId(subscription.id);

      if (!user) break;

      const keepsProAccess =
        subscription.status === "active" || subscription.status === "trialing";

      await updateUserBillingData(user.id, {
        plan: keepsProAccess ? "PRO" : "FREE",
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      const user = await findUserByStripeSubscriptionId(subscription.id);

      if (!user) break;

      await updateUserBillingData(user.id, {
        plan: "FREE",
        subscriptionStatus: "canceled",
      });

      break;
    }
  }

  return { received: true };
}

export async function getCheckoutSessionStatus(sessionId: string, userId: number) {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Usuário não encontrado", 404);
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);

  if (!session) {
    throw new AppError("Sessão de checkout não encontrada", 404);
  }

  const sessionCustomerId =
    typeof session.customer === "string" ? session.customer : null;

  if (!sessionCustomerId || sessionCustomerId !== user.stripeCustomerId) {
    throw new AppError("Sessão de checkout não pertence a este usuário", 403);
  }

  return {
    id: session.id,
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email ?? user.email,
  };
}