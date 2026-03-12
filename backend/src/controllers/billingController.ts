import type { Request, Response } from "express";
import { AppError } from "../errors/AppError";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  getCheckoutSessionStatus,
  handleStripeWebhook,
} from "../services/billingService";

export async function createCheckoutSessionController(
  req: Request,
  res: Response
) {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("Usuário não autenticado", 401);
  }

  const result = await createCheckoutSession(userId);

  res.status(200).send(result);
}

export async function createCustomerPortalSessionController(
  req: Request,
  res: Response
) {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("Usuário não autenticado", 401);
  }

  const result = await createCustomerPortalSession(userId);

  res.status(200).send(result);
}

export async function stripeWebhookController(req: Request, res: Response) {
  const signature = req.headers["stripe-signature"];

  if (!signature || typeof signature !== "string") {
    throw new AppError("Stripe signature ausente", 400);
  }

  const result = await handleStripeWebhook(req.body, signature);

  res.status(200).send(result);
}

export async function getCheckoutSessionStatusController(
  req: Request,
  res: Response
) {
  const userId = req.userId;

  if (!userId) {
    throw new AppError("Usuário não autenticado", 401);
  }

  const rawSessionId = req.params.sessionId;

  if (!rawSessionId || Array.isArray(rawSessionId)) {
    throw new AppError("Session ID inválido", 400);
  }

  const result = await getCheckoutSessionStatus(rawSessionId, userId);

  res.status(200).send(result);
}