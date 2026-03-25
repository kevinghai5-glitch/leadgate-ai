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

  // Controlled state for default select fields
  const [fitnessGoals, setFitnessGoals] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [trainerExperience, setTrainerExperience] = useState("");
  const [biggestChallenge, setBiggestChallenge] = useState("");
  const [budget, setBudget] = useState("");
  const [timeline, setTimeline] = useState("");
  const [trainingFormat, setTrainingFormat] = useState("");

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

    // Build a detailed problemDescription from the coaching-specific answers
    const problemDescription = [
      `Transformation Goal: ${fitnessGoals}`,
      `Current Exercise Frequency: ${exerciseFrequency}`,
      `Previous Online Coaching Experience: ${trainerExperience}`,
      `Biggest Challenge: ${biggestChallenge}`,
      `Preferred Coaching Format: ${trainingFormat}`,
    ].join("\n");

    const data = {
      userId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: "", // Not applicable for fitness leads
      budget,
      timeline,
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Reviewing your application...
          </h2>
          <p className="mt-2 text-gray-600">
            We&apos;re assessing if our online coaching program is right for you
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
              Great news! You&apos;re a strong fit for our program.
            </CardTitle>
            <CardDescription className="text-base">
              Based on your application, we&apos;d love to help you hit your
              goals with our online coaching. Let&apos;s set up a quick call.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {result?.summary && (
              <div className="text-left bg-indigo-50 rounded-lg p-4">
                <p className="text-sm text-indigo-900 font-medium mb-1">
                  Your Coaching Profile
                </p>
                <p className="text-sm text-indigo-700">
                  {result.summary.split("\n\n")[0]}
                </p>
              </div>
            )}
            {result?.calendarLink ? (
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Book a free discovery call:
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
                    Book Your Free Discovery Call
                  </a>
                </Button>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4">
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-medium text-indigo-700 mb-4">
            <Dumbbell className="h-4 w-4" />
            Free Coaching Assessment
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Let&apos;s See If Online Coaching Is Right for You
          </h1>
          <p className="mt-2 text-gray-600">
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
              {/* Name & Email */}
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

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Fitness Goals */}
              <div className="space-y-2">
                <Label>What&apos;s your #1 transformation goal? *</Label>
                <Select
                  value={fitnessGoals}
                  onValueChange={setFitnessGoals}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Fat Loss & Body Recomposition">Fat Loss &amp; Body Recomposition</SelectItem>
                    <SelectItem value="Muscle Building & Strength">Muscle Building &amp; Strength</SelectItem>
                    <SelectItem value="Athletic Performance">Athletic Performance</SelectItem>
                    <SelectItem value="Lifestyle & Longevity">Lifestyle &amp; Longevity</SelectItem>
                    <SelectItem value="Competition / Physique Prep">Competition / Physique Prep</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Exercise Frequency */}
              <div className="space-y-2">
                <Label>How often do you currently exercise? *</Label>
                <Select
                  value={exerciseFrequency}
                  onValueChange={setExerciseFrequency}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never / Rarely">Never / Rarely</SelectItem>
                    <SelectItem value="1-2 times per week">1–2 times per week</SelectItem>
                    <SelectItem value="3-4 times per week">3–4 times per week</SelectItem>
                    <SelectItem value="5+ times per week">5+ times per week</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trainer Experience */}
              <div className="space-y-2">
                <Label>Have you invested in online coaching before? *</Label>
                <Select
                  value={trainerExperience}
                  onValueChange={setTrainerExperience}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Yes, with great results">Yes, with great results</SelectItem>
                    <SelectItem value="Yes, but didn't get results">Yes, but didn&apos;t get the results I wanted</SelectItem>
                    <SelectItem value="No, this would be my first time">No, this would be my first time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Biggest Challenge */}
              <div className="space-y-2">
                <Label>What&apos;s holding you back from reaching your goal? *</Label>
                <Select
                  value={biggestChallenge}
                  onValueChange={setBiggestChallenge}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your biggest challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="No Accountability or Structure">No Accountability or Structure</SelectItem>
                    <SelectItem value="Inconsistent Diet & Nutrition">Inconsistent Diet &amp; Nutrition</SelectItem>
                    <SelectItem value="Don't Know the Right Program">Don&apos;t Know the Right Program for My Goals</SelectItem>
                    <SelectItem value="Busy Schedule">Busy Schedule &amp; Time Management</SelectItem>
                    <SelectItem value="Plateaued / Not Seeing Results">Plateaued / Not Seeing Results Anymore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Budget */}
              <div className="space-y-2">
                <Label>What are you willing to invest in coaching monthly? *</Label>
                <Select
                  value={budget}
                  onValueChange={setBudget}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your investment range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Under $200/month">Under $200/month</SelectItem>
                    <SelectItem value="$200 - $500/month">$200 – $500/month</SelectItem>
                    <SelectItem value="$500 - $1,000/month">$500 – $1,000/month</SelectItem>
                    <SelectItem value="$1,000 - $2,000/month">$1,000 – $2,000/month</SelectItem>
                    <SelectItem value="$2,000+/month">$2,000+/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <Label>How soon are you looking to start? *</Label>
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
                    <SelectItem value="Within a week">Within a week</SelectItem>
                    <SelectItem value="Within a month">Within a month</SelectItem>
                    <SelectItem value="Just exploring options">Just exploring options</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Training Format */}
              <div className="space-y-2">
                <Label>What type of online coaching are you looking for? *</Label>
                <Select
                  value={trainingFormat}
                  onValueChange={setTrainingFormat}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-on-1 Personalized Coaching">1-on-1 Personalized Coaching</SelectItem>
                    <SelectItem value="Small Group Coaching">Small Group Coaching</SelectItem>
                    <SelectItem value="Self-Paced with Check-ins">Self-Paced Program with Check-ins</SelectItem>
                    <SelectItem value="Open to Recommendations">Open to Recommendations</SelectItem>
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
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                disabled={
                  !fitnessGoals ||
                  !exerciseFrequency ||
                  !trainerExperience ||
                  !biggestChallenge ||
                  !budget ||
                  !timeline ||
                  !trainingFormat
                }
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
