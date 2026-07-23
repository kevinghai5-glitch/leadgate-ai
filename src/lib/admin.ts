import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Single source of truth for who is a ReclaimedHQ agency admin.
 *
 * Admins get the software free (see subscription.ts) AND see the /admin control
 * center where they can list every client, provision new ones, and manage each
 * client's integrations on their behalf. Configure via the ADMIN_EMAILS env var
 * (comma-separated); falls back to the original hardcoded owner account.
 */
export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "leafsbuzztv@gmail.com")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email?: string | null): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * API guard for admin-only routes. Verifies against the account's DB email
 * (not the session claim), so it can't be spoofed client-side.
 * Returns { userId } for an admin, or { response } the caller must return.
 */
export async function requireAdmin(): Promise<
  { userId: string } | { response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  });
  if (!isAdminEmail(user?.email)) {
    return {
      response: NextResponse.json({ error: "Not authorized" }, { status: 403 }),
    };
  }
  return { userId: session.user.id };
}
