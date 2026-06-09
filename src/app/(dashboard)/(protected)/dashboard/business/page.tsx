"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Briefcase,
  DollarSign,
  Target,
  Calendar,
  Sliders,
} from "lucide-react";

interface BusinessProfile {
  name: string;
  businessName: string;
  niche: string;
  offerName: string;
  offerPrice: string;
  closeRate: string;
  avgCallMinutes: string;
  calendarLink: string;
  minScore: string;
}

type TabId = "about" | "offer" | "qualification" | "booking";

const TABS: { id: TabId; label: string; icon: typeof Briefcase }[] = [
  { id: "about", label: "About", icon: Briefcase },
  { id: "offer", label: "Offer & Revenue", icon: DollarSign },
  { id: "qualification", label: "Qualification", icon: Sliders },
  { id: "booking", label: "Booking Link", icon: Calendar },
];

const NICHES = [
  "Fitness Coaching",
  "Business Coaching",
  "Mindset Coaching",
  "Executive Coaching",
  "Relationship Coaching",
  "Career Coaching",
  "Health & Wellness",
  "Other",
];

// ─── Reusable components (mirrors settings/billing) ─────────────────
function ProfileCard({
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

const selectCls =
  "flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";

const btnPrimary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition";

// ─── Main page ──────────────────────────────────────────────────────
export default function BusinessProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabId>("about");
  const [profile, setProfile] = useState<BusinessProfile>({
    name: "",
    businessName: "",
    niche: "",
    offerName: "",
    offerPrice: "",
    closeRate: "25",
    avgCallMinutes: "30",
    calendarLink: "",
    minScore: "6",
  });
  const [original, setOriginal] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const next: BusinessProfile = {
          name: data.name || "",
          businessName: data.businessName || "",
          niche: data.niche || "",
          offerName: data.offerName || "",
          offerPrice: data.offerPrice != null ? String(data.offerPrice) : "",
          closeRate: data.closeRate != null ? String(data.closeRate) : "25",
          avgCallMinutes:
            data.avgCallMinutes != null ? String(data.avgCallMinutes) : "30",
          calendarLink: data.calendarLink || "",
          minScore:
            data.rules?.minScore != null ? String(data.rules.minScore) : "6",
        };
        setProfile(next);
        setOriginal(next);
      })
      .catch(() => toast.error("Failed to load your business profile"))
      .finally(() => setLoading(false));
  }, []);

  function update<K extends keyof BusinessProfile>(key: K, value: string) {
    setProfile((prev) => ({ ...prev, [key]: value }));
  }

  const dirty = useMemo(
    () => !!original && JSON.stringify(original) !== JSON.stringify(profile),
    [original, profile]
  );

  async function handleSave() {
    if (profile.calendarLink.trim()) {
      try {
        const url = new URL(profile.calendarLink.trim());
        if (!url.href.startsWith("https://calendly.com/")) {
          toast.error("Calendly link must start with https://calendly.com/");
          return;
        }
      } catch {
        toast.error("Please enter a valid Calendly URL");
        return;
      }
    }

    const offerPrice = profile.offerPrice ? Number(profile.offerPrice) : null;
    const closeRate = profile.closeRate ? Number(profile.closeRate) : null;
    const avgCallMinutes = profile.avgCallMinutes
      ? Number(profile.avgCallMinutes)
      : null;
    const minScore = profile.minScore ? Number(profile.minScore) : 6;

    if (offerPrice !== null && (isNaN(offerPrice) || offerPrice < 0)) {
      toast.error("Offer price must be a positive number.");
      return;
    }
    if (
      closeRate !== null &&
      (isNaN(closeRate) || closeRate < 0 || closeRate > 100)
    ) {
      toast.error("Close rate must be between 0 and 100.");
      return;
    }
    if (
      avgCallMinutes !== null &&
      (isNaN(avgCallMinutes) || avgCallMinutes < 0)
    ) {
      toast.error("Call duration must be a positive number.");
      return;
    }
    if (isNaN(minScore) || minScore < 1 || minScore > 10) {
      toast.error("Minimum qualifying score must be 1–10.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile.name.trim() || null,
          businessName: profile.businessName.trim() || null,
          niche: profile.niche || null,
          offerName: profile.offerName.trim() || null,
          offerPrice,
          closeRate,
          avgCallMinutes,
          calendarLink: profile.calendarLink.trim() || null,
          scoringRules: {
            budgetWeight: 30,
            timelineWeight: 25,
            urgencyWeight: 25,
            qualityWeight: 20,
            minScore,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      setOriginal(profile);
      toast.success("Business profile saved");
    } catch {
      toast.error("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  const projectedPerQualified =
    profile.offerPrice && profile.closeRate
      ? Math.round(Number(profile.offerPrice) * (Number(profile.closeRate) / 100))
      : null;

  const SaveButton = (
    <button
      onClick={handleSave}
      disabled={saving || !dirty}
      className={btnPrimary}
    >
      {saving ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Saving…
        </>
      ) : (
        <>
          <Save className="h-4 w-4" />
          {dirty ? "Save Changes" : "Saved"}
        </>
      )}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Business Profile
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Tell LeadGate about your business so projected revenue and time-saved
          numbers reflect reality.
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
          {tab === "about" && (
            <ProfileCard
              title="About your business"
              description="The basics. We use this to personalize the AI's qualification."
              footer={SaveButton}
            >
              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Your name">
                    <input
                      className={inputCls}
                      placeholder="Jane Smith"
                      value={profile.name}
                      onChange={(e) => update("name", e.target.value)}
                    />
                  </Field>
                  <Field label="Business name">
                    <input
                      className={inputCls}
                      placeholder="Velocity Coaching"
                      value={profile.businessName}
                      onChange={(e) => update("businessName", e.target.value)}
                    />
                  </Field>
                </div>
                <Field
                  label="Coaching niche"
                  hint="Used to help the AI tailor its qualification scoring to your niche."
                >
                  <select
                    className={selectCls}
                    value={profile.niche}
                    onChange={(e) => update("niche", e.target.value)}
                  >
                    <option value="" className="bg-[#0d0d0d]">
                      Select your niche…
                    </option>
                    {NICHES.map((n) => (
                      <option key={n} value={n} className="bg-[#0d0d0d]">
                        {n}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </ProfileCard>
          )}

          {tab === "offer" && (
            <ProfileCard
              title="Offer & revenue model"
              description="Drives the projected revenue figures on your dashboard."
              footer={SaveButton}
            >
              <div className="mt-2 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Offer name">
                    <input
                      className={inputCls}
                      placeholder="12-Week Transformation Program"
                      value={profile.offerName}
                      onChange={(e) => update("offerName", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Offer price ($)"
                    hint="What one qualified client pays for your offer."
                  >
                    <input
                      type="number"
                      min={0}
                      className={inputCls}
                      placeholder="3000"
                      value={profile.offerPrice}
                      onChange={(e) => update("offerPrice", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Estimated close rate (%)"
                    hint="% of qualified discovery calls that become clients."
                  >
                    <input
                      type="number"
                      min={0}
                      max={100}
                      className={inputCls}
                      placeholder="25"
                      value={profile.closeRate}
                      onChange={(e) => update("closeRate", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Avg discovery call (min)"
                    hint="Used to estimate the time saved by filtering tire-kickers."
                  >
                    <input
                      type="number"
                      min={0}
                      className={inputCls}
                      placeholder="30"
                      value={profile.avgCallMinutes}
                      onChange={(e) => update("avgCallMinutes", e.target.value)}
                    />
                  </Field>
                </div>
                {projectedPerQualified !== null && (
                  <div className="rounded-lg border border-[#ffd87c]/20 bg-[#ffd87c]/[0.05] p-4 text-sm text-[#ffd87c] flex items-center gap-3">
                    <DollarSign className="h-4 w-4 flex-shrink-0" />
                    <span>
                      Each qualified lead is worth roughly{" "}
                      <span className="font-semibold">
                        ${projectedPerQualified.toLocaleString()}
                      </span>{" "}
                      in projected revenue.
                    </span>
                  </div>
                )}
              </div>
            </ProfileCard>
          )}

          {tab === "qualification" && (
            <ProfileCard
              title="Qualification threshold"
              description="The minimum AI score required for a lead to be marked qualified."
              footer={SaveButton}
            >
              <div className="mt-2">
                <Field
                  label="Minimum qualifying score (1–10)"
                  hint="Leads at or above this AI score get marked qualified and see your booking link."
                >
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#ffd87c]" />
                    <input
                      type="number"
                      min={1}
                      max={10}
                      className={`${inputCls} pl-10`}
                      value={profile.minScore}
                      onChange={(e) => update("minScore", e.target.value)}
                    />
                  </div>
                </Field>
              </div>
            </ProfileCard>
          )}

          {tab === "booking" && (
            <ProfileCard
              title="Booking link"
              description="Where qualified leads book a discovery call after submitting your form."
              footer={SaveButton}
            >
              <div className="mt-2">
                <Field
                  label="Calendly link"
                  hint="Qualified leads see this link instantly after submitting your form."
                >
                  <input
                    className={inputCls}
                    placeholder="https://calendly.com/your-name/discovery-call"
                    value={profile.calendarLink}
                    onChange={(e) => update("calendarLink", e.target.value)}
                  />
                </Field>
              </div>
            </ProfileCard>
          )}
        </div>
      </div>
    </div>
  );
}
