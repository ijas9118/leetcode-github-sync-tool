"use client";

import {
  extractProblemStatement,
  parseConstraints,
  parseExamples,
} from "@/lib/leetcode/parser";

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
  hints?: string[];
  isManual?: boolean;
}

interface ProblemPreviewProps {
  problem: LeetCodeProblem | null;
  loading: boolean;
  error: string | null;
}

export function ProblemPreview({
  problem,
  loading,
  error,
}: ProblemPreviewProps) {
  if (loading) {
    return (
      <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent dark:border-white dark:border-t-transparent" />
          <p className="text-zinc-600 dark:text-zinc-400">
            Fetching problem details from LeetCode...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-950/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="mb-1 font-semibold text-red-900 dark:text-red-200">
              Error
            </h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-800">
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          Enter a problem number and click &quot;Fetch Problem Details&quot; to
          preview
        </p>
      </div>
    );
  }

  // Handle manual entry data differently
  const isManual = problem.isManual === true;
  const examples = isManual
    ? problem.examples || []
    : parseExamples(problem.content);
  const constraints = isManual
    ? problem.constraints || ""
    : parseConstraints(problem.content);
  const statement = isManual
    ? problem.content
    : extractProblemStatement(problem.content);


  const difficultyColor =
    {
      Easy: "text-green-600 dark:text-green-400",
      Medium: "text-orange-600 dark:text-orange-400",
      Hard: "text-red-600 dark:text-red-400",
    }[problem.difficulty] || "text-zinc-600 dark:text-zinc-400";

  const difficultyEmoji =
    {
      Easy: "🟢",
      Medium: "🟧",
      Hard: "🔴",
    }[problem.difficulty] || "⚪";

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="border-b border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="mb-1 text-lg font-semibold text-black dark:text-white">
              {problem.questionFrontendId}. {problem.title}
            </h3>
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 hover:underline dark:text-zinc-400"
            >
              {problem.problemUrl}
            </a>
          </div>
          <span
            className={`text-sm font-medium ${difficultyColor} whitespace-nowrap`}
          >
            {difficultyEmoji} {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 p-6">
        {/* Topics */}
        {problem.topicTags.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
              Topics
            </h4>
            <div className="flex flex-wrap gap-2">
              {problem.topicTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-zinc-200 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Problem Statement */}
        <div>
          <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
            Problem Statement
          </h4>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
              {statement}
            </p>
          </div>
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm font-semibold text-black dark:text-white">
              Examples
            </h4>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Example {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-black dark:text-white">
                        Input:{" "}
                      </span>
                      <code className="text-zinc-700 dark:text-zinc-300">
                        {example.input}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold text-black dark:text-white">
                        Output:{" "}
                      </span>
                      <code className="text-zinc-700 dark:text-zinc-300">
                        {example.output}
                      </code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-semibold text-black dark:text-white">
                          Explanation:{" "}
                        </span>
                        <span className="text-zinc-700 dark:text-zinc-300">
                          {example.explanation}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Constraints */}
        {constraints && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
              Constraints
            </h4>
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900">
              <pre className="font-mono text-sm whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">
                {constraints}
              </pre>
            </div>
          </div>
        )}

        {/* Hints */}
        {problem.hints && problem.hints.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-semibold text-black dark:text-white">
              💡 Hints
            </h4>
            <div className="space-y-2">
              {problem.hints.map((hint, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="flex gap-2">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      {index + 1}.
                    </span>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300">
                      {hint}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
