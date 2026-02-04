"use client";

import { useTheme } from "next-themes";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export function MarkdownPreview({
  content,
  className = "",
}: MarkdownPreviewProps) {
  const { theme } = useTheme();

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code(props: any) {
            const { inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            return !inline && language ? (
              <SyntaxHighlighter
                style={theme === "dark" ? oneDark : oneLight}
                language={language}
                PreTag="div"
                className="!mt-0 !mb-4"
                {...rest}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...rest}>
                {children}
              </code>
            );
          },
          // Style other elements to match GitHub
          h1(props: React.HTMLAttributes<HTMLHeadingElement>) {
            return (
              <h1
                className="mt-6 mb-4 border-b border-zinc-200 pb-2 text-3xl font-bold dark:border-zinc-800"
                {...props}
              />
            );
          },
          h2(props: React.HTMLAttributes<HTMLHeadingElement>) {
            return (
              <h2
                className="mt-6 mb-4 border-b border-zinc-200 pb-2 text-2xl font-bold dark:border-zinc-800"
                {...props}
              />
            );
          },
          h3(props: React.HTMLAttributes<HTMLHeadingElement>) {
            return <h3 className="mt-6 mb-4 text-xl font-bold" {...props} />;
          },
          table(props: React.HTMLAttributes<HTMLTableElement>) {
            return (
              <div className="my-4 overflow-x-auto">
                <table
                  className="min-w-full divide-y divide-zinc-200 border border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800"
                  {...props}
                />
              </div>
            );
          },
          th(props: React.HTMLAttributes<HTMLTableCellElement>) {
            return (
              <th
                className="bg-zinc-50 px-4 py-2 text-left text-sm font-semibold dark:bg-zinc-900"
                {...props}
              />
            );
          },
          td(props: React.HTMLAttributes<HTMLTableCellElement>) {
            return (
              <td
                className="border-t border-zinc-200 px-4 py-2 text-sm dark:border-zinc-800"
                {...props}
              />
            );
          },
          blockquote(props: React.HTMLAttributes<HTMLQuoteElement>) {
            return (
              <blockquote
                className="border-l-4 border-zinc-300 pl-4 text-zinc-600 italic dark:border-zinc-700 dark:text-zinc-400"
                {...props}
              />
            );
          },
          a(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
            return (
              <a
                className="text-blue-600 hover:underline dark:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              />
            );
          },
          ul(props: React.HTMLAttributes<HTMLUListElement>) {
            return (
              <ul className="list-inside list-disc space-y-1" {...props} />
            );
          },
          ol(props: React.HTMLAttributes<HTMLOListElement>) {
            return (
              <ol className="list-inside list-decimal space-y-1" {...props} />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
