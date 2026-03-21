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

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (!stripeKey || stripeKey === "sk_test_your-stripe-secret-key") {
      return NextResponse.json(
        { error: "Stripe is not configured. Add your STRIPE_SECRET_KEY to environment variables." },
        { status: 503 }
      );
    }

    const stripe = new Stripe(stripeKey, { typescript: true });

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error("Stripe portal error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create portal session";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
