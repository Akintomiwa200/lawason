export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL?.trim() || process.env.AUTH_URL?.trim() || "http://localhost:3000";
}

export function toPaystackAmount(amount: number, currency = "NGN") {
  if (currency === "NGN") {
    return Math.round(amount * 100);
  }
  return Math.round(amount * 100);
}

export async function initializePaystack(input: {
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    throw new Error("Paystack is not configured");
  }

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: toPaystackAmount(input.amount, input.currency),
      currency: input.currency ?? "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; reference?: string };
  };

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message || "Could not start Paystack checkout");
  }

  return payload.data;
}

export async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret) {
    throw new Error("Paystack is not configured");
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });

  const payload = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: { status?: string; reference?: string; amount?: number; metadata?: Record<string, string> };
  };

  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || "Could not verify Paystack payment");
  }

  return payload.data;
}
