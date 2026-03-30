import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { PaywallWrapper } from "@/components/paywall-wrapper";

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

  return (
    <div className="dashboard-dark flex h-screen overflow-hidden bg-[#070b14]">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-y-auto bg-[#070b14]">
          <div className="p-4 sm:p-6 lg:p-8">
            <PaywallWrapper isPro={isPro}>{children}</PaywallWrapper>
          </div>
        </main>
      </div>
    </div>
  );
}
