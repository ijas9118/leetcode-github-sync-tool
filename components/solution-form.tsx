"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import type { Resolver } from "react-hook-form";
import { useForm } from "react-hook-form";

import { generatePreviewReadme } from "@/lib/github-utils";
import {
  validateSolutionForm,
  type ValidationResult,
} from "@/lib/validation-utils";
import {
  categoryOptions,
  languageOptions,
  solutionFormSchema,
  type SolutionFormValues,
  subcategoryOptions,
} from "@/lib/validations";

import { CodeEditor } from "./code-editor";
import { FolderTreePreview } from "./folder-tree-preview";
import { ManualEntryForm, type ManualProblemData } from "./manual-entry-form";
import { MarkdownPreview } from "./markdown-preview";
import { ProblemPreview } from "./problem-preview";
import { ValidationChecklist } from "./validation-checklist";

interface LeetCodeProblem {
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: string;
  content: string;
  topicTags: string[];
  problemUrl: string;
  examples?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  constraints?: string;
  isManual?: boolean;
}

export function SolutionForm() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [problemData, setProblemData] = useState<LeetCodeProblem | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [pushing, setPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{
    success: boolean;
    message: string;
    urls?: { readme?: string; solution?: string };
  } | null>(null);
  const [githubConfig, setGithubConfig] = useState<{
    hasToken: boolean;
    owner: string;
    repo: string;
    branch: string;
  } | null>(null);
  const [validationResult, setValidationResult] =
    useState<ValidationResult | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState<
    "readme" | "solution" | "folder"
  >("readme");

  const form = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionFormSchema) as Resolver<SolutionFormValues>,
    defaultValues: {
      problemNumber: "",
      language: "",
      solutionCode: "",
      category: "",
      subcategory: "",
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
    formState: { errors },
    reset,
  } = form;

  const language = watch("language");
  const category = watch("category");
  const solutionCode = watch("solutionCode");
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
      const response = await fetch(
        `/api/leetcode/fetch-problem?number=${problemNumber}`
      );
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
      setFetchError(
        error instanceof Error ? error.message : "Failed to fetch problem"
      );
      setProblemData(null);
    } finally {
      setFetchLoading(false);
    }
  };

  // Handle manual entry save
  const handleManualEntrySave = (data: ManualProblemData) => {
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

  // Generate AI prompt template for manual copy-paste
  const generateAIPrompt = () => {
    const problemTitle = problemData?.title || "[Problem Title]";
    const problemDescription = problemData?.content || "[Problem Description]";
    const code = solutionCode || "[Your Solution Code]";
    const lang = language || "typescript";

    return `Analyze this LeetCode solution and generate a concise explanation in Markdown format.

**Problem:** ${problemTitle}

**Problem Description:**
${problemDescription.substring(0, 300)}${problemDescription.length > 300 ? "..." : ""}

**My Solution Code (${lang}):**
\`\`\`${lang}
${code.substring(0, 500)}${code.length > 500 ? "\n... (truncated)" : ""}
\`\`\`

**Please provide:**
1. **Approach**: Brief explanation of the solution strategy (2-3 sentences)
2. **Time Complexity**: Big-O notation with explanation
3. **Space Complexity**: Big-O notation with explanation

Format your response in Markdown with clear sections.`;
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

  // Load GitHub configuration from environment
  useEffect(() => {
    const fetchGithubConfig = async () => {
      try {
        const response = await fetch("/api/github/config");
        const data = await response.json();
        setGithubConfig(data);
      } catch (error) {
        console.error("Failed to load GitHub config:", error);
      }
    };
    fetchGithubConfig();
  }, []);

  // Auto-validate form whenever data changes
  useEffect(() => {
    const subscription = watch((values) => {
      const result = validateSolutionForm(
        {
          problemNumber: values.problemNumber,
          solutionCode: values.solutionCode,
          language: values.language,
          category: values.category,
          subcategory: values.subcategory,
          manualApproach: values.manualApproach,
          timeComplexity: values.timeComplexity,
          spaceComplexity: values.spaceComplexity,
        },
        problemData,
        githubConfig
      );
      setValidationResult(result);
    });

    // Run validation immediately on mount/when dependencies change
    const values = watch();
    const result = validateSolutionForm(
      {
        problemNumber: values.problemNumber,
        solutionCode: values.solutionCode,
        language: values.language,
        category: values.category,
        subcategory: values.subcategory,
        manualApproach: values.manualApproach,
        timeComplexity: values.timeComplexity,
        spaceComplexity: values.spaceComplexity,
      },
      problemData,
      githubConfig
    );
    setValidationResult(result);

    return () => subscription.unsubscribe();
  }, [problemData, githubConfig, watch]);

  //  Push to GitHub
  const pushToGitHub = async () => {
    if (!problemData) {
      setPushResult({
        success: false,
        message: "Please fetch a problem first",
      });
      return;
    }

    const values = watch();
    if (!values.solutionCode) {
      setPushResult({ success: false, message: "Please enter solution code" });
      return;
    }

    if (!values.manualApproach) {
      setPushResult({
        success: false,
        message: "Please enter solution approach",
      });
      return;
    }

    setPushing(true);
    setPushResult(null);

    try {
      const response = await fetch("/api/github/push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problemData: {
            questionFrontendId: problemData.questionFrontendId,
            title: problemData.title,
            difficulty: values.difficulty,
            content: problemData.content,
            topicTags: problemData.topicTags,
            problemUrl: problemData.problemUrl,
          },
          solutionData: {
            code: values.solutionCode,
            language: values.language,
            category: values.category,
            subcategory: values.subcategory,
            approach: values.manualApproach,
            timeComplexity: values.timeComplexity,
            spaceComplexity: values.spaceComplexity,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPushResult({
          success: true,
          message: data.message || "Successfully pushed to GitHub!",
          urls: {
            readme: data.readmeUrl,
            solution: data.solutionUrl,
          },
        });
      } else {
        setPushResult({
          success: false,
          message: data.error || "Failed to push to GitHub",
        });
      }
    } catch (error) {
      setPushResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to push to GitHub",
      });
    } finally {
      setPushing(false);
    }
  };

  const onSubmit = async (data: SolutionFormValues) => {
    console.log("Form submitted:", data);
    // Form submission now happens via the Push to GitHub button
  };

  const handleReset = () => {
    reset();
    localStorage.removeItem("leetcode-form-draft");
    setProblemData(null);
    setFetchError(null);
    setPushResult(null);
    setShowManualEntry(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Problem Number and Language */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="problemNumber"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Problem Number <span className="text-red-500">*</span>
          </label>
          <input
            {...register("problemNumber")}
            type="text"
            id="problemNumber"
            placeholder="e.g., 1358"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          />
          {errors.problemNumber && (
            <p className="mt-1 text-sm text-red-500">
              {errors.problemNumber.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="language"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Language <span className="text-red-500">*</span>
          </label>
          <select
            {...register("language")}
            id="language"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          >
            <option value="" disabled>
              Select Language
            </option>
            {languageOptions.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          {errors.language && (
            <p className="mt-1 text-sm text-red-500">
              {errors.language.message}
            </p>
          )}
        </div>
      </div>

      {/* Fetch Problem Button */}
      <div className="space-y-3">
        <button
          type="button"
          onClick={fetchProblemDetails}
          disabled={!problemNumber || fetchLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-zinc-200 px-4 py-3 font-medium text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
        >
          {fetchLoading ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
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
            className="w-full rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
          >
            {showManualEntry
              ? "Hide Manual Entry"
              : "📝 Enter Problem Details Manually"}
          </button>
        )}
      </div>

      {/* Manual Entry Form */}
      {showManualEntry && <ManualEntryForm onSave={handleManualEntrySave} />}

      {/* Problem Preview */}
      {!showManualEntry && (
        <ProblemPreview
          problem={problemData}
          loading={fetchLoading}
          error={fetchError}
        />
      )}

      {/* Solution Code */}
      <div>
        <label
          htmlFor="solutionCode"
          className="mb-2 block text-sm font-medium text-black dark:text-white"
        >
          Solution Code <span className="text-red-500">*</span>
        </label>
        <CodeEditor
          value={solutionCode}
          onChange={(value) => setValue("solutionCode", value)}
          language={language}
        />
        {errors.solutionCode && (
          <p className="mt-1 text-sm text-red-500">
            {errors.solutionCode.message}
          </p>
        )}
      </div>

      {/* Category and Subcategory */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Data Structure Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          >
            <option value="" disabled>
              Select Category
            </option>
            {categoryOptions.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="subcategory"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Sub-category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("subcategory")}
            id="subcategory"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          >
            <option value="" disabled>
              Select Subcategory
            </option>
            {(subcategoryOptions[category] || ["other"]).map((subcat) => (
              <option key={subcat} value={subcat}>
                {subcat
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </option>
            ))}
          </select>
          {errors.subcategory && (
            <p className="mt-1 text-sm text-red-500">
              {errors.subcategory.message}
            </p>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label className="mb-2 block text-sm font-medium text-black dark:text-white">
          Difficulty <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          {(["Easy", "Medium", "Hard"] as const).map((diff) => (
            <label
              key={diff}
              className="flex cursor-pointer items-center gap-2"
            >
              <input
                {...register("difficulty")}
                type="radio"
                value={diff}
                className="h-4 w-4 border-zinc-300 dark:border-zinc-700"
              />
              <span className="text-sm text-black dark:text-white">
                {diff === "Easy" && "🟢"} {diff === "Medium" && "🟧"}{" "}
                {diff === "Hard" && "🔴"} {diff}
              </span>
            </label>
          ))}
        </div>
        {errors.difficulty && (
          <p className="mt-1 text-sm text-red-500">
            {errors.difficulty.message}
          </p>
        )}
      </div>

      {/* Solution Approach Section */}
      <div className="space-y-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          💡 Solution Approach
        </h3>

        {/* AI Prompt Template - Collapsible */}
        <details className="group">
          <summary className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white">
            <span className="text-lg">🤖</span>
            <span>Show AI Prompt Template (Copy to ChatGPT/Claude/Gemini)</span>
          </summary>

          <div className="mt-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                Copy this prompt and paste it into your preferred AI tool
              </p>
              <button
                type="button"
                onClick={() => {
                  const prompt = generateAIPrompt();
                  navigator.clipboard.writeText(prompt);
                  alert("Prompt copied to clipboard!");
                }}
                className="rounded bg-black px-3 py-1 text-xs text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                📋 Copy
              </button>
            </div>
            <pre className="overflow-x-auto font-mono text-xs whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {generateAIPrompt()}
            </pre>
          </div>
        </details>

        {/* Manual Approach Input */}
        <div>
          <label
            htmlFor="manualApproach"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Your Solution Approach
          </label>
          <textarea
            {...register("manualApproach")}
            id="manualApproach"
            rows={8}
            placeholder="Explain your solution approach here... (Markdown supported)

Example:
## Approach
1. Use a hash map to store complements
2. Iterate through the array once

## Time Complexity
O(n) - single pass through array

## Space Complexity
O(n) - hash map storage"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 font-mono text-sm text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            Tip: Use Markdown formatting. This will be displayed in your README.
          </p>
          {errors.manualApproach && (
            <p className="mt-1 text-sm text-red-500">
              {errors.manualApproach.message}
            </p>
          )}
        </div>
      </div>
      {/* Complexity Analysis */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="timeComplexity"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Time Complexity
          </label>
          <input
            {...register("timeComplexity")}
            type="text"
            id="timeComplexity"
            placeholder="e.g., O(n)"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          />
        </div>

        <div>
          <label
            htmlFor="spaceComplexity"
            className="mb-2 block text-sm font-medium text-black dark:text-white"
          >
            Space Complexity
          </label>
          <input
            {...register("spaceComplexity")}
            type="text"
            id="spaceComplexity"
            placeholder="e.g., O(1)"
            className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
          />
        </div>
      </div>

      {/* GitHub Push Section */}
      <div className="space-y-4 border-t border-zinc-200 pt-6 dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black dark:text-white">
            📤 Push to GitHub
          </h3>
          {githubConfig && (
            <div className="text-xs text-zinc-600 dark:text-zinc-400">
              {githubConfig.hasToken ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Configured: {githubConfig.owner}/{githubConfig.repo}
                </span>
              ) : (
                <span className="text-red-600 dark:text-red-400">
                  ✗ Configure GITHUB_TOKEN in .env.local
                </span>
              )}
            </div>
          )}
        </div>

        {/* Push Result */}
        {pushResult && (
          <div
            className={`rounded-lg border p-4 ${
              pushResult.success
                ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
            }`}
          >
            <p
              className={`text-sm font-medium ${
                pushResult.success
                  ? "text-green-900 dark:text-green-200"
                  : "text-red-900 dark:text-red-200"
              }`}
            >
              {pushResult.message}
            </p>
            {pushResult.success && pushResult.urls && (
              <div className="mt-2 space-y-1">
                {pushResult.urls.readme && (
                  <a
                    href={pushResult.urls.readme}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-green-700 hover:underline dark:text-green-300"
                  >
                    📄 View README on GitHub →
                  </a>
                )}
                {pushResult.urls.solution && (
                  <a
                    href={pushResult.urls.solution}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-green-700 hover:underline dark:text-green-300"
                  >
                    💻 View Solution on GitHub →
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* Validation Checklist - Show when validation fails */}
        {validationResult && !validationResult.isValid && (
          <ValidationChecklist validationResult={validationResult} />
        )}

        {/* Preview Toggle Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
          >
            {showPreview ? (
              <>
                <EyeOff className="h-4 w-4" />
                Hide Preview
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Preview README & Structure
              </>
            )}
          </button>
        </div>

        {/* Preview Section */}
        {showPreview && (
          <div className="mt-6 overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
            {/* Tab Switcher */}
            <div className="flex border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
              <button
                type="button"
                onClick={() => setPreviewTab("readme")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  previewTab === "readme"
                    ? "border-b-2 border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                    : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                📄 README Preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("solution")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  previewTab === "solution"
                    ? "border-b-2 border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                    : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                💻 Solution Preview
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab("folder")}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  previewTab === "folder"
                    ? "border-b-2 border-black bg-white text-black dark:border-white dark:bg-black dark:text-white"
                    : "text-zinc-600 hover:text-black dark:text-zinc-400 dark:hover:text-white"
                }`}
              >
                📁 Folder Structure
              </button>
            </div>

            {/* Tab Content */}
            <div className="max-h-[600px] overflow-y-auto bg-white p-6 dark:bg-black">
              {previewTab === "readme" && (
                <MarkdownPreview
                  content={generatePreviewReadme(problemData, {
                    approach: watch("manualApproach") || "",
                    timeComplexity: watch("timeComplexity") || "",
                    spaceComplexity: watch("spaceComplexity") || "",
                    language: watch("language") || "",
                    solutionCode: watch("solutionCode") || "",
                  })}
                />
              )}

              {previewTab === "solution" && (
                <div className="space-y-2">
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Solution code preview:
                  </p>
                  <CodeEditor
                    value={watch("solutionCode") || "// No solution code yet"}
                    onChange={() => {}}
                    language={watch("language") || "typescript"}
                    height="400px"
                    options={{ readOnly: true }}
                  />
                </div>
              )}

              {previewTab === "folder" && (
                <FolderTreePreview
                  category={watch("category") || ""}
                  subcategory={watch("subcategory") || ""}
                  problemNumber={watch("problemNumber") || ""}
                  problemTitle={problemData?.title || ""}
                  language={watch("language") || ""}
                />
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={pushToGitHub}
          disabled={pushing || !validationResult?.isValid}
          className="w-full rounded-lg bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          {pushing
            ? "Pushing..."
            : !validationResult?.isValid
              ? "Complete Required Fields"
              : "📤 Push to GitHub"}
        </button>
      </div>

      {/* Form Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-lg border border-zinc-200 px-6 py-3 font-medium text-black transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
        >
          Reset Form
        </button>
      </div>
    </form>
  );
}
