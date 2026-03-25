"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold">Lead not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors md:mb-0 -mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to leads
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{lead.name}</h1>
          <p className="text-gray-500">{lead.email}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge
            variant={lead.status === "QUALIFIED" ? "default" : "secondary"}
            className={`text-sm px-3 py-1 ${
              lead.status === "QUALIFIED"
                ? "bg-green-100 text-green-700"
                : lead.status === "DISQUALIFIED"
                ? "bg-red-50 text-red-600"
                : ""
            }`}
          >
            {lead.status}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>

      {/* Two-column layout: Left = Contact + Answers, Right = Score + Reasoning + Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Contact Info & Form Answers */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{lead.phone || "Not provided"}</p>
                  </div>
                </div>
                {lead.company && (
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Company</p>
                      <p className="font-medium">{lead.company}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Submitted</p>
                    <p className="font-medium">
                      {format(new Date(lead.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Form Answers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Budget</p>
                    <p className="font-medium">{lead.budget}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Timeline</p>
                    <p className="font-medium">{lead.timeline}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-gray-500 mb-2">Responses</p>
                <p className="text-gray-900 whitespace-pre-wrap text-sm leading-relaxed">
                  {lead.problemDescription}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: AI Score, Reasoning, Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-indigo-600" />
                AI Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center h-20 w-20 rounded-full text-3xl font-bold ${
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
                </div>
                <p className="mt-2 text-sm text-gray-500">out of 10</p>
                {lead.aiScore !== null && (
                  <Badge
                    className={`mt-3 text-sm px-3 py-1 ${
                      lead.aiScore >= 8
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : lead.aiScore >= 6
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        : "bg-red-100 text-red-600 hover:bg-red-100"
                    }`}
                  >
                    {lead.aiScore >= 8
                      ? "High Intent"
                      : lead.aiScore >= 6
                      ? "Medium Intent"
                      : "Low Intent"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {lead.aiReasoning && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">AI Reasoning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {lead.aiReasoning}
                </p>
              </CardContent>
            </Card>
          )}

          {lead.aiSummary && (
            <Card className="border-indigo-200 bg-indigo-50/50">
              <CardHeader>
                <CardTitle className="text-base text-indigo-900">
                  Lead Summary
                </CardTitle>
                <CardDescription>AI-generated sales preparation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-indigo-800 leading-relaxed space-y-3">
                  {lead.aiSummary.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
