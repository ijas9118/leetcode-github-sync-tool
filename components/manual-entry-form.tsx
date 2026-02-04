"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export interface ManualProblemData {
  title: string;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string;
}

interface ManualEntryFormProps {
  onSave: (data: ManualProblemData) => void;
  initialData?: ManualProblemData;
}

export function ManualEntryForm({ onSave, initialData }: ManualEntryFormProps) {
  const [formData, setFormData] = useState<ManualProblemData>(
    initialData || {
      title: "",
      description: "",
      examples: [{ input: "", output: "", explanation: "" }],
      constraints: "",
    }
  );

  const addExample = () => {
    setFormData({
      ...formData,
      examples: [
        ...formData.examples,
        { input: "", output: "", explanation: "" },
      ],
    });
  };

  const removeExample = (index: number) => {
    setFormData({
      ...formData,
      examples: formData.examples.filter((_, i) => i !== index),
    });
  };

  const updateExample = (index: number, field: string, value: string) => {
    const newExamples = [...formData.examples];
    newExamples[index] = { ...newExamples[index], [field]: value };
    setFormData({ ...formData, examples: newExamples });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="space-y-6 rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Manual Problem Entry
        </h3>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Save & Preview
        </button>
      </div>

      {/* Problem Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Problem Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Two Sum"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
        />
      </div>

      {/* Problem Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Problem Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Enter the problem statement..."
          rows={6}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
        />
      </div>

      {/* Examples */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-sm font-medium text-black dark:text-white">
            Examples
          </label>
          <button
            type="button"
            onClick={addExample}
            className="flex items-center gap-1 text-sm text-black hover:underline dark:text-white"
          >
            <Plus className="h-4 w-4" />
            Add Example
          </button>
        </div>

        <div className="space-y-4">
          {formData.examples.map((example, index) => (
            <div
              key={index}
              className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-black dark:text-white">
                  Example {index + 1}
                </span>
                {formData.examples.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExample(index)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Input
                </label>
                <input
                  type="text"
                  value={example.input}
                  onChange={(e) =>
                    updateExample(index, "input", e.target.value)
                  }
                  placeholder="e.g., nums = [2,7,11,15], target = 9"
                  className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Output
                </label>
                <input
                  type="text"
                  value={example.output}
                  onChange={(e) =>
                    updateExample(index, "output", e.target.value)
                  }
                  placeholder="e.g., [0,1]"
                  className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  Explanation (Optional)
                </label>
                <textarea
                  value={example.explanation || ""}
                  onChange={(e) =>
                    updateExample(index, "explanation", e.target.value)
                  }
                  placeholder="Explain the example..."
                  rows={2}
                  className="w-full rounded border border-zinc-200 bg-white px-3 py-2 text-sm text-black placeholder:text-zinc-400 focus:ring-1 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Constraints
        </label>
        <textarea
          value={formData.constraints}
          onChange={(e) =>
            setFormData({ ...formData, constraints: e.target.value })
          }
          placeholder="Enter constraints (one per line)..."
          rows={4}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Tip: Enter each constraint on a new line
        </p>
      </div>
    </div>
  );
}
