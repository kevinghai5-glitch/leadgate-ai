import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileNav } from "@/components/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { isPro } = await getUserSubscription(session.user.id);

  // Server-side paywall: any non-pro user is forced to /billing.
  // This cannot be bypassed via devtools — the dashboard pages never render.
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") || "";
  const isBillingRoute = pathname.startsWith("/billing");

  if (!isPro && !isBillingRoute) {
    redirect("/billing");
  }

  return (
    <div className="dashboard-dark lg-grain relative flex h-screen overflow-hidden bg-[#070707] text-[#f5f1e6]">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="lg-bg-gold-glow flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
