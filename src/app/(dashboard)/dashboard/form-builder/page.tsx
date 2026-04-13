"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ListChecks,
} from "lucide-react";

interface CustomQuestion {
  id?: string;
  label: string;
  type: string;
  options?: string;
  required: boolean;
}

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
        <Loader2 className="h-8 w-8 animate-spin text-[#ECCA66]" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Custom Form Builder</h1>
        <p className="text-gray-500">
          Build your own lead form. If you add questions here, they replace the
          default fitness questions. Name, email, and phone are always included.
        </p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-2 text-lg font-semibold text-white mb-1">
          <ListChecks className="h-5 w-5 text-[#ECCA66]" />
          Your Questions
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Add, edit, reorder, and remove custom questions for your lead form.
        </p>

        <div className="space-y-4">
          {customQuestions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No custom questions yet. Your form uses the default fitness
              coaching questions. Click &quot;Add Question&quot; to build your
              own.
            </p>
          )}

          {customQuestions.map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 rounded-lg border border-white/10 bg-white/[0.03]"
            >
              <div className="flex flex-col gap-1 mt-1">
                <button
                  onClick={() => moveQuestion(i, "up")}
                  disabled={i === 0}
                  className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move question up"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => moveQuestion(i, "down")}
                  disabled={i === customQuestions.length - 1}
                  className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                  aria-label="Move question down"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>
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
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2AC47]/50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-gray-500">Field Type</label>
                    <select
                      value={q.type}
                      onChange={(e) => updateQuestion(i, "type", e.target.value)}
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D2AC47]/50"
                    >
                      <option value="text" className="bg-[#0A0A0A]">
                        Short Text
                      </option>
                      <option value="textarea" className="bg-[#0A0A0A]">
                        Long Text
                      </option>
                      <option value="select" className="bg-[#0A0A0A]">
                        Dropdown
                      </option>
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
                      className="flex h-10 w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D2AC47]/50"
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
                className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-[#D2AC47] to-[#B08B73] hover:from-[#ECCA66] hover:to-[#D2AC47] text-black text-sm font-semibold shadow-[0_0_20px_rgba(210,172,71,0.15)] hover:shadow-[0_0_28px_rgba(210,172,71,0.25)] transition-all disabled:opacity-50"
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
      </div>
    </div>
  );
}
