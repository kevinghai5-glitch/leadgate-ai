import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription";

/**
 * API guard for routes that require an active subscription.
 *
 * Returns either:
 *   { response: NextResponse } — caller must `return result.response` immediately
 *   { userId: string } — authenticated, paying (or admin) user
 *
 * Usage:
 *   const guard = await requirePro();
 *   if ("response" in guard) return guard.response;
 *   const { userId } = guard;
 */
export async function requirePro(): Promise<
  { response: NextResponse } | { userId: string }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { isPro } = await getUserSubscription(session.user.id);
  if (!isPro) {
    return {
      response: NextResponse.json(
        { error: "Subscription required", code: "PAYWALL" },
        { status: 402 }
      ),
    };
  }

  return { userId: session.user.id };
}

/**
 * Variant that checks a *target* user's subscription rather than the caller's.
 * Use for public endpoints (e.g. form submission) that act on behalf of a user
 * who must be a paying customer.
 */
export async function requireProForUser(
  userId: string
): Promise<NextResponse | null> {
  const { isPro } = await getUserSubscription(userId);
  if (!isPro) {
    return NextResponse.json(
      { error: "This form is not currently active.", code: "PAYWALL" },
      { status: 402 }
    );
  }
  return null;
}
