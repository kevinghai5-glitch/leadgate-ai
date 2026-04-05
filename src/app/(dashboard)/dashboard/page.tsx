"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Users,
  UserCheck,
  TrendingUp,
  BarChart3,
  Copy,
  ExternalLink,
  Info,
  DollarSign,
  Clock,
  PhoneOff,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { format } from "date-fns";

interface Stats {
  totalLeads: number;
  qualifiedLeads: number;
  disqualifiedLeads: number;
  qualificationRate: number;
  averageScore: number;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string;
  aiScore: number | null;
  status: string;
  source: string | null;
  createdAt: string;
}

function InfoTooltip({ text }: { text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" />
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px] bg-[#0A0A0A] text-gray-200 border-white/10">
        {text}
      </TooltipContent>
    </Tooltip>
  );
}

/* Simple SVG sparkline component */
function Sparkline({ color, variant }: { color: string; variant: number }) {
  const paths = [
    "M0,40 Q15,35 30,28 T60,20 T90,15 T120,10 T150,5",
    "M0,35 Q20,30 40,22 T80,18 T120,12 T150,8",
    "M0,20 Q15,22 30,30 T60,35 T90,32 T120,38 T150,40",
    "M0,38 Q20,35 40,30 T80,25 T120,22 T150,18",
  ];
  return (
    <svg viewBox="0 0 150 45" className="w-full h-12 opacity-40" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sparkGrad-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.6" />
        </linearGradient>
      </defs>
      <path
        d={paths[variant % paths.length]}
        fill="none"
        stroke={`url(#sparkGrad-${variant})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniChart({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 80 30" className="w-16 h-6 opacity-50">
      <polyline
        points="0,25 10,20 20,22 30,15 40,18 50,10 60,12 70,5 80,8"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/leads/stats").then((r) => r.json()),
      fetch("/api/leads").then((r) => r.json()),
    ]).then(([statsData, leadsData]) => {
      setStats(statsData);
      setLeads(leadsData);
      setLoading(false);
    });
  }, []);

  const formLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/form/${session?.user?.id}`
      : "";

  function copyFormLink() {
    navigator.clipboard.writeText(formLink);
    toast.success("Form link copied to clipboard!");
  }

  const disqualifiedCount = stats?.disqualifiedLeads || 0;
  const estimatedRevenue = (stats?.qualifiedLeads || 0) * 1125;
  const timeSaved = disqualifiedCount > 0 ? Math.round(disqualifiedCount * 0.5) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Revenue Intelligence Dashboard
          </h1>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="h-16 bg-white/5 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Leads Collected",
      value: stats?.totalLeads || 0,
      change: "+15.2%",
      changeColor: "text-teal-400",
      borderColor: "border-t-teal-400",
      sparkClass: "sparkline-teal",
      sparkColor: "#14b8a6",
      icon: Users,
      tooltip: "Total number of leads captured through your form",
    },
    {
      label: "Qualified",
      value: stats?.qualifiedLeads || 0,
      change: "+12.8%",
      changeColor: "text-blue-400",
      borderColor: "border-t-blue-400",
      sparkClass: "sparkline-blue",
      sparkColor: "#3b82f6",
      icon: UserCheck,
      tooltip: "Leads that passed your qualification criteria",
    },
    {
      label: "Qualification Rate",
      value: `${stats?.qualificationRate || 0}%`,
      change: "-5.2%",
      changeColor: "text-rose-400",
      borderColor: "border-t-rose-400",
      sparkClass: "sparkline-red",
      sparkColor: "#f43f5e",
      icon: TrendingUp,
      tooltip: "Percentage of leads that qualified out of total",
    },
    {
      label: "Avg Lead Score",
      value: stats?.averageScore || "N/A",
      change: "+1.2%",
      changeColor: "text-[#D4A017]",
      borderColor: "border-t-[#D4A017]",
      sparkClass: "sparkline-gold",
      sparkColor: "#FFD700",
      icon: BarChart3,
      tooltip: "Mean AI-generated score across all your leads (0-10)",
    },
  ];

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Revenue Intelligence Dashboard
            </h1>
            <p className="text-gray-500">
              Optimize and monetize your lead qualification pipeline
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/[0.05] border border-white/10 rounded-lg px-3 py-2 text-sm max-w-sm">
              <span className="truncate text-gray-400 font-mono text-xs">{formLink}</span>
            </div>
            <button
              onClick={copyFormLink}
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] transition-colors"
            >
              <Copy className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card, idx) => (
            <div
              key={card.label}
              className={`glass-card rounded-xl border-t-2 ${card.borderColor} overflow-hidden`}
            >
              <div className={`${card.sparkClass} px-5 pt-3`}>
                <Sparkline color={card.sparkColor} variant={idx} />
              </div>
              <div className="px-5 pb-5 pt-2">
                <div className="flex items-center gap-1.5 mb-1">
                  <p className="text-sm font-medium text-gray-400">{card.label}</p>
                  <InfoTooltip text={card.tooltip} />
                </div>
                <p className="text-3xl font-bold text-white">{card.value}</p>
                <p className="text-xs mt-1">
                  <span className={card.changeColor}>{card.change}</span>
                  <span className="text-gray-500 ml-1">last 7 days</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Leads Table */}
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5">
            <h2 className="text-xl font-bold text-white">Recent Leads</h2>
            <Link
              href="/dashboard/leads"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-400 border border-white/10 rounded-lg hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              View All
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="px-6 pb-6">
            {leads.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white">No leads yet</h3>
                <p className="text-gray-500 mt-1">
                  Share your form link to start receiving leads.
                </p>
                <button
                  className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                  onClick={copyFormLink}
                >
                  <Copy className="h-4 w-4" />
                  Copy Form Link
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06] text-left">
                      <th className="pb-3 text-sm font-medium text-gray-500">Name</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Budget</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Close Likelihood</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Status</th>
                      <th className="pb-3 text-sm font-medium text-gray-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {leads.slice(0, 10).map((lead) => (
                      <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-bold text-white">
                                {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[#0A0A0A]" />
                            </div>
                            <div>
                              <Link
                                href={`/dashboard/leads/${lead.id}`}
                                className="font-medium text-white hover:text-[#D4A017] transition-colors text-sm"
                              >
                                {lead.name}
                              </Link>
                              <p className="text-xs text-gray-500">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 text-sm text-gray-400">
                          {lead.budget}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-bold ${
                              (lead.aiScore || 0) >= 8
                                ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30"
                                : (lead.aiScore || 0) >= 6
                                ? "bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/30"
                                : (lead.aiScore || 0) >= 4
                                ? "bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30"
                                : "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30"
                            }`}
                          >
                            {lead.aiScore || "—"}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide ${
                              lead.status === "QUALIFIED"
                                ? "bg-emerald-500/15 text-emerald-400"
                                : lead.status === "DISQUALIFIED"
                                ? "bg-rose-500/15 text-rose-400"
                                : "bg-gray-500/15 text-gray-400"
                            }`}
                          >
                            {lead.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-sm text-gray-500">
                          {format(new Date(lead.createdAt), "MMM d, yyyy")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Revenue Impact */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Revenue Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estimated Monthly Revenue */}
            <div className="revenue-card-green rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-30">
                <MiniChart color="#10b981" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <span className="text-sm font-medium text-gray-300">Estimated Monthly Revenue</span>
              </div>
              <p className="text-3xl font-bold text-white">${estimatedRevenue.toLocaleString()}</p>
              <p className="text-xs text-emerald-400 mt-1">+12.42 last 7 days</p>
              <div className="mt-4">
                <Link
                  href="/dashboard/leads"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
                >
                  View Lead
                </Link>
              </div>
            </div>

            {/* Time Saved */}
            <div className="revenue-card-blue rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-30">
                <MiniChart color="#3b82f6" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-gray-300">Time Saved</span>
              </div>
              <p className="text-3xl font-bold text-white">{timeSaved} hours</p>
              <p className="text-xs text-gray-400 mt-1">{disqualifiedCount} disqualified leads</p>
              <div className="mt-4 flex gap-2">
                <Link
                  href="/dashboard/leads"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
                >
                  View Lead
                </Link>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  Send to Call
                </button>
              </div>
            </div>

            {/* Calls Avoided */}
            <div className="revenue-card-gold rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-3 right-3 opacity-30">
                <MiniChart color="#FFD700" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-[#FFD700]/15 flex items-center justify-center">
                  <PhoneOff className="h-5 w-5 text-[#D4A017]" />
                </div>
                <span className="text-sm font-medium text-gray-300">Calls Avoided</span>
              </div>
              <p className="text-3xl font-bold text-white">{disqualifiedCount}</p>
              <p className="text-xs text-gray-400 mt-1">Low-quality leads filtered</p>
              <div className="mt-4 flex gap-2">
                <Link
                  href="/dashboard/leads"
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
                >
                  View Lead
                </Link>
                <button className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#FFD700]/15 hover:bg-[#FFD700]/25 rounded-lg transition-colors">
                  Disqualify
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
