import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate Stripe config
    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!stripeKey || stripeKey === "sk_test_your-stripe-secret-key") {
      return NextResponse.json(
        { error: "Stripe is not configured. Add your STRIPE_SECRET_KEY to environment variables." },
        { status: 503 }
      );
    }

    if (!priceId || priceId === "price_your-stripe-price-id") {
      return NextResponse.json(
        { error: "Stripe price ID is not configured. Add NEXT_PUBLIC_STRIPE_PRICE_ID to environment variables." },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeKey, { typescript: true });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id },
      });
      customerId = customer.id;
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing`,
      metadata: { userId: user.id },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
