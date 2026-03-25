import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { Lock } from "lucide-react";

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
    <div className="dashboard-dark flex h-screen overflow-hidden bg-[#070b14]">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-y-auto bg-[#070b14]">
          <div className="p-4 sm:p-6 lg:p-8">
            {isPaid ? (
              children
            ) : (
              <HardPaywall>{children}</HardPaywall>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function HardPaywall({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Blurred locked content */}
      <div className="blur-sm pointer-events-none select-none" aria-hidden="true">
        {children}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-start justify-center pt-24 z-10">
        <div className="rounded-2xl shadow-2xl border border-white/10 p-8 max-w-md w-full mx-4 text-center bg-[#111827]/90 backdrop-blur-xl">
          <div className="mx-auto h-14 w-14 rounded-full bg-indigo-500/20 flex items-center justify-center mb-5">
            <Lock className="h-7 w-7 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Upgrade to Pro to Unlock
          </h2>
          <p className="text-gray-400 mb-6">
            Subscribe to access AI lead scoring, analytics, and all premium
            features. Start getting more qualified clients today.
          </p>
          <Link
            href="/billing"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-700 transition-colors w-full"
          >
            View Plans &amp; Subscribe
          </Link>
          <p className="mt-3 text-xs text-gray-500">
            Cancel anytime. No hidden fees.
          </p>
        </div>
      </div>
    </div>
  );
}
