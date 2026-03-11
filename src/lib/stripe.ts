import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-02-25.clover",
  typescript: true,
});

export const PLANS = {
  pro: {
    name: "Pro",
    price: 499,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID!,
    features: [
      "Unlimited lead qualification",
      "AI-powered scoring",
      "Calendly integration",
      "Slack notifications",
      "Lead analytics dashboard",
      "Custom scoring rules",
    ],
  },
};
