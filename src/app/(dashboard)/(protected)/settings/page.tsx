"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Copy,
  Loader2,
  LinkIcon,
  Code,
  Check,
  ArrowRight,
  User as UserIcon,
  CreditCard,
  Briefcase,
  ListChecks,
  Shield,
  LogOut,
  AlertTriangle,
  Mail,
} from "lucide-react";

// ─── Interfaces ──────────────────────────────────────────────────────
interface SettingsData {
  id: string;
  email: string;
  name: string | null;
  calendarLink: string | null;
  businessName: string | null;
  niche: string | null;
  offerName: string | null;
  offerPrice: number | null;
  closeRate: number | null;
  avgCallMinutes: number | null;
  stripeSubscriptionStatus: string | null;
}

type TabId =
  | "account"
  | "business"
  | "form"
  | "questions"
  | "billing"
  | "danger";

const TABS: { id: TabId; label: string; icon: typeof UserIcon }[] = [
  { id: "account", label: "Account", icon: UserIcon },
  { id: "business", label: "Business Profile", icon: Briefcase },
  { id: "form", label: "Form & Embed", icon: LinkIcon },
  { id: "questions", label: "Custom Questions", icon: ListChecks },
  { id: "billing", label: "Plan & Billing", icon: CreditCard },
  { id: "danger", label: "Danger Zone", icon: Shield },
];

// ─── Reusable Card ───────────────────────────────────────────────────
function SettingsCard({
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

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-white/50">{hint}</p>}
    </div>
  );
}

const inputCls =
  "flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";

const btnPrimary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition";

const btnSecondary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition";

const btnDanger =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/[0.08] hover:bg-red-500/[0.14] text-red-300 text-sm font-medium transition";

