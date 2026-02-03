"use client";

import { Code2, Github } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center">
            <Code2 className="w-5 h-5 text-white dark:text-black" />
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
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
            <Github className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
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
