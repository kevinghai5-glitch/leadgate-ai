import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = ["leafsbuzztv@gmail.com"];

export async function getUserSubscription(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeSubscriptionStatus: true, email: true },
  });

  const isAdmin = ADMIN_EMAILS.includes(user?.email || "");
  const isPro = isAdmin || user?.stripeSubscriptionStatus === "active";

  return { isPro, isAdmin };
}
