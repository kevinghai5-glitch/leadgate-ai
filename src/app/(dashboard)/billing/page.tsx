"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ExternalLink,
  Receipt,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

interface BillingInfo {
  stripeSubscriptionStatus: string | null;
  plan: string | null;
}

type TabId = "plan" | "payment" | "invoices" | "usage";

const TABS: { id: TabId; label: string; icon: typeof CreditCard }[] = [
  { id: "plan", label: "Plan", icon: Sparkles },
  { id: "payment", label: "Payment Method", icon: CreditCard },
  { id: "invoices", label: "Invoices & History", icon: Receipt },
  { id: "usage", label: "Usage", icon: Zap },
];

// ─── Reusable Card ───────────────────────────────────────────────────
function BillingCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden">
      <div className="p-6 space-y-1">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && (
          <p className="text-sm text-white/60">{description}</p>
        )}
      </div>
      <div className="px-6 pb-6">{children}</div>
      {footer && (
        <div className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-3 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}

const btnPrimary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition";

const btnSecondary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition";

const btnGold =
  "inline-flex items-center justify-center gap-2 h-11 px-5 rounded-lg text-black text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,216,124,0.15)] hover:shadow-[0_0_28px_rgba(255,216,124,0.30)]";

// ─── Main Page ───────────────────────────────────────────────────────
export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [tab, setTab] = useState<TabId>("plan");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setBilling({
          stripeSubscriptionStatus: data.stripeSubscriptionStatus,
          plan: data.plan ?? null,
        });
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load billing info");
        setLoading(false);
      });
  }, []);

  async function handleCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 503) {
        toast.error("Stripe not configured");
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("Stripe not configured");
    } finally {
      setCheckoutLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (res.status === 503) {
        toast.error("Stripe not configured");
      } else {
        toast.error(data.error || "Failed to open billing portal");
      }
    } catch {
      toast.error("Stripe not configured");
    } finally {
      setPortalLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  const planStatus = billing?.stripeSubscriptionStatus ?? "free";
  // ReclaimedHQ-managed tenants (plan="agency") are always active and are not
  // billed through Stripe here — the retainer is handled by ReclaimedHQ.
  const isManaged = billing?.plan === "agency";
  const isPro = isManaged || ["active", "trialing"].includes(planStatus);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight">Billing</h1>
        <p className="text-sm text-white/60 mt-1">
          Manage your subscription, payment method, and invoices.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="space-y-0.5 lg:sticky lg:top-4">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white/[0.06] text-white"
                      : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* PLAN TAB */}
          {tab === "plan" && (
            <>
              {/* Current Plan summary */}
              <BillingCard
                title="Current Plan"
                description="Your active subscription tier and status."
              >
                <div
                  className={`mt-2 rounded-lg p-5 border flex items-center justify-between gap-4 ${
                    isPro
                      ? "border-emerald-500/25 bg-emerald-500/[0.05]"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                        isPro
                          ? "bg-emerald-500/15 text-emerald-300"
                          : "bg-white/[0.05] text-white/70"
                      }`}
                    >
                      {isPro ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : (
                        <Sparkles className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-semibold text-white">
                          {isManaged
                            ? "Agency Plan"
                            : isPro
                              ? "Pro Plan"
                              : "Free Plan"}
                        </p>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isPro
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {isManaged ? "Managed" : isPro ? planStatus : "Inactive"}
                        </span>
                      </div>
                      <p className="text-xs text-white/60 mt-0.5">
                        {isManaged
                          ? "Included in your ReclaimedHQ retainer — nothing to pay here."
                          : isPro
                            ? "$499 / month · billed monthly"
                            : "Your account is managed by ReclaimedHQ."}
                      </p>
                    </div>
                  </div>
                  {/* Stripe portal only for legacy self-serve subscribers, not
                      ReclaimedHQ-managed tenants. */}
                  {isPro && !isManaged && (
                    <button
                      onClick={handlePortal}
                      disabled={portalLoading}
                      className={btnSecondary}
                    >
                      {portalLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4" />
                      )}
                      Manage
                    </button>
                  )}
                </div>
              </BillingCard>

              {/* Pro plan card (only when not pro) */}
              {!isPro && (
                <div className="rounded-2xl border border-[#ffd87c]/25 bg-gradient-to-br from-[#ffd87c]/[0.06] to-[#0d0d0d] p-6 overflow-hidden relative">
                  <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-[#ffd87c]/[0.08] blur-3xl pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div>
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ffd87c]/15 text-[#ffd87c] text-[10px] font-semibold uppercase tracking-wider">
                          <Sparkles className="h-3 w-3" />
                          Recommended
                        </div>
                        <h3 className="mt-3 text-xl font-bold text-white">
                          Pro Plan
                        </h3>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-3xl font-bold text-white">
                            $499
                          </span>
                          <span className="text-sm text-white/60">/month</span>
                        </div>
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-6">
                      {[
                        "Unlimited lead qualification",
                        "AI-powered scoring & summaries",
                        "Calendly integration",
                        "Lead analytics dashboard",
                        "Custom form questions",
                        "Priority email support",
                      ].map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-2.5 text-sm text-white/80"
                        >
                          <CheckCircle2 className="h-4 w-4 text-[#ffd87c] flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      className={btnGold}
                      style={{
                        background: "var(--lg-gold-gradient)",
                        width: "100%",
                      }}
                      onClick={handleCheckout}
                      disabled={checkoutLoading}
                    >
                      {checkoutLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Subscribe to Pro
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>

                    <p className="mt-3 text-[11px] text-white/50 text-center flex items-center justify-center gap-1.5">
                      <ShieldCheck className="h-3 w-3" />
                      Secured by Stripe · Cancel anytime
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* PAYMENT METHOD TAB */}
          {tab === "payment" && (
            <BillingCard
              title="Payment Method"
              description="Update your card and billing details through the secure Stripe portal."
              footer={
                <button
                  onClick={handlePortal}
                  disabled={portalLoading || !isPro || isManaged}
                  className={btnPrimary}
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                  Open Stripe Portal
                </button>
              }
            >
              {isPro ? (
                <div className="mt-2 flex items-center gap-4 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <div className="h-10 w-10 rounded-lg bg-white/[0.05] flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-[#ffd87c]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      Manage payment method via Stripe
                    </p>
                    <p className="text-xs text-white/60 mt-0.5">
                      Update card, billing address, and tax info in the portal.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.02] p-5 text-center">
                  <p className="text-sm text-white/70">
                    No payment method on file. Subscribe to Pro to add one.
                  </p>
                  <button
                    onClick={() => setTab("plan")}
                    className={`${btnSecondary} mt-4`}
                  >
                    View Plans
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </BillingCard>
          )}

          {/* INVOICES TAB */}
          {tab === "invoices" && (
            <BillingCard
              title="Invoices & Billing History"
              description="Download receipts and view past charges."
              footer={
                <button
                  onClick={handlePortal}
                  disabled={portalLoading || !isPro || isManaged}
                  className={btnPrimary}
                >
                  {portalLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Receipt className="h-4 w-4" />
                  )}
                  View Invoices
                </button>
              }
            >
              {isPro ? (
                <div className="mt-2 rounded-lg border border-white/10 bg-white/[0.03] p-5 flex items-center gap-4">
                  <Receipt className="h-5 w-5 text-[#ffd87c] flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-white font-medium">
                      Invoices are managed in your Stripe portal.
                    </p>
                    <p className="text-white/60 mt-0.5">
                      Click below to view, download, or email receipts.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-white/60">
                  You don&apos;t have any invoices yet. They&apos;ll appear here after
                  your first billing cycle.
                </p>
              )}
            </BillingCard>
          )}

          {/* USAGE TAB */}
          {tab === "usage" && (
            <BillingCard
              title="Usage"
              description="Your current usage against plan limits."
            >
              <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    label: "Plan",
                    value: isPro ? "Pro" : "Free",
                    hint: isPro ? "$499 / mo" : "Limited",
                  },
                  {
                    label: "Lead qualifications",
                    value: isPro ? "Unlimited" : "—",
                    hint: isPro ? "No cap" : "Upgrade to enable",
                  },
                  {
                    label: "AI scoring",
                    value: isPro ? "Enabled" : "Disabled",
                    hint: "Per-lead AI summary",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg border border-white/10 bg-white/[0.02] p-4"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-white/50 font-medium">
                      {s.label}
                    </p>
                    <p className="mt-1.5 text-lg font-semibold text-white">
                      {s.value}
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">{s.hint}</p>
                  </div>
                ))}
              </div>
            </BillingCard>
          )}
        </div>
      </div>
    </div>
  );
}
