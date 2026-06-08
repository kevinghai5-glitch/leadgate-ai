"use client";

import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ListChecks,
  GripVertical,
} from "lucide-react";

interface CustomQuestion {
  id?: string;
  label: string;
  type: string;
  options?: string;
  required: boolean;
}

// ─── Reusable components ────────────────────────────────────────────
function FormCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden">
      <div className="p-6 space-y-1">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        {description && (
          <p className="text-sm text-white/60">{description}</p>
        )}
      </div>
      <div className="px-6 pb-6">{children}</div>
      {footer && (
        <div className="border-t border-white/[0.06] bg-white/[0.015] px-6 py-3 flex items-center justify-end gap-3">
          {footer}
        </div>
      )}
    </div>
  );
}

const inputCls =
  "flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";

const selectCls =
  "flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ffd87c]/40 focus:bg-white/[0.06] transition-colors";

const btnPrimary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition";

const btnSecondary =
  "inline-flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-medium transition";

// ─── Main Page ──────────────────────────────────────────────────────
export default function FormBuilderPage() {
  const [loading, setLoading] = useState(true);
  const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
  const [savingQuestions, setSavingQuestions] = useState(false);

  useEffect(() => {
    fetch("/api/custom-questions")
      .then((r) => r.json())
      .then((questions) => {
        if (Array.isArray(questions)) {
          setCustomQuestions(questions);
        }
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load custom questions");
        setLoading(false);
      });
  }, []);

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
      toast.success("Custom questions saved");
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

  function moveQuestion(index: number, direction: "up" | "down") {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= customQuestions.length) return;
    const updated = [...customQuestions];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setCustomQuestions(updated);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-7 w-7 animate-spin text-[#ffd87c]" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-white/[0.06]">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Form Builder
        </h1>
        <p className="text-sm text-white/60 mt-1">
          Build the questions that qualify your leads. Name, email, and phone
          are always included — everything else is up to you.
        </p>
      </div>

      <div className="space-y-6">
        <FormCard
          title="Custom Questions"
          description={`${customQuestions.length} question${customQuestions.length === 1 ? "" : "s"} configured. Drag handles to reorder.`}
          footer={
            <>
              <button onClick={addQuestion} className={btnSecondary}>
                <Plus className="h-4 w-4" />
                Add Question
              </button>
              <button
                onClick={handleSaveQuestions}
                disabled={savingQuestions || customQuestions.length === 0}
                className={btnPrimary}
              >
                {savingQuestions ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Questions
                  </>
                )}
              </button>
            </>
          }
        >
          <div className="mt-2 space-y-3">
            {customQuestions.length === 0 && (
              <div className="rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                <div className="mx-auto h-10 w-10 rounded-lg bg-white/[0.04] flex items-center justify-center mb-3">
                  <ListChecks className="h-5 w-5 text-[#ffd87c]" />
                </div>
                <p className="text-sm font-medium text-white">
                  Your form is empty
                </p>
                <p className="text-xs text-white/60 mt-1 max-w-sm mx-auto">
                  Until you add at least one question, your public form link
                  won&apos;t accept leads.
                </p>
                <button
                  onClick={addQuestion}
                  className={`${btnSecondary} mt-4`}
                >
                  <Plus className="h-4 w-4" />
                  Add your first question
                </button>
              </div>
            )}

            {customQuestions.map((q, i) => (
              <div
                key={i}
                className="rounded-lg border border-white/10 bg-white/[0.02] hover:border-white/15 transition-colors overflow-hidden"
              >
                <div className="flex items-center justify-between gap-3 px-4 py-2.5 border-b border-white/[0.06] bg-white/[0.015]">
                  <div className="flex items-center gap-2 min-w-0">
                    <GripVertical className="h-4 w-4 text-white/30 flex-shrink-0" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                      Question {i + 1}
                    </span>
                    {q.required && (
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#ffd87c]">
                        · Required
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveQuestion(i, "up")}
                      disabled={i === 0}
                      className="p-1.5 rounded hover:bg-white/[0.06] text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move question up"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => moveQuestion(i, "down")}
                      disabled={i === customQuestions.length - 1}
                      className="p-1.5 rounded hover:bg-white/[0.06] text-white/50 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                      aria-label="Move question down"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <div className="h-4 w-px bg-white/[0.06] mx-1" />
                    <button
                      onClick={() => removeQuestion(i)}
                      className="p-1.5 rounded hover:bg-red-500/[0.1] text-white/50 hover:text-red-400 transition-colors"
                      aria-label="Remove question"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
                        Question
                      </label>
                      <input
                        placeholder="e.g. What's your biggest challenge right now?"
                        value={q.label}
                        onChange={(e) =>
                          updateQuestion(i, "label", e.target.value)
                        }
                        className={inputCls}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
                        Field Type
                      </label>
                      <select
                        value={q.type}
                        onChange={(e) => updateQuestion(i, "type", e.target.value)}
                        className={selectCls}
                      >
                        <option value="text" className="bg-[#0d0d0d]">
                          Short Text
                        </option>
                        <option value="textarea" className="bg-[#0d0d0d]">
                          Long Text
                        </option>
                        <option value="select" className="bg-[#0d0d0d]">
                          Dropdown
                        </option>
                      </select>
                    </div>
                  </div>

                  {q.type === "select" && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-white/70 uppercase tracking-wide">
                        Options
                      </label>
                      <input
                        placeholder="Option 1, Option 2, Option 3"
                        value={q.options || ""}
                        onChange={(e) =>
                          updateQuestion(i, "options", e.target.value)
                        }
                        className={inputCls}
                      />
                      <p className="text-xs text-white/50">
                        Separate dropdown options with commas.
                      </p>
                    </div>
                  )}

                  <label className="flex items-center gap-2 text-sm text-white/70 pt-1 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={q.required}
                      onChange={(e) =>
                        updateQuestion(i, "required", e.target.checked)
                      }
                      className="h-4 w-4 rounded border-white/20 bg-white/[0.05] accent-[#ffd87c]"
                    />
                    Required field
                  </label>
                </div>
              </div>
            ))}
          </div>
        </FormCard>
      </div>
    </div>
  );
}
