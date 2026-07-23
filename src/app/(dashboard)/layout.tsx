import { redirect } from "next/navigation";
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

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Note: the paywall lives in (protected)/layout.tsx so it cannot wrap
  // /billing. This layout only handles auth + the visual shell.
  const { isAdmin } = await getUserSubscription(session.user.id);

  return (
    <div className="dashboard-dark lg-grain relative flex h-screen overflow-hidden bg-[#070707] text-[#f5f1e6]">
      <div className="hidden md:block">
        <DashboardSidebar isAdmin={isAdmin} />
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
