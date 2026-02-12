"use client";

import { Code2, Github } from "lucide-react";
import { Badge } from "@/components/ui/badge";


import { ThemeToggle } from "../theme-toggle";

export function Header({ githubProfile }: { githubProfile?: string }) {
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
          {githubProfile ? (
            <Badge variant="outline" className="gap-1.5 py-1.5">
              <Github className="h-3.5 w-3.5" />
              <span>{githubProfile}</span>
              <span className="ml-1.5 flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
            </Badge>
          ) : (
            <Badge variant="secondary" className="gap-1.5 py-1.5 text-zinc-500">
              <Github className="h-3.5 w-3.5" />
              <span>Not Connected</span>
            </Badge>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
