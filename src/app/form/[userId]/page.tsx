"use client";

import { useState, use } from "react";
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
  Zap,
  XCircle,
} from "lucide-react";

type FormState = "form" | "loading" | "qualified" | "disqualified";

interface ScoreResult {
  score: number;
  reasoning: string;
  qualified: boolean;
  calendarLink: string | null;
  summary: string | null;
}

export default function LeadFormPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const [formState, setFormState] = useState<FormState>("form");
  const [result, setResult] = useState<ScoreResult | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");

    const formData = new FormData(e.currentTarget);
    const data = {
      userId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      budget: formData.get("budget") as string,
      timeline: formData.get("timeline") as string,
      problemDescription: formData.get("problemDescription") as string,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Analyzing your submission...
          </h2>
          <p className="mt-2 text-gray-600">
            Our AI is evaluating your project details
          </p>
        </div>
      </div>
    );
  }

  if (formState === "qualified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">
              Great news! You&apos;re a perfect fit.
            </CardTitle>
            <CardDescription className="text-base">
              Based on our AI analysis, we&apos;d love to chat with you about
              your project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result?.summary && (
              <div className="text-left bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-900 font-medium mb-1">
                  AI Assessment
                </p>
                <p className="text-sm text-indigo-700">
                  {result.summary.split("\n\n")[0]}
                </p>
              </div>
            )}
            {result?.calendarLink ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Book a time that works for you:
                </p>
                <Button
                  size="lg"
                  asChild
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  <a
                    href={result.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Your Call Now
                  </a>
                </Button>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  Our team will reach out to schedule a call with you shortly.
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-gray-400" />
            </div>
            <CardTitle className="text-2xl">Thank you for your interest</CardTitle>
            <CardDescription className="text-base">
              We&apos;ve received your submission. Based on our current
              availability and focus areas, we may not be the best fit right
              now. We&apos;ll reach out if anything changes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              In the meantime, feel free to check out our resources and guides.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-4">
            <Zap className="h-4 w-4" />
            Quick Qualification
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Let&apos;s see if we&apos;re a good fit
          </h1>
          <p className="mt-2 text-gray-600">
            Tell us about your project and we&apos;ll get back to you within
            minutes.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill out the form below and our AI will evaluate if we can help.
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
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Acme Inc."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range *</Label>
                <Select name="budget" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                    <SelectItem value="$1,000 - $5,000">
                      $1,000 - $5,000
                    </SelectItem>
                    <SelectItem value="$5,000 - $10,000">
                      $5,000 - $10,000
                    </SelectItem>
                    <SelectItem value="$10,000 - $25,000">
                      $10,000 - $25,000
                    </SelectItem>
                    <SelectItem value="$25,000 - $50,000">
                      $25,000 - $50,000
                    </SelectItem>
                    <SelectItem value="$50,000+">$50,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeline">Timeline *</Label>
                <Select name="timeline" required>
                  <SelectTrigger>
                    <SelectValue placeholder="When do you need this done?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ASAP (within 1 week)">
                      ASAP (within 1 week)
                    </SelectItem>
                    <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                    <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                    <SelectItem value="1-2 months">1-2 months</SelectItem>
                    <SelectItem value="3+ months">3+ months</SelectItem>
                    <SelectItem value="No rush / exploring options">
                      No rush / exploring options
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="problemDescription">
                  Describe Your Problem / Project *
                </Label>
                <Textarea
                  id="problemDescription"
                  name="problemDescription"
                  placeholder="Tell us about the problem you're trying to solve, what you've tried so far, and what success looks like for you..."
                  rows={5}
                  required
                  minLength={20}
                />
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                Submit for Review
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
