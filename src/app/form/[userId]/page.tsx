"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  CheckCircle2,
  Calendar,
  Sparkles,
  XCircle,
  Inbox,
} from "lucide-react";

type FormState = "form" | "loading" | "qualified" | "disqualified";

interface ScoreResult {
  score: number;
  reasoning: string;
  qualified: boolean;
  calendarLink: string | null;
  summary: string | null;
}

interface CustomQuestion {
  id: string;
  label: string;
  type: string;
  options: string | null;
  required: boolean;
  order: number;
}

export default function LeadFormPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [formState, setFormState] = useState<FormState>("form");
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
  const [questionsLoading, setQuestionsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/custom-questions?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomQuestions(data);
        }
      })
      .catch(() => {
        // Silently fail — coach hasn't built form
      })
      .finally(() => setQuestionsLoading(false));
  }, [userId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");

    const formData = new FormData(e.currentTarget);

    const problemDescription = customQuestions
      .map((q) => `${q.label}: ${customAnswers[q.id] || "N/A"}`)
      .join("\n");

    const data = {
      userId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: "",
      budget: "N/A",
      timeline: "N/A",
      problemDescription,
      customAnswers,
    };

    try {
      const res = await fetch("/api/score-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const scoreResult = await res.json();

      if (!res.ok) {
        toast.error(scoreResult.error || "Something went wrong");
        setFormState("form");
        return;
      }

      setResult(scoreResult);
      setFormState(scoreResult.qualified ? "qualified" : "disqualified");
    } catch {
      toast.error("Something went wrong. Please try again.");
      setFormState("form");
    }
  }

  if (formState === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#ECCA66] mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            Reviewing your application...
          </h2>
          <p className="mt-2 text-gray-400">
            We&apos;re assessing if this coaching program is right for you
          </p>
        </div>
      </div>
    );
  }

  if (formState === "qualified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              Great news! You&apos;re a strong fit for our program.
            </CardTitle>
            <CardDescription className="text-base">
              Based on your application, we&apos;d love to help you hit your
              goals. Let&apos;s set up a quick call.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result?.summary && (
              <div className="text-left bg-[#D2AC47]/10 rounded-lg p-4">
                <p className="text-sm text-[#ECCA66] font-medium mb-1">
                  Your Coaching Profile
                </p>
                <p className="text-sm text-[#ECCA66]">
                  {result.summary.split("\n\n")[0]}
                </p>
              </div>
            )}
            {result?.calendarLink ? (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Book a free discovery call:
                </p>
                <Button
                  size="lg"
                  asChild
                  className="bg-gradient-to-r from-[#D2AC47] to-[#B08B73] hover:from-[#ECCA66] hover:to-[#D2AC47] text-black font-semibold shadow-[0_0_20px_rgba(210,172,71,0.15)] hover:shadow-[0_0_28px_rgba(210,172,71,0.25)]"
                >
                  <a
                    href={result.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Your Free Discovery Call
                  </a>
                </Button>
              </div>
            ) : (
              <div className="bg-amber-500/10 rounded-lg p-4">
                <p className="text-sm text-amber-400">
                  Our team will reach out to schedule your free discovery call
                  shortly.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (formState === "disqualified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">Thank you for your interest</CardTitle>
            <CardDescription className="text-base">
              We&apos;ve reviewed your application. Based on our current
              availability, we may not be the best fit right now — but
              we&apos;ll reach out if a spot opens up.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              In the meantime, check out our free resources to start
              making progress on your goals.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ECCA66]" />
      </div>
    );
  }

  if (customQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303] px-4 dashboard-dark">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-[#D2AC47]/10 border border-[#D2AC47]/20 flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-[#ECCA66]" />
            </div>
            <CardTitle className="text-2xl">Form not ready yet</CardTitle>
            <CardDescription className="text-base">
              This coach hasn&apos;t finished setting up their qualification
              form. Please check back soon.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isFormValid = customQuestions
    .filter((q) => q.required)
    .every((q) => (customAnswers[q.id] || "").trim() !== "");

  return (
    <div className="min-h-screen bg-[#030303] py-12 px-4 dashboard-dark">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#D2AC47]/10 border border-[#D2AC47]/20 px-4 py-1.5 text-sm font-medium text-[#ECCA66] mb-4">
            <Sparkles className="h-4 w-4" />
            Free Coaching Assessment
          </div>
          <h1 className="text-3xl font-bold text-white">
            See If This Coaching Program Is Right for You
          </h1>
          <p className="mt-2 text-gray-400">
            Answer a few quick questions so we can see if we&apos;re the right
            fit for your goals.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Application</CardTitle>
            <CardDescription>
              Tell us about yourself so we can see if this program is the right
              fit.
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Jane Smith"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="jane@email.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>

              {customQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <Label>
                    {q.label} {q.required && "*"}
                  </Label>
                  {q.type === "text" && (
                    <Input
                      placeholder={`Enter ${q.label.toLowerCase()}`}
                      required={q.required}
                      value={customAnswers[q.id] || ""}
                      onChange={(e) =>
                        setCustomAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                  {q.type === "textarea" && (
                    <Textarea
                      placeholder={`Enter ${q.label.toLowerCase()}`}
                      rows={3}
                      required={q.required}
                      value={customAnswers[q.id] || ""}
                      onChange={(e) =>
                        setCustomAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                    />
                  )}
                  {q.type === "select" && q.options && (
                    <Select
                      value={customAnswers[q.id] || ""}
                      onValueChange={(val) =>
                        setCustomAnswers((prev) => ({
                          ...prev,
                          [q.id]: val,
                        }))
                      }
                      required={q.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${q.label.toLowerCase()}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options
                          .split(",")
                          .map((opt) => opt.trim())
                          .filter(Boolean)
                          .map((opt) => (
                            <SelectItem key={opt} value={opt}>
                              {opt}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </CardContent>
            <div className="px-6 pb-6">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-[#D2AC47] to-[#B08B73] hover:from-[#ECCA66] hover:to-[#D2AC47] text-black font-semibold shadow-[0_0_20px_rgba(210,172,71,0.15)] hover:shadow-[0_0_28px_rgba(210,172,71,0.25)]"
                disabled={!isFormValid}
              >
                Submit My Application
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
