"use client";

import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

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
      examples: [...formData.examples, { input: "", output: "", explanation: "" }],
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
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          Manual Problem Entry
        </h3>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          Save & Preview
        </button>
      </div>

      {/* Problem Title */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Problem Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g., Two Sum"
          className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Problem Description */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Problem Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter the problem statement..."
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
      </div>

      {/* Examples */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-black dark:text-white">
            Examples
          </label>
          <button
            type="button"
            onClick={addExample}
            className="flex items-center gap-1 text-sm text-black dark:text-white hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Example
          </button>
        </div>

        <div className="space-y-4">
          {formData.examples.map((example, index) => (
            <div
              key={index}
              className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3"
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
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Input
                </label>
                <input
                  type="text"
                  value={example.input}
                  onChange={(e) => updateExample(index, "input", e.target.value)}
                  placeholder='e.g., nums = [2,7,11,15], target = 9'
                  className="w-full px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Output
                </label>
                <input
                  type="text"
                  value={example.output}
                  onChange={(e) => updateExample(index, "output", e.target.value)}
                  placeholder="e.g., [0,1]"
                  className="w-full px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                  Explanation (Optional)
                </label>
                <textarea
                  value={example.explanation || ""}
                  onChange={(e) => updateExample(index, "explanation", e.target.value)}
                  placeholder="Explain the example..."
                  rows={2}
                  className="w-full px-3 py-2 rounded border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-sm text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constraints */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Constraints
        </label>
        <textarea
          value={formData.constraints}
          onChange={(e) => setFormData({ ...formData, constraints: e.target.value })}
          placeholder="Enter constraints (one per line)..."
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
        />
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Tip: Enter each constraint on a new line
        </p>
      </div>
    </div>
  );
}
