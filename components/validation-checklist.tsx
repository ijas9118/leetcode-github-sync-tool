"use client";

import type { ValidationResult } from "@/lib/validation-utils";

interface ValidationChecklistProps {
  validationResult: ValidationResult;
  compact?: boolean;
}

export function ValidationChecklist({
  validationResult,
  compact = false,
}: ValidationChecklistProps) {
  const { isValid, rules } = validationResult;

  if (compact) {
    // Compact mode: just show overall status
    return (
      <div className="flex items-center gap-2 text-sm">
        {isValid ? (
          <>
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span className="text-green-600 dark:text-green-400">
              Ready to push
            </span>
          </>
        ) : (
          <>
            <span className="text-red-600 dark:text-red-400">✗</span>
            <span className="text-red-600 dark:text-red-400">
              {rules.filter((r) => !r.passed).length} issue
              {rules.filter((r) => !r.passed).length !== 1 ? "s" : ""}
            </span>
          </>
        )}
      </div>
    );
  }

  // Full mode: show all validation rules
  return (
    <div className="space-y-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Validation Checklist
        </h3>
        {isValid ? (
          <span className="text-xs font-medium text-green-600 dark:text-green-400">
            ✓ Ready to push
          </span>
        ) : (
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            ✗ {rules.filter((r) => !r.passed).length} issue
            {rules.filter((r) => !r.passed).length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id} className="flex items-start gap-2">
            <span
              className={`mt-0.5 text-sm ${rule.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
            >
              {rule.passed ? "✅" : "❌"}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm ${rule.passed ? "text-zinc-600 dark:text-zinc-400" : "text-black dark:text-white"}`}
              >
                {rule.label}
              </p>
              {!rule.passed && (
                <p className="mt-0.5 text-xs text-red-600 dark:text-red-400">
                  {rule.errorMessage}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isValid && (
        <div className="border-t border-zinc-200 pt-2 dark:border-zinc-800">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Complete all required fields to push to GitHub
          </p>
        </div>
      )}
    </div>
  );
}
