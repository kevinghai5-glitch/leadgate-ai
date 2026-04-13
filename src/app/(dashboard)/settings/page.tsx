"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import {
  Calendar,
  Sliders,
  Copy,
  Save,
  Loader2,
  LinkIcon,
  Code,
  Check,
  ArrowUp,
  ArrowDown,
  ListChecks,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

// ─── Collapsible Section ─────────────────────────────────────────────
function CollapsibleCard({
  icon,
  title,
  description,
  children,
  defaultOpen = false,
  onMoveUp,
  onMoveDown,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="glass-card rounded-xl transition-shadow">
      <div className="cursor-pointer select-none p-6" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={onMoveUp}
                disabled={!onMoveUp}
                className="p-0.5 rounded hover:bg-white/10 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                aria-label="Move up"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={onMoveDown}
                disabled={!onMoveDown}
                className="p-0.5 rounded hover:bg-white/10 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                aria-label="Move down"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                {icon}
                {title}
              </div>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Interfaces ──────────────────────────────────────────────────────
interface Settings {
  id: string;
  email: string;
  name: string | null;
  calendarLink: string | null;
  rules: {
    budgetWeight: number;
    timelineWeight: number;
    urgencyWeight: number;
    qualityWeight: number;
    minScore: number;
  } | null;
}

type SectionId = "formLink" | "embed" | "customQuestions" | "calendly" | "minScore";

interface Section {
  id: SectionId;
  label: string;
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session } = useSession();
  const [, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [calendarLink, setCalendarLink] = useState("");
  const [minScore, setMinScore] = useState(6);

  const defaultSections: Section[] = [
    { id: "formLink", label: "Form Link" },
    { id: "embed", label: "Embed Form" },
    { id: "customQuestions", label: "Custom Questions" },
    { id: "calendly", label: "Calendly Integration" },
    { id: "minScore", label: "Minimum Qualifying Score" },
  ];

  const [sectionOrder, setSectionOrder] = useState<Section[]>(defaultSections);

  // Load section order from localStorage
  useEffect(() => {
    const userEmail = session?.user?.email;
    if (!userEmail) return;
    try {
      const stored = localStorage.getItem(`sectionOrder_${userEmail}`);
      if (stored) {
        const parsed = JSON.parse(stored) as SectionId[];
        const reordered = parsed
          .map((id) => defaultSections.find((s) => s.id === id))
          .filter((s): s is Section => !!s);
        // Add any new sections that weren't in stored order
        for (const s of defaultSections) {
          if (!reordered.find((r) => r.id === s.id)) reordered.push(s);
        }
        setSectionOrder(reordered);
      }
    } catch {
      // ignore parse errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.email]);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setCalendarLink(data.calendarLink || "");
        if (data.rules) {
          setMinScore(data.rules.minScore);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    // Validate Calendly URL if provided
    if (calendarLink.trim()) {
      try {
        const url = new URL(calendarLink.trim());
        if (!url.href.startsWith("https://calendly.com/")) {
          toast.error("Calendly link must start with https://calendly.com/");
          return;
        }
      } catch {
        toast.error("Please enter a valid Calendly URL");
        return;
      }
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarLink: calendarLink.trim() || null,
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
        toast.error(data.error || "Failed to save settings");
        return;
      }
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  function moveSection(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sectionOrder.length) return;
    setSectionOrder((prev) => {
      const updated = [...prev];
      [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
      // Persist to localStorage
      const userEmail = session?.user?.email;
      if (userEmail) {
        try {
          localStorage.setItem(
            `sectionOrder_${userEmail}`,
            JSON.stringify(updated.map((s) => s.id))
          );
        } catch {
          // ignore storage errors
        }
      }
      return updated;
    });
  }

  const formLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/form/${session?.user?.id}`
      : "";

  const [embedCopied, setEmbedCopied] = useState(false);

  function copyFormLink() {
    navigator.clipboard.writeText(formLink);
    toast.success("Form link copied!");
  }

  const embedCode = `<iframe src="${formLink}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>`;

  function copyEmbedCode() {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setEmbedCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ECCA66]" />
      </div>
    );
  }

  function renderSection(section: Section, index: number) {
    const canMoveUp = index > 0;
    const canMoveDown = index < sectionOrder.length - 1;

    switch (section.id) {
      case "formLink":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<LinkIcon className="h-5 w-5 text-[#ECCA66]" />}
            title="Your Form Link"
            description="Share this link with prospects to collect and qualify leads"
            defaultOpen
            onMoveUp={canMoveUp ? () => moveSection(index, "up") : undefined}
            onMoveDown={canMoveDown ? () => moveSection(index, "down") : undefined}
          >
            <div className="flex items-center gap-2">
              <input
                value={formLink}
                readOnly
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300 font-mono focus:outline-none"
              />
              <button
                onClick={copyFormLink}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-medium transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </CollapsibleCard>
        );

      case "embed":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<Code className="h-5 w-5 text-[#ECCA66]" />}
            title="Embed Form"
            description="Add this code to your website to embed the lead qualification form"
            onMoveUp={canMoveUp ? () => moveSection(index, "up") : undefined}
            onMoveDown={canMoveDown ? () => moveSection(index, "down") : undefined}
          >
            <div className="space-y-3">
              <div className="relative">
                <pre className="bg-white/[0.04] border border-white/10 rounded-lg p-4 text-sm text-gray-400 overflow-x-auto">
                  <code>{embedCode}</code>
                </pre>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyEmbedCode}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-medium transition-colors"
                >
                  {embedCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Paste this code into any HTML page to embed your lead form.
                The form will adapt to the container width.
              </p>
            </div>
          </CollapsibleCard>
        );

      case "customQuestions":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<ListChecks className="h-5 w-5 text-[#ECCA66]" />}
            title="Custom Form Builder"
            description="Build your own lead form with custom questions"
            defaultOpen
            onMoveUp={canMoveUp ? () => moveSection(index, "up") : undefined}
            onMoveDown={canMoveDown ? () => moveSection(index, "down") : undefined}
          >
            <Link
              href="/dashboard/form-builder"
              className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#D2AC47]/20 transition-all group"
            >
              <div>
                <p className="text-sm font-medium text-white group-hover:text-[#ECCA66] transition-colors">
                  Open Form Builder
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Add custom questions to qualify leads your way
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-[#D2AC47] transition-colors" />
            </Link>
          </CollapsibleCard>
        );

      case "calendly":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<Calendar className="h-5 w-5 text-[#ECCA66]" />}
            title="Calendly Integration"
            description="Qualified leads will be shown a booking link after form submission"
            onMoveUp={canMoveUp ? () => moveSection(index, "up") : undefined}
            onMoveDown={canMoveDown ? () => moveSection(index, "down") : undefined}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Calendly Link</label>
              <input
                placeholder="https://calendly.com/your-name/30min"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2AC47]/50"
              />
              <p className="text-sm text-gray-500">
                Enter your Calendly scheduling link. Qualified leads will see
                this after submitting the form and can book a call directly.
              </p>
            </div>
          </CollapsibleCard>
        );

      case "minScore":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<Sliders className="h-5 w-5 text-[#ECCA66]" />}
            title="Minimum Qualifying Score"
            description="Set the threshold for lead qualification"
            defaultOpen
            onMoveUp={canMoveUp ? () => moveSection(index, "up") : undefined}
            onMoveDown={canMoveDown ? () => moveSection(index, "down") : undefined}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Minimum Qualifying Score (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2AC47]/50"
              />
              <p className="text-sm text-gray-500">
                Leads scoring at or above this number will be marked as qualified
                and shown the booking calendar.
              </p>
            </div>
          </CollapsibleCard>
        );
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500">
          Configure your lead qualification pipeline. Use arrows to reorder sections.
        </p>
      </div>

      {sectionOrder.map((section, index) => renderSection(section, index))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#D2AC47] to-[#B08B73] hover:from-[#ECCA66] hover:to-[#D2AC47] text-black text-sm font-semibold shadow-[0_0_20px_rgba(210,172,71,0.15)] hover:shadow-[0_0_28px_rgba(210,172,71,0.25)] transition-all disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
