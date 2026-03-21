import Stripe from "stripe";

// Lazy-init: only create a real Stripe instance when actually called
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key || key === "sk_test_your-stripe-secret-key") {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    _stripe = new Stripe(key, { typescript: true });
  }
  return _stripe;
}

// Keep a default export for backward compatibility with any code
// that imported `stripe` directly — but prefer getStripe() in new code.
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  { typescript: true }
);

export const PLANS = {
  pro: {
    name: "Pro",
    price: 499,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID || "",
    features: [
      "Unlimited lead qualification",
      "AI-powered scoring",
      "Calendly integration",
      "Slack notifications",
      "Lead analytics dashboard",
      "Custom scoring rules",
      "Custom form questions",
    ],
  },
};
