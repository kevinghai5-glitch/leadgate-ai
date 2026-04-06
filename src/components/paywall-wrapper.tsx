"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Lock } from "lucide-react";

export function PaywallWrapper({
  isPro,
  children,
}: {
  isPro: boolean;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isBillingPage = pathname === "/billing" || pathname.startsWith("/billing");
  const shouldLock = !isPro && !isBillingPage;

  return (
    <div className="relative">
      {shouldLock && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 rounded-lg">
          <div className="bg-gradient-to-b from-[#111111] to-[#080808] border border-white/10 rounded-xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="mx-auto h-12 w-12 rounded-full bg-[#FFD700]/15 flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-[#D4A017]" />
            </div>
            <h2 className="text-xl font-semibold text-white">
              Upgrade to unlock
            </h2>
            <p className="text-sm text-gray-400 mt-2 mb-6">
              Access lead scoring, analytics, and full dashboard features.
            </p>
            <Link
              href="/billing"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold px-6 py-2.5 shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_28px_rgba(255,215,0,0.25)] transition-all"
            >
              Upgrade Now
            </Link>
          </div>
        </div>
      )}
      <div className={shouldLock ? "opacity-50 pointer-events-none" : ""}>
        {children}
      </div>
    </div>
  );
}
