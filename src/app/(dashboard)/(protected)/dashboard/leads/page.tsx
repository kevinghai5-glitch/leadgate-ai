"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  Users,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string;
  timeline: string;
  aiScore: number | null;
  status: string;
  source: string | null;
  createdAt: string;
}

const inputCls =
  "flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";

const selectCls =
  "flex h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  accent: "neutral" | "emerald" | "rose" | "amber";
}) {
  const accents: Record<typeof accent, string> = {
    neutral: "bg-white/[0.04] text-white/70",
    emerald: "bg-emerald-500/15 text-emerald-300",
    rose: "bg-rose-500/15 text-rose-300",
    amber: "bg-amber-500/15 text-amber-300",
  };
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-5 flex items-center gap-4">
      <div
        className={`h-10 w-10 rounded-lg flex items-center justify-center ${accents[accent]}`}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/50">
          {label}
        </p>
        <p className="mt-0.5 text-lg font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/leads")
      .then(async (r) => {
        if (!r.ok) return [] as Lead[];
        const data = await r.json();
        return Array.isArray(data) ? (data as Lead[]) : [];
      })
      .then((data) => setLeads(data))
      .catch(() => setLeads([]))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    const qualified = leads.filter((l) => l.status === "QUALIFIED").length;
    const disqualified = leads.filter((l) => l.status === "DISQUALIFIED").length;
    const pending = leads.filter((l) => l.status === "PENDING").length;
    return { total: leads.length, qualified, disqualified, pending };
  }, [leads]);

  const filteredLeads = leads
    .filter((lead) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aVal: string | number = "";
      let bVal: string | number = "";
      switch (sortField) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "aiScore":
          aVal = a.aiScore || 0;
          bVal = b.aiScore || 0;
          break;
        case "budget": {
          const extractNum = (s: string) => {
            const m = s.match(/[\d,]+/);
            return m ? parseInt(m[0].replace(/,/g, ""), 10) : 0;
          };
          aVal = extractNum(a.budget);
          bVal = extractNum(b.budget);
          break;
        }
        case "createdAt":
        default:
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
      }
      if (typeof aVal === "string") {
        return sortDir === "asc"
          ? aVal.localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal);
      }
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });

  function toggleSort(field: string) {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  }

  function SortIcon({ field }: { field: string }) {
    if (sortField !== field)
      return <ArrowUpDown className="h-3 w-3 text-white/30" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-[#ffd87c]" />
    ) : (
      <ArrowDown className="h-3 w-3 text-[#ffd87c]" />
    );
  }

  function scoreBadgeClasses(score: number | null) {
    const s = score || 0;
    if (s >= 8) return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
    if (s >= 6) return "bg-blue-500/15 text-blue-300 ring-blue-500/30";
    if (s >= 4) return "bg-amber-500/15 text-amber-300 ring-amber-500/30";
    return "bg-rose-500/15 text-rose-300 ring-rose-500/30";
  }

  function statusBadge(status: string) {
    if (status === "QUALIFIED")
      return "bg-emerald-500/15 text-emerald-300";
    if (status === "DISQUALIFIED") return "bg-rose-500/15 text-rose-300";
    return "bg-white/[0.05] text-white/60";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight">Leads</h1>
        <p className="text-sm text-white/60 mt-1">
          Every lead that came through your form, ranked by AI score.
        </p>
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total"
          value={stats.total}
          icon={Users}
          accent="neutral"
        />
        <StatCard
          label="Qualified"
          value={stats.qualified}
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          label="Disqualified"
          value={stats.disqualified}
          icon={XCircle}
          accent="rose"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          accent="amber"
        />
      </div>

      {/* Filters + Table card */}
      <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden">
        <div className="p-4 flex flex-col sm:flex-row gap-3 border-b border-white/[0.06]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              placeholder="Search by name or email…"
              className={`${inputCls} pl-9`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`${selectCls} sm:w-[180px]`}
          >
            <option value="all" className="bg-[#0d0d0d]">
              All Statuses
            </option>
            <option value="QUALIFIED" className="bg-[#0d0d0d]">
              Qualified
            </option>
            <option value="DISQUALIFIED" className="bg-[#0d0d0d]">
              Disqualified
            </option>
            <option value="PENDING" className="bg-[#0d0d0d]">
              Pending
            </option>
          </select>
        </div>

        {filteredLeads.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="mx-auto h-12 w-12 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white/40" />
            </div>
            <h3 className="text-base font-semibold text-white">
              No leads found
            </h3>
            <p className="text-sm text-white/60 mt-1">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters."
                : "Share your form link to start receiving leads."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] bg-white/[0.015] text-left">
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                    >
                      Name
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("budget")}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                    >
                      Budget
                      <SortIcon field="budget" />
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("aiScore")}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                    >
                      AI Score
                      <SortIcon field="aiScore" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Status
                  </th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-wider text-white/60">
                    Source
                  </th>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("createdAt")}
                      className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
                    >
                      Date
                      <SortIcon field="createdAt" />
                    </button>
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
                          style={{ background: "var(--lg-gold-gradient)" }}
                        >
                          {lead.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="block font-medium text-white hover:text-[#ffd87c] transition-colors text-sm truncate"
                          >
                            {lead.name}
                          </Link>
                          <p className="text-xs text-white/50 truncate">
                            {lead.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/70">
                      {lead.budget}
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center justify-center h-7 min-w-[2rem] px-1.5 rounded-full text-xs font-bold ring-1 ${scoreBadgeClasses(lead.aiScore)}`}
                      >
                        {lead.aiScore ?? "—"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${statusBadge(lead.status)}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/60">
                      {lead.source || "form"}
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/60 whitespace-nowrap">
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-white/[0.06] text-white/50 hover:text-white transition-colors"
                        aria-label="View lead"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
