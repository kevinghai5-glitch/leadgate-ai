import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

/**
 * The LeadGate domain is a client portal, not a marketing site. LeadGate is sold
 * and onboarded through ReclaimedHQ, and clients only reach it after they've
 * bought the done-for-you service — so there's no one to market to here. The root
 * goes straight into their tool, or to the login door.
 *
 * The old marketing landing is parked at /product (still reachable by direct URL)
 * if it's ever wanted again — restoring it as the front door is a one-line change.
 */
export default async function Page() {
  const session = await auth();
  redirect(session?.user ? "/dashboard" : "/login");
}