// ─── Main Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session } = useSession();
  const [tab, setTab] = useState<TabId>("account");
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Account form state
  const [nameDraft, setNameDraft] = useState("");
  const [calendarDraft, setCalendarDraft] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d: SettingsData) => {
        setData(d);
        setNameDraft(d.name ?? "");
        setCalendarDraft(d.calendarLink ?? "");
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setLoading(false);
      });
  }, []);

  const accountDirty =
    (data?.name ?? "") !== nameDraft ||
    (data?.calendarLink ?? "") !== calendarDraft;

  async function saveAccount() {
    setSavingAccount(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameDraft || null,
          calendarLink: calendarDraft || null,
        }),
      });
      if (!res.ok) throw new Error();
      setData((prev) =>
        prev
          ? { ...prev, name: nameDraft || null, calendarLink: calendarDraft || null }
          : prev
      );
      toast.success("Account updated");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingAccount(false);
    }
  }

  const formLink = useMemo(
    () =>
      typeof window !== "undefined" && session?.user?.id
        ? `${window.location.origin}/form/${session.user.id}`
        : "",
    [session?.user?.id]
  );

  const embedCode = `<iframe src="${formLink}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>`;

  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(formLink);
    setLinkCopied(true);
    toast.success("Form link copied");
    setTimeout(() => setLinkCopied(false), 1500);
  }
  function copyEmbed() {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    toast.success("Embed code copied");
    setTimeout(() => setEmbedCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  if (!data) return null;

  // Avatar initials
  const displayName = data.name || data.email.split("@")[0];
  const initials = displayName
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const planStatus = data.stripeSubscriptionStatus ?? "free";
  const isPro = ["active", "trialing"].includes(planStatus);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-sm text-white/60 mt-1">
          Manage your account, profile, and how leads flow into your business.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="lg:w-56 flex-shrink-0">
          <nav className="space-y-0.5 lg:sticky lg:top-4">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = tab === t.id;
              const isDanger = t.id === "danger";
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? isDanger
                        ? "bg-red-500/[0.08] text-red-300"
                        : "bg-white/[0.06] text-white"
                      : isDanger
                        ? "text-red-400/70 hover:bg-red-500/[0.05] hover:text-red-300"
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
          {tab === "account" && (
            <>
              <SettingsCard
                title="Profile"
                description="This information is used across your dashboard."
                footer={
                  <button
                    onClick={saveAccount}
                    disabled={!accountDirty || savingAccount}
                    className={btnPrimary}
                  >
                    {savingAccount && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Save changes
                  </button>
                }
              >
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-white/[0.06]">
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center text-lg font-bold text-black"
                    style={{ background: "var(--lg-gold-gradient)" }}
                  >
                    {initials || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-sm text-white/60 truncate">{data.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Full name">
                    <input
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      placeholder="Your name"
                      className={inputCls}
                    />
                  </Field>
                  <Field label="Email" hint="Contact support to change your email.">
                    <input
                      value={data.email}
                      readOnly
                      className={`${inputCls} cursor-not-allowed opacity-70`}
                    />
                  </Field>
                  <div className="md:col-span-2">
                    <Field
                      label="Calendly link"
                      hint="Qualified leads see this link after submitting your form."
                    >
                      <input
                        value={calendarDraft}
                        onChange={(e) => setCalendarDraft(e.target.value)}
                        placeholder="https://calendly.com/your-handle/discovery-call"
                        className={inputCls}
                      />
                    </Field>
                  </div>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Account"
                description="Sign out of this device or contact support."
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-4 w-4 text-white/60" />
                      <div>
                        <p className="text-sm text-white font-medium">User ID</p>
                        <p className="text-xs text-white/50 font-mono">
                          {data.id}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(data.id);
                        toast.success("User ID copied");
                      }}
                      className="text-white/40 hover:text-white"
                      aria-label="Copy user ID"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between py-3 px-4 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-white/60" />
                      <div>
                        <p className="text-sm text-white font-medium">
                          Need help?
                        </p>
                        <p className="text-xs text-white/50">
                          Email support@leadgate.ai
                        </p>
                      </div>
                    </div>
                    <a
                      href="mailto:support@leadgate.ai"
                      className={btnSecondary}
                    >
                      Contact
                    </a>
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={`${btnSecondary} w-full justify-center`}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </SettingsCard>
            </>
          )}

          {tab === "business" && (
            <SettingsCard
              title="Business Profile"
              description="Set your offer, close rate, and qualifying score — these power your dashboard projections."
            >
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Stat label="Offer" value={data.offerName ?? "Not set"} />
                  <Stat
                    label="Offer price"
                    value={data.offerPrice ? `$${data.offerPrice.toLocaleString()}` : "Not set"}
                  />
                  <Stat
                    label="Close rate"
                    value={data.closeRate != null ? `${data.closeRate}%` : "Not set"}
                  />
                  <Stat
                    label="Avg call duration"
                    value={
                      data.avgCallMinutes != null
                        ? `${data.avgCallMinutes} min`
                        : "Not set"
                    }
                  />
                </div>
                <Link
                  href="/dashboard/business"
                  className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#ffd87c]/30 transition-all group"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      Open Business Profile
                    </p>
                    <p className="text-xs text-white/50 mt-0.5">
                      Edit offer, pricing, niche, and qualifying threshold
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-[#ffd87c] transition-colors" />
                </Link>
              </div>
            </SettingsCard>
          )}

          {tab === "form" && (
            <>
              <SettingsCard
                title="Your form link"
                description="Share this link with prospects to collect and qualify leads automatically."
              >
                <div className="flex items-center gap-2">
                  <input
                    value={formLink}
                    readOnly
                    className={`${inputCls} font-mono text-white/80`}
                  />
                  <button onClick={copyLink} className={btnSecondary}>
                    {linkCopied ? (
                      <Check className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {linkCopied ? "Copied" : "Copy"}
                  </button>
                </div>
              </SettingsCard>

              <SettingsCard
                title="Embed on your website"
                description="Drop this snippet into any page to render your qualifying form inline."
              >
                <div className="space-y-3">
                  <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-white/70 overflow-x-auto font-mono leading-relaxed">
                    <code>{embedCode}</code>
                  </pre>
                  <button onClick={copyEmbed} className={btnSecondary}>
                    {embedCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4" />
                        Copy embed code
                      </>
                    )}
                  </button>
                </div>
              </SettingsCard>
            </>
          )}

          {tab === "questions" && (
            <SettingsCard
              title="Custom Form Builder"
              description="Tailor the qualifying questions every prospect answers."
            >
              <Link
                href="/dashboard/form-builder"
                className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#ffd87c]/30 transition-all group"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    Open Form Builder
                  </p>
                  <p className="text-xs text-white/50 mt-0.5">
                    Add, reorder, or remove custom questions
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-white/40 group-hover:text-[#ffd87c] transition-colors" />
              </Link>
            </SettingsCard>
          )}

          {tab === "billing" && (
            <SettingsCard
              title="Plan & Billing"
              description="Manage your subscription, invoices, and payment method."
            >
              <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/[0.03] mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">
                      Current plan:
                    </span>
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        isPro
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
                          : "bg-white/[0.06] text-white/70 border border-white/10"
                      }`}
                    >
                      {isPro ? "Pro" : "Free"}
                    </span>
                  </div>
                  <p className="text-xs text-white/50 mt-1 capitalize">
                    Status: {planStatus}
                  </p>
                </div>
                <Link href="/billing" className={btnPrimary}>
                  {isPro ? "Manage" : "Upgrade"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              <p className="text-xs text-white/50">
                Invoices, payment methods, and cancellation are handled in the
                billing portal.
              </p>
            </SettingsCard>
          )}

          {tab === "danger" && (
            <SettingsCard
              title="Danger Zone"
              description="Irreversible actions. Proceed with caution."
            >
              <div className="rounded-lg border border-red-500/20 bg-red-500/[0.04] p-4">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Delete account
                    </p>
                    <p className="text-xs text-white/60 mt-1">
                      Permanently delete your account, all leads, and form
                      data. This cannot be undone.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toast.error(
                      "Account deletion is not yet automated. Email support@leadgate.ai to request deletion."
                    )
                  }
                  className={btnDanger}
                >
                  Delete account
                </button>
              </div>
            </SettingsCard>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/[0.05] bg-white/[0.02] px-3 py-2.5">
      <p className="text-[11px] uppercase tracking-wide text-white/50 font-medium">
        {label}
      </p>
      <p className="text-sm text-white font-medium mt-0.5 truncate">{value}</p>
    </div>
  );
}
