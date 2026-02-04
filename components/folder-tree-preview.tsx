"use client";

import { FileText, Folder } from "lucide-react";

interface FolderTreePreviewProps {
  category: string;
  subcategory: string;
  problemNumber: string;
  problemTitle: string;
  language: string;
}

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    typescript: "ts",
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
    go: "go",
  };
  return extensions[language] || "txt";
}

export function FolderTreePreview({
  category,
  subcategory,
  problemNumber,
  problemTitle,
  language,
}: FolderTreePreviewProps) {
  // Create slug from title
  const slug = problemTitle
    ? problemTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    : "problem-title";

  const folderName = problemNumber
    ? `${problemNumber}-${slug}`
    : "number-problem-title";

  const extension = getFileExtension(language || "typescript");
  const solutionFileName = `solution.${extension}`;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-black dark:text-white">
        📂 Files to be created:
      </h3>

      <div className="space-y-1 font-mono text-sm">
        {/* Root */}
        <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
          <Folder className="h-4 w-4" />
          <span>{category || "category"}/</span>
        </div>

        {/* Subcategory */}
        <div className="flex items-center gap-2 pl-6 text-zinc-600 dark:text-zinc-400">
          <Folder className="h-4 w-4" />
          <span>{subcategory || "subcategory"}/</span>
        </div>

        {/* Problem folder */}
        <div className="flex items-center gap-2 pl-12 text-zinc-600 dark:text-zinc-400">
          <Folder className="h-4 w-4" />
          <span>{folderName}/</span>
        </div>

        {/* Solution file */}
        <div className="flex items-center gap-2 pl-18 text-black dark:text-white">
          <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-semibold">{solutionFileName}</span>
        </div>

        {/* README file */}
        <div className="flex items-center gap-2 pl-18 text-black dark:text-white">
          <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
          <span className="font-semibold">README.md</span>
        </div>
      </div>

      {/* Full path display */}
      <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs text-zinc-500 dark:text-zinc-500">Full path:</p>
        <p className="mt-1 font-mono text-sm text-black dark:text-white">
          {category || "category"}/{subcategory || "subcategory"}/{folderName}/
        </p>
      </div>
    </div>
  );
}
