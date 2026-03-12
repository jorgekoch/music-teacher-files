import { api } from "./api";

type CheckoutSessionResponse = {
  url: string;
};

type CustomerPortalResponse = {
  url: string;
};

export type CheckoutSessionStatusResponse = {
  id: string;
  status: string | null;
  paymentStatus: string | null;
  customerEmail: string | null;
};

export async function createProCheckoutSession() {
  const response = await api.post<CheckoutSessionResponse>(
    "/billing/checkout-session"
  );

  return response.data;
}

export async function getCheckoutSessionStatus(sessionId: string) {
  const response = await api.get<CheckoutSessionStatusResponse>(
    `/billing/checkout-session/${sessionId}`
  );

  return response.data;
}

export async function createCustomerPortalSession() {
  const response = await api.post<CustomerPortalResponse>(
    "/billing/customer-portal"
  );

  return response.data;
}