"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Briefcase,
  DollarSign,
  Target,
  Calendar,
  Sliders,
  Plug,
  Code,
  Copy,
  Check,
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
  ghlLocationId: string;
  ghlPrivateToken: string;
  ghlPipelineId: string;
  ghlQualifiedStageId: string;
  ghlNewLeadStageId: string;
  ghlBookingUrl: string;
}

type TabId =
  | "about"
  | "offer"
  | "qualification"
  | "embed"
  | "booking"
  | "integrations";

const TABS: { id: TabId; label: string; icon: typeof Briefcase }[] = [
  { id: "about", label: "About", icon: Briefcase },
  { id: "offer", label: "Offer & Revenue", icon: DollarSign },
  { id: "qualification", label: "Qualification", icon: Sliders },
  { id: "embed", label: "Embed Form", icon: Code },
  { id: "booking", label: "Booking Link", icon: Calendar },
  { id: "integrations", label: "GoHighLevel", icon: Plug },
];

const NICHES = [
  "Dental & Orthodontics",
  "Med Spa & Aesthetics",
  "Roofing & Exteriors",
  "Home Services",
  "Legal Services",
  "Real Estate",
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

const btnSecondary =
  "inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition whitespace-nowrap";

// ─── Main page ──────────────────────────────────────────────────────
export default function BusinessProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<TabId>("about");
  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const formLink = useMemo(
    () =>
      typeof window !== "undefined" && session?.user?.id
        ? `${window.location.origin}/form/${session.user.id}`
        : "",
    [session?.user?.id]
  );
  const embedCode = `<iframe src="${formLink}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>`;

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
    ghlLocationId: "",
    ghlPrivateToken: "",
    ghlPipelineId: "",
    ghlQualifiedStageId: "",
    ghlNewLeadStageId: "",
    ghlBookingUrl: "",
  });
  const [original, setOriginal] = useState<BusinessProfile | null>(null);
  // Whether a GHL token is already stored (the token itself is never sent to
  // the client). Kept out of `profile` so it doesn't affect the dirty check.
  const [ghlTokenSet, setGhlTokenSet] = useState(false);

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
          ghlLocationId: data.ghlLocationId || "",
          ghlPrivateToken: "", // never returned by the API; typed to replace
          ghlPipelineId: data.ghlPipelineId || "",
          ghlQualifiedStageId: data.ghlQualifiedStageId || "",
          ghlNewLeadStageId: data.ghlNewLeadStageId || "",
          ghlBookingUrl: data.ghlBookingUrl || "",
        };
        setProfile(next);
        setOriginal(next);
        setGhlTokenSet(!!data.ghlPrivateTokenSet);
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
    // Booking links may now be Calendly OR a GoHighLevel calendar — accept any
    // valid https URL rather than forcing the Calendly domain.
    for (const [val, label] of [
      [profile.calendarLink, "booking link"],
      [profile.ghlBookingUrl, "GoHighLevel booking URL"],
    ] as const) {
      if (val.trim()) {
        try {
          const url = new URL(val.trim());
          if (url.protocol !== "https:") {
            toast.error(`Your ${label} must start with https://`);
            return;
          }
        } catch {
          toast.error(`Please enter a valid ${label} (https://…)`);
          return;
        }
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
      const payload: Record<string, unknown> = {
        name: profile.name.trim() || null,
        businessName: profile.businessName.trim() || null,
        niche: profile.niche || null,
        offerName: profile.offerName.trim() || null,
        offerPrice,
        closeRate,
        avgCallMinutes,
        calendarLink: profile.calendarLink.trim() || null,
        ghlLocationId: profile.ghlLocationId.trim() || null,
        ghlPipelineId: profile.ghlPipelineId.trim() || null,
        ghlQualifiedStageId: profile.ghlQualifiedStageId.trim() || null,
        ghlNewLeadStageId: profile.ghlNewLeadStageId.trim() || null,
        ghlBookingUrl: profile.ghlBookingUrl.trim() || null,
        scoringRules: {
          budgetWeight: 30,
          timelineWeight: 25,
          urgencyWeight: 25,
          qualityWeight: 20,
          minScore,
        },
      };
      // Only send the token when the user actually typed a new one, so routine
      // saves don't wipe the stored (encrypted) token.
      if (profile.ghlPrivateToken.trim()) {
        payload.ghlPrivateToken = profile.ghlPrivateToken.trim();
      }

      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      // Clear the token input after a successful save; mark it as stored.
      const cleared = { ...profile, ghlPrivateToken: "" };
      setProfile(cleared);
      setOriginal(cleared);
      if (payload.ghlPrivateToken) setGhlTokenSet(true);
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
                      placeholder="Summit Dental Group"
                      value={profile.businessName}
                      onChange={(e) => update("businessName", e.target.value)}
                    />
                  </Field>
                </div>
                <Field
                  label="Business niche"
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
                    hint="% of qualified calls that become customers."
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
                    label="Avg call length (min)"
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

          {tab === "embed" && (
            <>
              <ProfileCard
                title="Your form link"
                description="Share this link anywhere — ads, email, social — to collect and qualify leads automatically."
              >
                <div className="mt-2 flex items-center gap-2">
                  <input
                    value={formLink}
                    readOnly
                    className={`${inputCls} font-mono text-white/80`}
                  />
                  <button onClick={copyLink} className={btnSecondary}>
                    {linkCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </ProfileCard>

              <ProfileCard
                title="Embed on your website"
                description="Drop this snippet into any page to render your qualifying form inline."
              >
                <div className="mt-2 space-y-3">
                  <pre className="bg-black/40 border border-white/10 rounded-lg p-4 text-xs text-white/70 overflow-x-auto font-mono leading-relaxed">
                    <code>{embedCode}</code>
                  </pre>
                  <button onClick={copyEmbed} className={btnSecondary}>
                    {embedCopied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-400" /> Copied
                      </>
                    ) : (
                      <>
                        <Code className="h-4 w-4" /> Copy embed code
                      </>
                    )}
                  </button>
                </div>
              </ProfileCard>
            </>
          )}

          {tab === "booking" && (
            <ProfileCard
              title="Booking link"
              description="Where qualified leads book after submitting your form. Used as the fallback when no GoHighLevel booking URL is set."
              footer={SaveButton}
            >
              <div className="mt-2">
                <Field
                  label="Booking link (Calendly or other)"
                  hint="Qualified leads see this link instantly after submitting your form. A GoHighLevel booking URL (set in the GoHighLevel tab) takes priority over this."
                >
                  <input
                    className={inputCls}
                    placeholder="https://calendly.com/your-name/intro-call"
                    value={profile.calendarLink}
                    onChange={(e) => update("calendarLink", e.target.value)}
                  />
                </Field>
              </div>
            </ProfileCard>
          )}

          {tab === "integrations" && (
            <ProfileCard
              title="GoHighLevel"
              description="Push every scored lead into this client's GoHighLevel sub-account. Leave blank to disable — LeadGate works exactly as before when unset."
              footer={SaveButton}
            >
              <div className="mt-2 space-y-4">
                <div className="rounded-lg border border-[#ffd87c]/20 bg-[#ffd87c]/[0.05] p-4 text-xs text-white/70 leading-relaxed">
                  Generate a <span className="text-[#ffd87c]">Private Integration Token</span> in
                  the client&apos;s GHL sub-account: <span className="text-white/90">Settings →
                  Private Integrations → Create New Integration</span>, with the{" "}
                  <span className="text-white/90">contacts.write</span> and{" "}
                  <span className="text-white/90">opportunities.write</span> scopes. Find the
                  Pipeline and Stage IDs under <span className="text-white/90">Opportunities →
                  Pipelines</span>.
                </div>

                <Field
                  label="Location ID"
                  hint="The GHL sub-account (location) ID for this client."
                >
                  <input
                    className={inputCls}
                    placeholder="ve9EPM428h8vShlRW1KT"
                    value={profile.ghlLocationId}
                    onChange={(e) => update("ghlLocationId", e.target.value)}
                  />
                </Field>

                <Field
                  label="Private Integration Token"
                  hint={
                    ghlTokenSet
                      ? "A token is saved. Leave blank to keep it, or paste a new one to replace it."
                      : "Stored server-side and encrypted at rest when ENCRYPTION_KEY is configured."
                  }
                >
                  <input
                    type="password"
                    autoComplete="off"
                    className={inputCls}
                    placeholder={ghlTokenSet ? "•••••••••• saved" : "pit-xxxxxxxx-xxxx-xxxx"}
                    value={profile.ghlPrivateToken}
                    onChange={(e) => update("ghlPrivateToken", e.target.value)}
                  />
                </Field>

                <Field
                  label="Pipeline ID"
                  hint="The pipeline scored leads are added to (e.g. Client Conversion Pipeline)."
                >
                  <input
                    className={inputCls}
                    placeholder="VDm7RPYC2GLUvdpKmBfC"
                    value={profile.ghlPipelineId}
                    onChange={(e) => update("ghlPipelineId", e.target.value)}
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Qualified Stage ID"
                    hint="Qualified leads land here (e.g. Qualified)."
                  >
                    <input
                      className={inputCls}
                      placeholder="7915dedc-8f18-…"
                      value={profile.ghlQualifiedStageId}
                      onChange={(e) => update("ghlQualifiedStageId", e.target.value)}
                    />
                  </Field>
                  <Field
                    label="New Lead Stage ID"
                    hint="Disqualified leads land here for nurture (e.g. New Lead)."
                  >
                    <input
                      className={inputCls}
                      placeholder="a1b2c3d4-…"
                      value={profile.ghlNewLeadStageId}
                      onChange={(e) => update("ghlNewLeadStageId", e.target.value)}
                    />
                  </Field>
                </div>

                <Field
                  label="GoHighLevel booking URL"
                  hint="Qualified leads are sent here instead of the Calendly booking link. Leave blank to use the Booking Link tab."
                >
                  <input
                    className={inputCls}
                    placeholder="https://api.leadconnectorhq.com/widget/booking/…"
                    value={profile.ghlBookingUrl}
                    onChange={(e) => update("ghlBookingUrl", e.target.value)}
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
