"use client";

import { useEffect, useState, use, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  Bot,
  Trash2,
  Loader2,
  AtSign,
  Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  budget: string;
  timeline: string;
  problemDescription: string;
  aiScore: number | null;
  aiReasoning: string | null;
  aiSummary: string | null;
  status: string;
  source: string | null;
  createdAt: string;
}

// ─── Reusable ───────────────────────────────────────────────────────
function DetailCard({
  title,
  description,
  children,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden">
      {title && (
        <div className="p-6 space-y-1">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          {description && (
            <p className="text-sm text-white/60">{description}</p>
          )}
        </div>
      )}
      <div className={title ? "px-6 pb-6" : "p-6"}>{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-8 w-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-white/60" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/50">
          {label}
        </p>
        <p className="text-sm font-medium text-white mt-0.5 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

const btnDanger =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/[0.08] hover:bg-red-500/[0.14] text-red-300 text-sm font-medium transition disabled:opacity-50";

const btnSecondary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition";

// ─── Main ───────────────────────────────────────────────────────────
export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  async function updateStatus(status: string) {
    if (!lead || status === lead.status) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        toast.error("Failed to update status");
        return;
      }
      const updated = await res.json();
      setLead(updated);
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  useEffect(() => {
    fetch(`/api/leads/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setLead(data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load lead");
        setLoading(false);
      });
  }, [id]);

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    setDeleting(true);
    try {
      const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
      if (!res.ok) {
        toast.error("Failed to delete lead");
        return;
      }
      toast.success("Lead deleted");
      router.push("/dashboard/leads");
    } catch {
      toast.error("Failed to delete lead");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="max-w-6xl mx-auto text-center py-16">
        <h2 className="text-xl font-semibold text-white">Lead not found</h2>
        <button
          className={`${btnSecondary} mt-4`}
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  const score = lead.aiScore ?? 0;
  const scoreStyles =
    score >= 8
      ? "from-emerald-500/40 to-emerald-500/10 text-emerald-300 ring-emerald-500/40"
      : score >= 6
        ? "from-blue-500/40 to-blue-500/10 text-blue-300 ring-blue-500/40"
        : score >= 4
          ? "from-amber-500/40 to-amber-500/10 text-amber-300 ring-amber-500/40"
          : "from-rose-500/40 to-rose-500/10 text-rose-300 ring-rose-500/40";

  const initials = lead.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const statusStyles =
    lead.status === "QUALIFIED"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : lead.status === "DISQUALIFIED"
        ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
        : "bg-white/[0.04] text-white/60 border-white/10";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </button>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="h-14 w-14 rounded-2xl flex items-center justify-center text-lg font-bold text-black flex-shrink-0"
            style={{ background: "var(--lg-gold-gradient)" }}
          >
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {lead.name}
            </h1>
            <p className="text-sm text-white/60">{lead.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              Status
            </span>
            <select
              value={lead.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updatingStatus}
              aria-label="Lead status"
              className={`h-9 rounded-lg border pl-3 pr-8 text-[10px] font-semibold uppercase tracking-wider cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ffd87c]/40 disabled:opacity-50 ${statusStyles}`}
            >
              <option value="QUALIFIED" className="bg-[#0d0d0d] text-white normal-case">Qualified</option>
              <option value="DISQUALIFIED" className="bg-[#0d0d0d] text-white normal-case">Disqualified</option>
              <option value="PENDING" className="bg-[#0d0d0d] text-white normal-case">Pending</option>
            </select>
          </div>
          <button
            className={btnDanger}
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <DetailCard
            title="Contact Information"
            description="How to reach this lead."
          >
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoRow icon={Mail} label="Email" value={lead.email} />
              <InfoRow
                icon={Phone}
                label="Phone"
                value={lead.phone || <span className="text-white/40">—</span>}
              />
              {lead.company && (
                <InfoRow icon={AtSign} label="Instagram" value={lead.company} />
              )}
              <InfoRow
                icon={Clock}
                label="Submitted"
                value={format(
                  new Date(lead.createdAt),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              />
            </div>
          </DetailCard>

          <DetailCard
            title="Form Answers"
            description="What the lead told you on your qualification form."
          >
            <p className="mt-2 text-sm text-white/80 whitespace-pre-wrap leading-relaxed">
              {lead.problemDescription}
            </p>
          </DetailCard>
        </div>

        {/* Right (1 col) */}
        <div className="space-y-6">
          <DetailCard>
            <div className="flex items-center gap-2 text-base font-semibold text-white mb-4">
              <Bot className="h-5 w-5 text-[#ffd87c]" />
              AI Score
            </div>
            <div className="text-center">
              <div
                className={`mx-auto h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold bg-gradient-to-br ring-2 ${scoreStyles}`}
              >
                {lead.aiScore ?? "—"}
              </div>
              <p className="mt-3 text-xs text-white/60">out of 10</p>
              {lead.aiScore !== null && (
                <span
                  className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                    lead.aiScore >= 8
                      ? "bg-emerald-500/15 text-emerald-300"
                      : lead.aiScore >= 6
                        ? "bg-amber-500/15 text-amber-300"
                        : "bg-rose-500/15 text-rose-300"
                  }`}
                >
                  {lead.aiScore >= 8
                    ? "High Intent"
                    : lead.aiScore >= 6
                      ? "Medium Intent"
                      : "Low Intent"}
                </span>
              )}
            </div>
          </DetailCard>

          {lead.aiReasoning && (
            <DetailCard title="AI Reasoning">
              <p className="mt-1 text-sm text-white/70 leading-relaxed">
                {lead.aiReasoning}
              </p>
            </DetailCard>
          )}

          {lead.aiSummary && (
            <div className="rounded-xl border border-[#ffd87c]/25 bg-gradient-to-br from-[#ffd87c]/[0.08] to-[#0d0d0d] overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 text-base font-semibold text-[#ffd87c] mb-1">
                  <Sparkles className="h-4 w-4" />
                  Lead Summary
                </div>
                <p className="text-xs text-white/60 mb-3">
                  AI-generated sales preparation
                </p>
                <div className="text-sm text-white/85 leading-relaxed space-y-3">
                  {lead.aiSummary.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
