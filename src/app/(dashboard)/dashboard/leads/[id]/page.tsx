"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Clock,
  Bot,
  Trash2,
  Loader2,
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
      await fetch(`/api/leads/${id}`, { method: "DELETE" });
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-white">Lead not found</h2>
        <button
          className="mt-4 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:bg-white/[0.06] transition-colors text-sm"
          onClick={() => router.back()}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors md:mb-0 -mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">{lead.name}</h1>
          <p className="text-gray-500">{lead.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
              lead.status === "QUALIFIED"
                ? "bg-emerald-500/15 text-emerald-400"
                : lead.status === "DISQUALIFIED"
                ? "bg-rose-500/15 text-rose-400"
                : "bg-gray-500/15 text-gray-400"
            }`}
          >
            {lead.status}
          </span>
          <button
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-sm font-medium transition-colors disabled:opacity-50"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-white">{lead.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-white">{lead.phone || "Not provided"}</p>
                </div>
              </div>
              {lead.company && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Company</p>
                    <p className="font-medium text-white">{lead.company}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Submitted</p>
                  <p className="font-medium text-white">
                    {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Form Answers</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="font-medium text-white">{lead.budget}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Timeline</p>
                  <p className="font-medium text-white">{lead.timeline}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/[0.06]">
              <p className="text-sm text-gray-500 mb-2">Responses</p>
              <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                {lead.problemDescription}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
              <Bot className="h-5 w-5 text-indigo-400" />
              AI Score
            </h3>
            <div className="text-center">
              <div
                className={`inline-flex items-center justify-center h-20 w-20 rounded-full text-3xl font-bold ${
                  (lead.aiScore || 0) >= 8
                    ? "bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/30"
                    : (lead.aiScore || 0) >= 6
                    ? "bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/30"
                    : (lead.aiScore || 0) >= 4
                    ? "bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/30"
                    : "bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/30"
                }`}
              >
                {lead.aiScore || "—"}
              </div>
              <p className="mt-2 text-sm text-gray-500">out of 10</p>
              {lead.aiScore !== null && (
                <span
                  className={`inline-flex items-center mt-3 px-3 py-1 rounded-full text-sm font-semibold ${
                    lead.aiScore >= 8
                      ? "bg-emerald-500/15 text-emerald-400"
                      : lead.aiScore >= 6
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-rose-500/15 text-rose-400"
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
          </div>

          {lead.aiReasoning && (
            <div className="glass-card rounded-xl p-6">
              <h3 className="text-base font-semibold text-white mb-3">AI Reasoning</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                {lead.aiReasoning}
              </p>
            </div>
          )}

          {lead.aiSummary && (
            <div className="rounded-xl p-6 border border-indigo-500/20 bg-indigo-500/[0.06]">
              <h3 className="text-base font-semibold text-indigo-300 mb-1">
                Lead Summary
              </h3>
              <p className="text-sm text-gray-500 mb-3">AI-generated sales preparation</p>
              <div className="text-sm text-indigo-200/80 leading-relaxed space-y-3">
                {lead.aiSummary.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
