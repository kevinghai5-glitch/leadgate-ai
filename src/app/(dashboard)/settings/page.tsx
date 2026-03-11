"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Calendar,
  Bell,
  Sliders,
  Copy,
  Save,
  Loader2,
  LinkIcon,
} from "lucide-react";

interface Settings {
  id: string;
  email: string;
  name: string | null;
  calendarLink: string | null;
  slackWebhookUrl: string | null;
  rules: {
    budgetWeight: number;
    timelineWeight: number;
    urgencyWeight: number;
    qualityWeight: number;
    minScore: number;
  } | null;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [calendarLink, setCalendarLink] = useState("");
  const [slackWebhookUrl, setSlackWebhookUrl] = useState("");
  const [budgetWeight, setBudgetWeight] = useState(30);
  const [timelineWeight, setTimelineWeight] = useState(25);
  const [urgencyWeight, setUrgencyWeight] = useState(25);
  const [qualityWeight, setQualityWeight] = useState(20);
  const [minScore, setMinScore] = useState(6);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setCalendarLink(data.calendarLink || "");
        setSlackWebhookUrl(data.slackWebhookUrl || "");
        if (data.rules) {
          setBudgetWeight(data.rules.budgetWeight);
          setTimelineWeight(data.rules.timelineWeight);
          setUrgencyWeight(data.rules.urgencyWeight);
          setQualityWeight(data.rules.qualityWeight);
          setMinScore(data.rules.minScore);
        }
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calendarLink: calendarLink || null,
          slackWebhookUrl: slackWebhookUrl || null,
          scoringRules: {
            budgetWeight,
            timelineWeight,
            urgencyWeight,
            qualityWeight,
            minScore,
          },
        }),
      });

      if (!res.ok) throw new Error();
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  const formLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/form/${session?.user?.id}`
      : "";

  function copyFormLink() {
    navigator.clipboard.writeText(formLink);
    toast.success("Form link copied!");
  }

  const totalWeight = budgetWeight + timelineWeight + urgencyWeight + qualityWeight;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">
          Configure your lead qualification pipeline
        </p>
      </div>

      {/* Form Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-indigo-600" />
            Your Form Link
          </CardTitle>
          <CardDescription>
            Share this link with prospects to collect and qualify leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input value={formLink} readOnly className="bg-gray-50" />
            <Button variant="outline" onClick={copyFormLink}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-600" />
            Calendar Integration
          </CardTitle>
          <CardDescription>
            Qualified leads will be shown a booking link after form submission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="calendarLink">Calendly Link</Label>
            <Input
              id="calendarLink"
              placeholder="https://calendly.com/your-name/30min"
              value={calendarLink}
              onChange={(e) => setCalendarLink(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Enter your Calendly scheduling link. Qualified leads will see this
              after submitting the form.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Slack Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600" />
            Slack Notifications
          </CardTitle>
          <CardDescription>
            Get notified instantly when a qualified lead comes through
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="slackWebhook">Slack Webhook URL</Label>
            <Input
              id="slackWebhook"
              placeholder="https://hooks.slack.com/services/..."
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Create an incoming webhook in your Slack workspace and paste the
              URL here.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Scoring Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-indigo-600" />
            Scoring Rules
          </CardTitle>
          <CardDescription>
            Customize how the AI evaluates and scores leads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Budget Weight (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={budgetWeight}
                onChange={(e) => setBudgetWeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Timeline Weight (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={timelineWeight}
                onChange={(e) => setTimelineWeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Urgency Weight (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={urgencyWeight}
                onChange={(e) => setUrgencyWeight(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Quality Weight (%)</Label>
              <Input
                type="number"
                min={0}
                max={100}
                value={qualityWeight}
                onChange={(e) => setQualityWeight(Number(e.target.value))}
              />
            </div>
          </div>

          {totalWeight !== 100 && (
            <p className="text-sm text-amber-600">
              Weights should total 100%. Current total: {totalWeight}%
            </p>
          )}

          <Separator />

          <div className="space-y-2">
            <Label>Minimum Qualifying Score (1-10)</Label>
            <Input
              type="number"
              min={1}
              max={10}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
            />
            <p className="text-sm text-gray-500">
              Leads scoring at or above this number will be marked as qualified
              and shown the booking calendar.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
