"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Eye, Users } from "lucide-react";
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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetch("/api/leads")
      .then((r) => r.json())
      .then((data) => {
        setLeads(data);
        setLoading(false);
      });
  }, []);

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        true;
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
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
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
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">All Leads</h1>
        <div className="glass-card rounded-xl p-12 text-center text-gray-400">
          Loading leads...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Leads</h1>
        <p className="text-gray-500">
          {leads.length} total leads in your pipeline
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            placeholder="Search by name or email..."
            className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 pl-10 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 w-[180px] rounded-lg border border-white/10 bg-white/[0.05] px-3 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          <option value="all" className="bg-[#111827]">All Statuses</option>
          <option value="QUALIFIED" className="bg-[#111827]">Qualified</option>
          <option value="DISQUALIFIED" className="bg-[#111827]">Disqualified</option>
          <option value="PENDING" className="bg-[#111827]">Pending</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white">
              No leads found
            </h3>
            <p className="text-gray-500">
              {search || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Share your form link to start receiving leads"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06] text-left bg-white/[0.02]">
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("name")}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-white"
                    >
                      Name
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("budget")}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-white"
                    >
                      Budget
                      <SortIcon field="budget" />
                    </button>
                  </th>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("aiScore")}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-white"
                    >
                      AI Score
                      <SortIcon field="aiScore" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Source
                  </th>
                  <th className="px-6 py-3">
                    <button
                      onClick={() => toggleSort("createdAt")}
                      className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-white"
                    >
                      Date
                      <SortIcon field="createdAt" />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center text-xs font-bold text-white">
                          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <Link
                            href={`/dashboard/leads/${lead.id}`}
                            className="font-medium text-white hover:text-orange-400 transition-colors text-sm"
                          >
                            {lead.name}
                          </Link>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {lead.budget}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {lead.source || "form"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {format(new Date(lead.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/leads/${lead.id}`}>
                        <button className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
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
