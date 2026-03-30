import { redirect } from "next/navigation";
import { headers } from "next/headers";
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

  // Determine current path to allow billing access for non-paying users
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isBillingPage = pathname === "/billing" || pathname.startsWith("/billing");

  // Non-paying, non-admin users can only access /billing — redirect everything else
  if (!isPaid && !isBillingPage) {
    redirect("/billing");
  }

  return (
    <div className="dashboard-dark flex h-screen overflow-hidden bg-[#070b14]">
      <div className="hidden md:block">
        <DashboardSidebar />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-y-auto bg-[#070b14]">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

