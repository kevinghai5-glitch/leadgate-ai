"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
        (lead.company?.toLowerCase() || "").includes(search.toLowerCase());
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">All Leads</h1>
        <Card>
          <CardContent className="p-12 text-center text-gray-500">
            Loading leads...
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
        <p className="text-gray-500">
          {leads.length} total leads in your pipeline
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name, email, or company..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="QUALIFIED">Qualified</SelectItem>
            <SelectItem value="DISQUALIFIED">Disqualified</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
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
                  <tr className="border-b bg-gray-50 text-left">
                    <th className="px-6 py-3">
                      <button
                        onClick={() => toggleSort("name")}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                      >
                        Name
                        <SortIcon field="name" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-sm font-medium text-gray-500">
                      Company
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => toggleSort("budget")}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
                      >
                        Budget
                        <SortIcon field="budget" />
                      </button>
                    </th>
                    <th className="px-6 py-3">
                      <button
                        onClick={() => toggleSort("aiScore")}
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
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
                        className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900"
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
                <tbody className="divide-y">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Link
                          href={`/dashboard/leads/${lead.id}`}
                          className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
                        >
                          {lead.name}
                        </Link>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.company || "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {lead.budget}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center justify-center h-8 w-8 rounded-full text-sm font-bold ${
                            (lead.aiScore || 0) >= 8
                              ? "bg-green-100 text-green-700"
                              : (lead.aiScore || 0) >= 6
                              ? "bg-blue-100 text-blue-700"
                              : (lead.aiScore || 0) >= 4
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {lead.aiScore || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            lead.status === "QUALIFIED"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            lead.status === "QUALIFIED"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : lead.status === "DISQUALIFIED"
                              ? "bg-red-50 text-red-600 hover:bg-red-50"
                              : ""
                          }
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {lead.source || "form"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/dashboard/leads/${lead.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
