"use client";

import { useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  Calendar,
  Sliders,
  Copy,
  Save,
  Loader2,
  LinkIcon,
  Code,
  Check,
  Plus,
  Trash2,
  GripVertical,
  ListChecks,
  ChevronDown,
} from "lucide-react";

// ─── Collapsible Section ─────────────────────────────────────────────
function CollapsibleCard({
  icon,
  title,
  description,
  children,
  defaultOpen = false,
  dragHandleProps,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
  dragHandleProps?: {
    onDragStart: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    onDragEnd: () => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    draggable: boolean;
  };
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      {...(dragHandleProps
        ? {
            draggable: dragHandleProps.draggable,
            onDragStart: dragHandleProps.onDragStart,
            onDragOver: dragHandleProps.onDragOver,
            onDragEnd: dragHandleProps.onDragEnd,
            onDrop: dragHandleProps.onDrop,
          }
        : {})}
      className="glass-card rounded-xl transition-shadow"
    >
      <div className="cursor-pointer select-none p-6" onClick={() => setOpen(!open)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {dragHandleProps && (
              <div
                className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-gray-400 transition-colors"
                onMouseDown={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 text-lg font-semibold text-white">
                {icon}
                {title}
              </div>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            </div>
          </div>
          <ChevronDown
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          open ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 pb-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Interfaces ──────────────────────────────────────────────────────
interface Settings {
  id: string;
  email: string;
  name: string | null;
  calendarLink: string | null;
  rules: {
    budgetWeight: number;
    timelineWeight: number;
    urgencyWeight: number;
    qualityWeight: number;
    minScore: number;
  } | null;
}

interface CustomQuestion {
  id?: string;
  label: string;
  type: string;
  options?: string;
  required: boolean;
}

type SectionId = "formLink" | "embed" | "customQuestions" | "calendly" | "minScore";

interface Section {
  id: SectionId;
  label: string;
}

// ─── Main Page ───────────────────────────────────────────────────────
export default function SettingsPage() {
  const { data: session } = useSession();
  const [, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [calendarLink, setCalendarLink] = useState("");
  const [minScore, setMinScore] = useState(6);

  // Custom questions state
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [savingQuestions, setSavingQuestions] = useState(false);

  // Drag-to-reorder state
  const [sectionOrder, setSectionOrder] = useState<Section[]>([
    { id: "formLink", label: "Form Link" },
    { id: "embed", label: "Embed Form" },
    { id: "customQuestions", label: "Custom Questions" },
    { id: "calendly", label: "Calendly Integration" },
    { id: "minScore", label: "Minimum Qualifying Score" },
  ]);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/settings").then((r) => r.json()),
      fetch("/api/custom-questions").then((r) => r.json()),
    ])
      .then(([data, questions]) => {
        setSettings(data);
        setCalendarLink(data.calendarLink || "");
        if (data.rules) {
          setMinScore(data.rules.minScore);
        }
        if (Array.isArray(questions)) {
          setCustomQuestions(questions);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load settings");
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
          scoringRules: {
            budgetWeight: 30,
            timelineWeight: 25,
            urgencyWeight: 25,
            qualityWeight: 20,
            minScore,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save settings");
        return;
      }
      toast.success("Settings saved successfully!");
    } catch {
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveQuestions() {
    const invalid = customQuestions.some((q) => !q.label.trim());
    if (invalid) {
      toast.error("Each question must have a label.");
      return;
    }

    setSavingQuestions(true);
    try {
      const res = await fetch("/api/custom-questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questions: customQuestions }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to save custom questions");
        return;
      }
      toast.success("Custom questions saved!");
    } catch {
      toast.error("Failed to save custom questions. Please try again.");
    } finally {
      setSavingQuestions(false);
    }
  }

  function addQuestion() {
    setCustomQuestions([
      ...customQuestions,
      { label: "", type: "text", required: false },
    ]);
  }

  function removeQuestion(index: number) {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  }

  function updateQuestion(
    index: number,
    field: keyof CustomQuestion,
    value: string | boolean
  ) {
    const updated = [...customQuestions];
    updated[index] = { ...updated[index], [field]: value };
    setCustomQuestions(updated);
  }

  const handleDragStart = useCallback((index: number) => {
    dragItem.current = index;
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverItem.current = index;
  }, []);

  const handleDrop = useCallback(() => {
    if (dragItem.current === null || dragOverItem.current === null) return;
    if (dragItem.current === dragOverItem.current) return;

    setSectionOrder((prev) => {
      const updated = [...prev];
      const draggedItem = updated[dragItem.current!];
      updated.splice(dragItem.current!, 1);
      updated.splice(dragOverItem.current!, 0, draggedItem);
      return updated;
    });

    dragItem.current = null;
    dragOverItem.current = null;
  }, []);

  const handleDragEnd = useCallback(() => {
    dragItem.current = null;
    dragOverItem.current = null;
  }, []);

  const formLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/form/${session?.user?.id}`
      : "";

  const [embedCopied, setEmbedCopied] = useState(false);

  function copyFormLink() {
    navigator.clipboard.writeText(formLink);
    toast.success("Form link copied!");
  }

  const embedCode = `<iframe src="${formLink}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>`;

  function copyEmbedCode() {
    navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    toast.success("Embed code copied!");
    setTimeout(() => setEmbedCopied(false), 2000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  function renderSection(section: Section, index: number) {
    const dragProps = {
      onDragStart: (e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.effectAllowed = "move";
        handleDragStart(index);
      },
      onDragOver: (e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, index),
      onDrop: () => handleDrop(),
      onDragEnd: () => handleDragEnd(),
      draggable: true,
    };

    switch (section.id) {
      case "formLink":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<LinkIcon className="h-5 w-5 text-indigo-400" />}
            title="Your Form Link"
            description="Share this link with prospects to collect and qualify leads"
            defaultOpen
            dragHandleProps={dragProps}
          >
            <div className="flex items-center gap-2">
              <input
                value={formLink}
                readOnly
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-gray-300 font-mono focus:outline-none"
              />
              <button
                onClick={copyFormLink}
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-medium transition-colors"
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
          </CollapsibleCard>
        );

      case "embed":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<Code className="h-5 w-5 text-indigo-400" />}
            title="Embed Form"
            description="Add this code to your website to embed the lead qualification form"
            dragHandleProps={dragProps}
          >
            <div className="space-y-3">
              <div className="relative">
                <pre className="bg-white/[0.04] border border-white/10 rounded-lg p-4 text-sm text-gray-400 overflow-x-auto">
                  <code>{embedCode}</code>
                </pre>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={copyEmbedCode}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-medium transition-colors"
                >
                  {embedCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Paste this code into any HTML page to embed your lead form.
                The form will adapt to the container width.
              </p>
            </div>
          </CollapsibleCard>
        );

      case "customQuestions":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<ListChecks className="h-5 w-5 text-indigo-400" />}
            title="Custom Form Questions"
            description="Add extra questions to your lead form. These appear after the default fitness questions."
            defaultOpen
            dragHandleProps={dragProps}
          >
            <div className="space-y-4">
              {customQuestions.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No custom questions yet. Click &quot;Add Question&quot; to get
                  started.
                </p>
              )}

              {customQuestions.map((q, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/[0.03]"
                >
                  <GripVertical className="h-5 w-5 text-gray-600 mt-2 flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">
                          Question Label
                        </label>
                        <input
                          placeholder="e.g. How did you hear about us?"
                          value={q.label}
                          onChange={(e) =>
                            updateQuestion(i, "label", e.target.value)
                          }
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">Field Type</label>
                        <select
                          value={q.type}
                          onChange={(e) => updateQuestion(i, "type", e.target.value)}
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        >
                          <option value="text" className="bg-[#111827]">Short Text</option>
                          <option value="textarea" className="bg-[#111827]">Long Text</option>
                          <option value="select" className="bg-[#111827]">Dropdown</option>
                        </select>
                      </div>
                    </div>
                    {q.type === "select" && (
                      <div className="space-y-1">
                        <label className="text-xs text-gray-500">
                          Options (comma-separated)
                        </label>
                        <input
                          placeholder="Option 1, Option 2, Option 3"
                          value={q.options || ""}
                          onChange={(e) =>
                            updateQuestion(i, "options", e.target.value)
                          }
                          className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                      </div>
                    )}
                    <label className="flex items-center gap-2 text-sm text-gray-400">
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) =>
                          updateQuestion(i, "required", e.target.checked)
                        }
                        className="rounded border-gray-600 bg-white/[0.05]"
                      />
                      Required field
                    </label>
                  </div>
                  <button
                    onClick={() => removeQuestion(i)}
                    className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors mt-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={addQuestion}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-white/10 bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 text-sm font-medium transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Question
                </button>
                {customQuestions.length > 0 && (
                  <button
                    onClick={handleSaveQuestions}
                    disabled={savingQuestions}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {savingQuestions ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Questions
                  </button>
                )}
              </div>
            </div>
          </CollapsibleCard>
        );

      case "calendly":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<Calendar className="h-5 w-5 text-indigo-400" />}
            title="Calendly Integration"
            description="Qualified leads will be shown a booking link after form submission"
            dragHandleProps={dragProps}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Calendly Link</label>
              <input
                placeholder="https://calendly.com/your-name/30min"
                value={calendarLink}
                onChange={(e) => setCalendarLink(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-sm text-gray-500">
                Enter your Calendly scheduling link. Qualified leads will see
                this after submitting the form and can book a call directly.
              </p>
            </div>
          </CollapsibleCard>
        );

      case "minScore":
        return (
          <CollapsibleCard
            key={section.id}
            icon={<Sliders className="h-5 w-5 text-indigo-400" />}
            title="Minimum Qualifying Score"
            description="Set the threshold for lead qualification"
            defaultOpen
            dragHandleProps={dragProps}
          >
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Minimum Qualifying Score (1-10)</label>
              <input
                type="number"
                min={1}
                max={10}
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <p className="text-sm text-gray-500">
                Leads scoring at or above this number will be marked as qualified
                and shown the booking calendar.
              </p>
            </div>
          </CollapsibleCard>
        );
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500">
          Configure your lead qualification pipeline. Drag sections to reorder.
        </p>
      </div>

      {sectionOrder.map((section, index) => renderSection(section, index))}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
