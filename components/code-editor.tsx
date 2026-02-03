"use client";

import { Editor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
}

export function CodeEditor({ value, onChange, language, height = "400px" }: CodeEditorProps) {
  const { theme } = useTheme();

  const getMonacoLanguage = (lang: string) => {
    const languageMap: Record<string, string> = {
      typescript: "typescript",
      javascript: "javascript",
      python: "python",
      java: "java",
      cpp: "cpp",
      go: "go",
    };
    return languageMap[lang] || "typescript";
  };

  return (
    <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={value}
        onChange={(value) => onChange(value || "")}
        theme={theme === "dark" ? "vs-dark" : "light"}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
