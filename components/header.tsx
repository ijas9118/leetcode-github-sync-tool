"use client";

import { Code2, Github } from "lucide-react";

import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black dark:bg-white">
            <Code2 className="h-5 w-5 text-white dark:text-black" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-black dark:text-white">
              LeetCode Docs
            </h1>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Automation Tool
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-1.5 dark:border-zinc-800">
            <Github className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Not Connected
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
