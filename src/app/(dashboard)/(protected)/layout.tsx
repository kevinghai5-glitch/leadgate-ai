import Link from "next/link";
import { redirect } from "next/navigation";
import { Lock, Sparkles } from "lucide-react";
import { auth } from "@/lib/auth";
import { getUserSubscription } from "@/lib/subscription";

// Server-side paywall. Wraps every route under (protected) — i.e. everything
// in the dashboard EXCEPT /billing. Non-pro users can navigate here, but the
// actual page content is replaced with a Locked screen. Real data never leaves
// the server.
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { isPro } = await getUserSubscription(session.user.id);

  if (!isPro) {
    return <LockedScreen />;
  }

  return <>{children}</>;
}

function LockedScreen() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-b from-[#0d0d0d] to-[#070707] p-8 text-center shadow-2xl">
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: "var(--lg-gold-gradient)" }}
        />

        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-black"
          style={{ background: "var(--lg-gold-gradient)" }}
        >
          <Lock className="h-6 w-6" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffd87c]/25 bg-[#ffd87c]/[0.08] px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-[#ffd87c]">
          <Sparkles className="h-3 w-3" />
          Pro Feature
        </span>

        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white">
          This section is locked
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-white/60">
          Subscribe to the Pro plan to unlock your dashboard, leads,
          business profile, form builder, and settings.
        </p>

        <Link
          href="/billing"
          className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-black transition hover:opacity-90"
          style={{ background: "var(--lg-gold-gradient)" }}
        >
          <Sparkles className="h-4 w-4" />
          Subscribe to Pro
        </Link>

        <p className="mt-3 text-[11px] text-white/40">
          Cancel anytime. All your data stays put if you pause.
        </p>
      </div>
    </div>
  );
}
