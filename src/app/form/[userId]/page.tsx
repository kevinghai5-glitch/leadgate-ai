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
  Dumbbell,
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

  // Controlled state for form fields
  const [instagram, setInstagram] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [whyNow, setWhyNow] = useState("");
  const [biggestObstacle, setBiggestObstacle] = useState("");
  const [commitment, setCommitment] = useState("");
  const [coachingBefore, setCoachingBefore] = useState("");
  const [timeline, setTimeline] = useState("");
  const [financiallyReady, setFinanciallyReady] = useState("");
  const [investmentLevel, setInvestmentLevel] = useState("");

  useEffect(() => {
    fetch(`/api/custom-questions?userId=${userId}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCustomQuestions(data);
        }
      })
      .catch(() => {
        // Silently fail — custom questions are optional
      });
  }, [userId]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("loading");

    const formData = new FormData(e.currentTarget);

    // Build problemDescription from all answers combined
    const problemDescription = [
      `Primary Fitness Goal: ${fitnessGoal}`,
      `Why Now: ${whyNow}`,
      `Biggest Obstacle: ${biggestObstacle}`,
      `Commitment Level: ${commitment}`,
      `Previous Coaching Experience: ${coachingBefore}`,
      `Timeline to Start: ${timeline}`,
      `Financially Ready: ${financiallyReady}`,
      `Investment Level: ${investmentLevel}`,
    ].join("\n");

    const data = {
      userId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: instagram.trim() || "",
      budget: investmentLevel,
      timeline: timeline,
      problemDescription,
      customAnswers: customQuestions.length > 0 ? customAnswers : undefined,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#FFD700] mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-white">
            Reviewing your application...
          </h2>
          <p className="mt-2 text-gray-400">
            We&apos;re assessing if our online coaching program is right for you
          </p>
        </div>
      </div>
    );
  }

  if (formState === "qualified") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] px-4">
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
              goals with our online coaching. Let&apos;s set up a quick call.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result?.summary && (
              <div className="text-left bg-[#FFD700]/10 rounded-lg p-4">
                <p className="text-sm text-[#FFD700] font-medium mb-1">
                  Your Coaching Profile
                </p>
                <p className="text-sm text-[#D4A017]">
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
                  className="bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold"
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] px-4">
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

  const isFormValid =
    fitnessGoal &&
    whyNow.trim() &&
    biggestObstacle &&
    commitment &&
    coachingBefore &&
    timeline &&
    financiallyReady &&
    investmentLevel;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0A0A0A] to-[#050505] py-12 px-4 dashboard-dark">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/20 px-4 py-1.5 text-sm font-medium text-[#D4A017] mb-4">
            <Dumbbell className="h-4 w-4" />
            Free Coaching Assessment
          </div>
          <h1 className="text-3xl font-bold text-white">
            Let&apos;s See If Online Coaching Is Right for You
          </h1>
          <p className="mt-2 text-gray-400">
            Answer a few quick questions and we&apos;ll see if our
            online coaching program is the right fit for your goals.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Coaching Application</CardTitle>
            <CardDescription>
              Tell us about yourself so we can see if our online coaching
              program is the right fit.
            </CardDescription>
          </CardHeader>
          <form onSubmit={onSubmit}>
            <CardContent className="space-y-6">
              {/* Basic Info: Name, Email, Phone */}
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

              <div className="space-y-2">
                <Label htmlFor="instagram">
                  Instagram Username{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </Label>
                <Input
                  id="instagram"
                  name="instagram"
                  type="text"
                  placeholder="@username"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
              </div>

              {/* Q1: Primary fitness goal */}
              <div className="space-y-2">
                <Label>What is your primary fitness goal right now? *</Label>
                <Select
                  value={fitnessGoal}
                  onValueChange={setFitnessGoal}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lose body fat">Lose body fat</SelectItem>
                    <SelectItem value="Build lean muscle / transform physique">Build lean muscle / transform physique</SelectItem>
                    <SelectItem value="Rebuild consistency and discipline">Rebuild consistency and discipline</SelectItem>
                    <SelectItem value="Improve confidence & lifestyle">Improve confidence &amp; lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q2: Why now */}
              <div className="space-y-2">
                <Label>Why is achieving this goal important to you RIGHT NOW? *</Label>
                <Textarea
                  placeholder="Tell us briefly..."
                  rows={3}
                  required
                  value={whyNow}
                  onChange={(e) => setWhyNow(e.target.value)}
                />
              </div>

              {/* Q3: Biggest obstacle */}
              <div className="space-y-2">
                <Label>What&apos;s been your biggest obstacle? *</Label>
                <Select
                  value={biggestObstacle}
                  onValueChange={setBiggestObstacle}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your biggest obstacle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Lack of consistency">Lack of consistency</SelectItem>
                    <SelectItem value="No clear plan">No clear plan</SelectItem>
                    <SelectItem value="Accountability">Accountability</SelectItem>
                    <SelectItem value="Time management">Time management</SelectItem>
                    <SelectItem value="Motivation / discipline">Motivation / discipline</SelectItem>
                    <SelectItem value="Nutrition confusion">Nutrition confusion</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q4: Commitment level */}
              <div className="space-y-2">
                <Label>How committed are you to changing your body and lifestyle? *</Label>
                <Select
                  value={commitment}
                  onValueChange={setCommitment}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your commitment level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100% — I'm ready to do whatever it takes">100% — I&apos;m ready to do whatever it takes</SelectItem>
                    <SelectItem value="Very committed, but need guidance">Very committed, but need guidance</SelectItem>
                    <SelectItem value="Somewhat committed">Somewhat committed</SelectItem>
                    <SelectItem value="Just exploring options">Just exploring options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q5: Invested in coaching before */}
              <div className="space-y-2">
                <Label>Have you ever invested in coaching before? *</Label>
                <Select
                  value={coachingBefore}
                  onValueChange={setCoachingBefore}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes, and I'm ready to invest again">Yes, and I&apos;m ready to invest again</SelectItem>
                    <SelectItem value="Yes, but didn't get results">Yes, but didn&apos;t get results</SelectItem>
                    <SelectItem value="No, but I'm serious about starting">No, but I&apos;m serious about starting</SelectItem>
                    <SelectItem value="No, just exploring">No, just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q6: Timeline */}
              <div className="space-y-2">
                <Label>If you had the right plan and accountability, how soon would you want to start? *</Label>
                <Select
                  value={timeline}
                  onValueChange={setTimeline}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your timeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Immediately">Immediately</SelectItem>
                    <SelectItem value="Within 2 weeks">Within 2 weeks</SelectItem>
                    <SelectItem value="Within 30 days">Within 30 days</SelectItem>
                    <SelectItem value="Just researching">Just researching</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q7: Financially ready */}
              <div className="space-y-2">
                <Label>This is a premium coaching program. Are you financially ready to invest? *</Label>
                <Select
                  value={financiallyReady}
                  onValueChange={setFinanciallyReady}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes, I'm ready to invest for real results">Yes, I&apos;m ready to invest for real results</SelectItem>
                    <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Q8: Investment level */}
              <div className="space-y-2">
                <Label>What level of investment are you comfortable making? *</Label>
                <Select
                  value={investmentLevel}
                  onValueChange={setInvestmentLevel}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your investment range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $1,000">Under $1,000</SelectItem>
                    <SelectItem value="$1,000 – $2,000">$1,000 – $2,000</SelectItem>
                    <SelectItem value="$2,000 – $5,000">$2,000 – $5,000</SelectItem>
                    <SelectItem value="$5,000+">$5,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Questions */}
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
                className="w-full bg-gradient-to-r from-[#FFD700] to-[#B8860B] hover:from-[#FFE033] hover:to-[#C9960C] text-black font-semibold"
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
