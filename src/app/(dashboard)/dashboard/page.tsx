"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserCheck,
  TrendingUp,
  BarChart3,
  Copy,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lead Command Center
          </h1>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-16 bg-gray-100 animate-pulse rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Lead Command Center
          </h1>
          <p className="text-gray-500">
            Monitor and manage your lead qualification pipeline
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border rounded-lg px-3 py-2 text-sm max-w-sm">
            <span className="truncate text-gray-600">{formLink}</span>
          </div>
          <Button size="sm" variant="outline" onClick={copyFormLink}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Leads Collected</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalLeads || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Qualified</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats?.qualifiedLeads || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Qualification Rate</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats?.qualificationRate || 0}%
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Average Lead Score</p>
                <p className="text-3xl font-bold text-amber-600">
                  {stats?.averageScore || "N/A"}
                </p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <Link href="/dashboard/leads">
            <Button variant="outline" size="sm">
              View All
              <ExternalLink className="ml-2 h-3 w-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">
                No leads yet
              </h3>
              <p className="text-gray-500 mt-1">
                Share your form link to start receiving leads.
              </p>
              <Button
                className="mt-4 bg-indigo-600 hover:bg-indigo-700"
                onClick={copyFormLink}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Form Link
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-3 text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="pb-3 text-sm font-medium text-gray-500">
                      Company
                    </th>
                    <th className="pb-3 text-sm font-medium text-gray-500">
                      Budget
                    </th>
                    <th className="pb-3 text-sm font-medium text-gray-500">
                      AI Score
                    </th>
                    <th className="pb-3 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="pb-3 text-sm font-medium text-gray-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {leads.slice(0, 10).map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <Link
                          href={`/dashboard/leads/${lead.id}`}
                          className="font-medium text-gray-900 hover:text-indigo-600"
                        >
                          {lead.name}
                        </Link>
                        <p className="text-sm text-gray-500">{lead.email}</p>
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {lead.company || "—"}
                      </td>
                      <td className="py-3 text-sm text-gray-600">
                        {lead.budget}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-sm font-bold ${
                            (lead.aiScore || 0) >= 8
                              ? "bg-green-100 text-green-700"
                              : (lead.aiScore || 0) >= 6
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {lead.aiScore || "—"}
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={
                            lead.status === "QUALIFIED"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            lead.status === "QUALIFIED"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : ""
                          }
                        >
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-3 text-sm text-gray-500">
                        {format(new Date(lead.createdAt), "MMM d, yyyy")}
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
