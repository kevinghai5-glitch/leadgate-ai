import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeSubscriptionStatus: true, email: true, plan: true },
  });

  const isAdmin = isAdminEmail(user?.email);
  // ReclaimedHQ-provisioned tenants carry plan="agency" and pass every gate
  // without a Stripe subscription (LeadGate is no longer self-serve).
  const isAgency = user?.plan === "agency";
  const isPro =
    isAdmin ||
    isAgency ||
    ["active", "trialing"].includes(user?.stripeSubscriptionStatus || "");

  return { isPro, isAdmin };
}
