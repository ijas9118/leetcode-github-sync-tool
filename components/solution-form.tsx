"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { solutionFormSchema, type SolutionFormValues, languageOptions, categoryOptions, subcategoryOptions } from "@/lib/validations";
import { CodeEditor } from "./code-editor";
import { ProblemPreview } from "./problem-preview";
import { ManualEntryForm } from "./manual-entry-form";

export function SolutionForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [problemData, setProblemData] = useState<any>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  
  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionFormSchema) as any,
    defaultValues: {
      problemNumber: "",
      language: "typescript",
      solutionCode: "",
      category: "arrays",
      subcategory: "binary-search",
      difficulty: "Medium",
      useAI: true,
      manualApproach: "",
      timeComplexity: "",
      spaceComplexity: "",
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = form;

  const language = watch("language");
  const category = watch("category");
  const solutionCode = watch("solutionCode");
  const useAI = watch("useAI");
  const problemNumber = watch("problemNumber");

  // Fetch problem details from LeetCode
  const fetchProblemDetails = async () => {
    if (!problemNumber || !/^\d+$/.test(problemNumber)) {
      setFetchError("Please enter a valid problem number");
      return;
    }

    setFetchLoading(true);
    setFetchError(null);
    setProblemData(null);
    setShowManualEntry(false);

    try {
      const response = await fetch(`/api/leetcode/fetch-problem?number=${problemNumber}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch problem");
      }

      setProblemData(data);
      
      // Auto-fill difficulty if available
      if (data.difficulty) {
        setValue("difficulty", data.difficulty as "Easy" | "Medium" | "Hard");
      }

      setFetchError(null);
    } catch (error) {
      setFetchError(error instanceof Error ? error.message : "Failed to fetch problem");
      setProblemData(null);
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle manual entry save
  const handleManualEntrySave = (data: any) => {
    // Create a problem data object from manual entry
    const manualProblemData = {
      questionFrontendId: problemNumber,
      title: data.title,
      titleSlug: data.title.toLowerCase().replace(/\s+/g, "-"),
      difficulty: "Medium", // Will be set by form
      content: data.description,
      topicTags: [],
      problemUrl: `https://leetcode.com/problems/${data.title.toLowerCase().replace(/\s+/g, "-")}/`,
      examples: data.examples,
      constraints: data.constraints,
      isManual: true,
    };
    
    setProblemData(manualProblemData);
    setShowManualEntry(false);
    setFetchError(null);
  };

  // Update subcategory options when category changes
  useEffect(() => {
    if (category !== selectedCategory) {
      setSelectedCategory(category);
      const defaultSubcategory = subcategoryOptions[category]?.[0] || "other";
      setValue("subcategory", defaultSubcategory);
    }
  }, [category, selectedCategory, setValue]);

  // Auto-save to localStorage
  useEffect(() => {
    const subscription = watch((value) => {
      localStorage.setItem("leetcode-form-draft", JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem("leetcode-form-draft");
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        Object.keys(parsedDraft).forEach((key) => {
          setValue(key as keyof SolutionFormValues, parsedDraft[key]);
        });
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: SolutionFormValues) => {
    console.log("Form submitted:", data);
    // TODO: Implement submission logic in Phase 3+
  };

  const handleReset = () => {
    reset();
    localStorage.removeItem("leetcode-form-draft");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Problem Number and Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="problemNumber" className="block text-sm font-medium text-black dark:text-white mb-2">
            Problem Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("problemNumber")}
            type="text"
            id="problemNumber"
            placeholder="e.g., 1358"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
          {errors.problemNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.problemNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-black dark:text-white mb-2">
            Language <span className="text-red-500">*</span>
          </label>
          <select
            {...register("language")}
            id="language"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-500">{errors.language.message}</p>
          )}
        </div>
      </div>

      {/* Fetch Problem Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={fetchProblemDetails}
          disabled={!problemNumber || fetchLoading}
          className="w-full px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-800 text-black dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {fetchLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
              Fetching Problem Details...
            </>
          ) : (
            <>
              <span className="text-lg">🔍</span>
              Fetch Problem Details from LeetCode
            </>
          )}
        </button>

        {/* Manual Entry Toggle - Show when there's an error or user wants manual entry */}
        {(fetchError || showManualEntry) && (
          <button
            type="button"
            onClick={() => setShowManualEntry(!showManualEntry)}
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-black dark:text-white text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            {showManualEntry ? "Hide Manual Entry" : "📝 Enter Problem Details Manually"}
          </button>
        )}
      </div>

      {/* Manual Entry Form */}
      {showManualEntry && <ManualEntryForm onSave={handleManualEntrySave} />}

      {/* Problem Preview */}
      {!showManualEntry && (
        <ProblemPreview problem={problemData} loading={fetchLoading} error={fetchError} />
      )}

      {/* Solution Code */}
      <div>
        <label htmlFor="solutionCode" className="block text-sm font-medium text-black dark:text-white mb-2">
          Solution Code <span className="text-red-500">*</span>
        </label>
        <CodeEditor
          value={solutionCode}
          onChange={(value) => setValue("solutionCode", value)}
          language={language}
        />
        {errors.solutionCode && (
          <p className="mt-1 text-sm text-red-500">{errors.solutionCode.message}</p>
        )}
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-black dark:text-white mb-2">
            Data Structure Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            {categoryOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="subcategory" className="block text-sm font-medium text-black dark:text-white mb-2">
            Sub-category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("subcategory")}
            id="subcategory"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          >
            {(subcategoryOptions[category] || ["other"]).map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="mt-1 text-sm text-red-500">{errors.subcategory.message}</p>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="block text-sm font-medium text-black dark:text-white mb-2">
          Difficulty <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {(["Easy", "Medium", "Hard"] as const).map((diff) => (
            <label key={diff} className="flex items-center gap-2 cursor-pointer">
              <input
                {...register("difficulty")}
                type="radio"
                value={diff}
                className="w-4 h-4 border-zinc-300 dark:border-zinc-700"
              />
              <span className="text-sm text-black dark:text-white">
                {diff === "Easy" && "🟢"} {diff === "Medium" && "🟧"} {diff === "Hard" && "🔴"} {diff}
              </span>
            </label>
          ))}
        </div>
        {errors.difficulty && (
          <p className="mt-1 text-sm text-red-500">{errors.difficulty.message}</p>
        )}
      </div>

      {/* AI Toggle */}
      <div className="flex items-center gap-3">
        <input
          {...register("useAI")}
          type="checkbox"
          id="useAI"
          className="w-4 h-4 border-zinc-300 dark:border-zinc-700 rounded"
        />
        <label htmlFor="useAI" className="text-sm text-black dark:text-white">
          Use AI to generate approach explanation
        </label>
      </div>

      {/* Manual Approach (if AI is disabled) */}
      {!useAI && (
        <div>
          <label htmlFor="manualApproach" className="block text-sm font-medium text-black dark:text-white mb-2">
            Manual Approach Explanation
          </label>
          <textarea
            {...register("manualApproach")}
            id="manualApproach"
            rows={6}
            placeholder="Describe your approach in detail..."
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>
      )}

      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="timeComplexity" className="block text-sm font-medium text-black dark:text-white mb-2">
            Time Complexity (Optional)
          </label>
          <input
            {...register("timeComplexity")}
            type="text"
            id="timeComplexity"
            placeholder="e.g., O(n)"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>

        <div>
          <label htmlFor="spaceComplexity" className="block text-sm font-medium text-black dark:text-white mb-2">
            Space Complexity (Optional)
          </label>
          <input
            {...register("spaceComplexity")}
            type="text"
            id="spaceComplexity"
            placeholder="e.g., O(1)"
            className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Processing..." : "Continue"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 text-black dark:text-white font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
