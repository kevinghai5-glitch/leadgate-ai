import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription";
import { AdminClient } from "./admin-client";

/**
 * Agency control center — only ReclaimedHQ admins. Non-admins are bounced to
 * their own dashboard, so even a guessed URL reveals nothing.
 */
export default async function AdminPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { isAdmin } = await getUserSubscription(session.user.id);
  if (!isAdmin) redirect("/dashboard");

  return <AdminClient />;
}
