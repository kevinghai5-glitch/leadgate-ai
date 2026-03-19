import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileNav } from "@/components/mobile-nav";

const ADMIN_EMAILS = ["leafsbuzztv@gmail.com"];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { stripeSubscriptionStatus: true, email: true },
  });

  const isAdmin = ADMIN_EMAILS.includes(user?.email || "");
  const isPaid =
    isAdmin || user?.stripeSubscriptionStatus === "active";

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="p-4 sm:p-6 lg:p-8">
            {isPaid ? (
              children
            ) : (
              <SoftPaywallBanner>{children}</SoftPaywallBanner>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function SoftPaywallBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-amber-900">
              Activate your account
            </h3>
            <p className="text-sm text-amber-700 mt-1">
              Subscribe to unlock AI lead scoring, analytics, and all premium features.
            </p>
          </div>
          <a
            href="/billing"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            View Plans
          </a>
        </div>
      </div>
      {children}
    </div>
  );
}
