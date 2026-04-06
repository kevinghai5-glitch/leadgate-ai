"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface BillingInfo {
  stripeSubscriptionStatus: string | null;
}

export default function BillingPage() {
  const [billing, setBilling] = useState<BillingInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setBilling({
          stripeSubscriptionStatus: data.stripeSubscriptionStatus,
        });
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
        alert("Stripe not configured");
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      alert("Stripe not configured");
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
        alert("Stripe not configured");
      } else {
        toast.error(data.error || "Failed to open billing portal");
      }
    } catch {
      alert("Stripe not configured");
    } finally {
      setPortalLoading(false);
    }
  }

  const isActive = billing?.stripeSubscriptionStatus === "active";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-500">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-1">
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                <CreditCard className="h-5 w-5 text-[#D4A017]" />
                Current Plan
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Your current subscription status
              </p>
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isActive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
        <div className="px-6 pb-6">
          {isActive ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div>
                  <p className="font-semibold text-emerald-300">Pro Plan</p>
                  <p className="text-sm text-emerald-400/70">$499/month</p>
                </div>
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              </div>
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {portalLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ExternalLink className="h-4 w-4" />
                )}
                Manage Subscription
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-[#FFD700]/30 p-6 bg-[#FFD700]/[0.04]">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Pro Plan
                    </h3>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-3xl font-bold text-white">
                        $499
                      </span>
                      <span className="text-gray-500">/month</span>
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {[
                    "Unlimited lead qualification",
                    "AI-powered scoring & summaries",
                    "Calendly integration",
                    "Lead analytics dashboard",
                    "Custom form questions",
                  ].map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#D4A017] flex-shrink-0" />
                      <span className="text-sm text-gray-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black text-sm font-semibold shadow-[0_0_20px_rgba(255,215,0,0.15)] hover:shadow-[0_0_28px_rgba(255,215,0,0.25)] transition-all disabled:opacity-50"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Subscribe to Pro"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
