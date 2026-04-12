import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeKey || !webhookSecret) {
    console.error("[Stripe Webhook] Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Stripe not configured" },
      { status: 503 }
    );
  }

  const stripe = new Stripe(stripeKey, { typescript: true });

  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature");

  if (!signature) {
    console.error("[Stripe Webhook] Missing Stripe-Signature header");
    return NextResponse.json(
      { error: "Missing signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail =
          session.customer_details?.email || session.customer_email;
        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id ?? null;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : null;

        if (!customerEmail) {
          console.error(
            "[Stripe Webhook] checkout.session.completed — no customer email found",
            { sessionId: session.id }
          );
          break;
        }

        if (!subscriptionId) {
          console.error(
            "[Stripe Webhook] checkout.session.completed — no subscription ID found",
            { sessionId: session.id }
          );
          break;
        }

        const user = await prisma.user.findUnique({
          where: { email: customerEmail },
        });

        if (!user) {
          console.error(
            "[Stripe Webhook] checkout.session.completed — no user found for email:",
            customerEmail
          );
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripeSubscriptionStatus: "active",
          },
        });

        console.log(
          "[Stripe Webhook] checkout.session.completed — user activated:",
          customerEmail
        );
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;

        // Extract subscription ID from the invoice
        let subscriptionId: string | null = null;

        // Try parent.subscription_details first (newer Stripe API)
        const subDetails = invoice.parent?.subscription_details;
        if (subDetails?.subscription) {
          subscriptionId =
            typeof subDetails.subscription === "string"
              ? subDetails.subscription
              : subDetails.subscription.id;
        }

        // Fallback: try to find subscription from line items or other fields
        if (!subscriptionId) {
          const rawInvoice = invoice as unknown as Record<string, unknown>;
          if (rawInvoice.subscription) {
            subscriptionId =
              typeof rawInvoice.subscription === "string"
                ? rawInvoice.subscription
                : null;
          }
        }

        if (!subscriptionId) {
          console.error(
            "[Stripe Webhook] invoice.payment_succeeded — no subscription ID found",
            { invoiceId: invoice.id }
          );
          break;
        }

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscriptionId },
        });

        if (!user) {
          console.error(
            "[Stripe Webhook] invoice.payment_succeeded — no user found for subscription:",
            subscriptionId
          );
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionStatus: "active",
          },
        });

        console.log(
          "[Stripe Webhook] invoice.payment_succeeded — user confirmed active:",
          user.email
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;

        if (!subscription.id) {
          console.error(
            "[Stripe Webhook] customer.subscription.updated — no subscription ID"
          );
          break;
        }

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) {
          console.error(
            "[Stripe Webhook] customer.subscription.updated — no user found for subscription:",
            subscription.id
          );
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionStatus: subscription.status,
          },
        });

        console.log(
          "[Stripe Webhook] customer.subscription.updated — status set to:",
          subscription.status,
          "for user:",
          user.email
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        if (!subscription.id) {
          console.error(
            "[Stripe Webhook] customer.subscription.deleted — no subscription ID"
          );
          break;
        }

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) {
          console.error(
            "[Stripe Webhook] customer.subscription.deleted — no user found for subscription:",
            subscription.id
          );
          break;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: {
            stripeSubscriptionStatus: "inactive",
            stripeSubscriptionId: null,
          },
        });

        console.log(
          "[Stripe Webhook] customer.subscription.deleted — user deactivated:",
          user.email
        );
        break;
      }

      default:
        // Unhandled event type — that's fine, just acknowledge
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Stripe Webhook] Processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
