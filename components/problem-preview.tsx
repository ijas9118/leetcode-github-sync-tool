"use client";

import { parseExamples, parseConstraints, extractProblemStatement } from "@/lib/leetcode-parser";

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

interface ProblemPreviewProps {
  problem: LeetCodeProblem | null;
  loading: boolean;
  error: string | null;
}

export function ProblemPreview({ problem, loading, error }: ProblemPreviewProps) {
  if (loading) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-black dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-600 dark:text-zinc-400">Fetching problem details from LeetCode...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">Error</h3>
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
        <p className="text-zinc-500 dark:text-zinc-400 text-center">
          Enter a problem number and click &quot;Fetch Problem Details&quot; to preview
        </p>
      </div>
    );
  }

  // Handle manual entry data differently
  const isManual = problem.isManual === true;
  const examples = isManual ? (problem.examples || []) : parseExamples(problem.content);
  const constraints = isManual ? (problem.constraints || "") : parseConstraints(problem.content);
  const statement = isManual ? problem.content : extractProblemStatement(problem.content);

  const difficultyColor = {
    Easy: "text-green-600 dark:text-green-400",
    Medium: "text-orange-600 dark:text-orange-400",
    Hard: "text-red-600 dark:text-red-400",
  }[problem.difficulty] || "text-zinc-600 dark:text-zinc-400";

  const difficultyEmoji = {
    Easy: "🟢",
    Medium: "🟧",
    Hard: "🔴",
  }[problem.difficulty] || "⚪";

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-zinc-50 dark:bg-zinc-900 p-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
              {problem.questionFrontendId}. {problem.title}
            </h3>
            <a
              href={problem.problemUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:underline"
            >
              {problem.problemUrl}
            </a>
          </div>
          <span className={`text-sm font-medium ${difficultyColor} whitespace-nowrap`}>
            {difficultyEmoji} {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Topics */}
        {problem.topicTags.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Topics</h4>
            <div className="flex flex-wrap gap-2">
              {problem.topicTags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Problem Statement */}
        <div>
          <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Problem Statement</h4>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">{statement}</p>
          </div>
        </div>

        {/* Examples */}
        {examples.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-black dark:text-white mb-3">Examples</h4>
            <div className="space-y-4">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900"
                >
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                      Example {index + 1}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold text-black dark:text-white">Input: </span>
                      <code className="text-zinc-700 dark:text-zinc-300">{example.input}</code>
                    </div>
                    <div>
                      <span className="font-semibold text-black dark:text-white">Output: </span>
                      <code className="text-zinc-700 dark:text-zinc-300">{example.output}</code>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="font-semibold text-black dark:text-white">Explanation: </span>
                        <span className="text-zinc-700 dark:text-zinc-300">{example.explanation}</span>
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
            <h4 className="text-sm font-semibold text-black dark:text-white mb-2">Constraints</h4>
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
              <pre className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-mono">
                {constraints}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
