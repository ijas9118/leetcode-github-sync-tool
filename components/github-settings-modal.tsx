"use client";

import { AlertCircle, Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface GitHubSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GitHubSettings {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function GitHubSettingsModal({
  isOpen,
  onClose,
}: GitHubSettingsModalProps) {
  const [settings, setSettings] = useState<GitHubSettings>({
    token: "",
    owner: "ijas9118",
    repo: "my-leetcode-docs",
    branch: "main",
  });

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    user?: { login: string; name: string | null };
  } | null>(null);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem("github-settings");
      if (saved) {
        try {
          const parsed = JSON.parse(atob(saved));
          setSettings(parsed);
        } catch (error) {
          console.error("Failed to load GitHub settings:", error);
        }
      }
    }
  }, [isOpen]);

  const testConnection = async () => {
    if (!settings.token) {
      setTestResult({
        success: false,
        message: "Please enter a GitHub token",
      });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch("/api/github/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: settings.token }),
      });

      const data = await response.json();

      if (data.valid) {
        setTestResult({
          success: true,
          message: `Connected as @${data.user.login}`,
          user: data.user,
        });
      } else {
        setTestResult({
          success: false,
          message: data.error || "Invalid token",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: error instanceof Error ? error.message : "Connection failed",
      });
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = () => {
    // Basic encoding (not encryption, just obfuscation)
    const encoded = btoa(JSON.stringify(settings));
    localStorage.setItem("github-settings", encoded);

    alert("GitHub settings saved!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            ⚙️ GitHub Settings
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-black dark:hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Info Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>How to get a GitHub Personal Access Token:</strong>
              <br />
              1. Go to{" "}
              <a
                href="https://github.com/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                GitHub Settings → Personal access tokens
              </a>
              <br />
              2. Click &quot;Generate new token (classic)&quot;
              <br />
              3. Select{" "}
              <code className="rounded bg-blue-100 px-1 dark:bg-blue-900">
                repo
              </code>{" "}
              scope
              <br />
              4. Copy the token and paste it below
            </p>
          </div>

          {/* Token Input */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              GitHub Personal Access Token *
            </label>
            <input
              type="password"
              value={settings.token}
              onChange={(e) =>
                setSettings({ ...settings, token: e.target.value })
              }
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 font-mono text-sm text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Your token is stored locally in your browser only
            </p>
          </div>

          {/* Test Connection Button */}
          <button
            onClick={testConnection}
            disabled={testing || !settings.token}
            className="w-full rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {testing ? "Testing..." : "🔌 Test Connection"}
          </button>

          {/* Test Result */}
          {testResult && (
            <div
              className={`flex items-start gap-3 rounded-lg border p-4 ${
                testResult.success
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20"
                  : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
              }`}
            >
              {testResult.success ? (
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600 dark:text-red-400" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    testResult.success
                      ? "text-green-900 dark:text-green-200"
                      : "text-red-900 dark:text-red-200"
                  }`}
                >
                  {testResult.message}
                </p>
                {testResult.user?.name && (
                  <p className="mt-1 text-xs text-green-700 dark:text-green-300">
                    {testResult.user.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Repository Settings */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Repository Owner *
              </label>
              <input
                type="text"
                value={settings.owner}
                onChange={(e) =>
                  setSettings({ ...settings, owner: e.target.value })
                }
                placeholder="username"
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                Repository Name *
              </label>
              <input
                type="text"
                value={settings.repo}
                onChange={(e) =>
                  setSettings({ ...settings, repo: e.target.value })
                }
                placeholder="my-leetcode-docs"
                className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-black dark:text-white">
              Branch *
            </label>
            <input
              type="text"
              value={settings.branch}
              onChange={(e) =>
                setSettings({ ...settings, branch: e.target.value })
              }
              placeholder="main"
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-black placeholder:text-zinc-400 focus:ring-2 focus:ring-black focus:outline-none dark:border-zinc-800 dark:bg-black dark:text-white dark:focus:ring-white"
            />
          </div>

          {/* Repository URL Preview */}
          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="mb-1 text-xs text-zinc-500 dark:text-zinc-400">
              Repository URL:
            </p>
            <p className="font-mono text-sm break-all text-black dark:text-white">
              https://github.com/{settings.owner}/{settings.repo}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-zinc-200 p-6 dark:border-zinc-800">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-zinc-200 px-4 py-2 text-black transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:text-white dark:hover:bg-zinc-900"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={
              !settings.token ||
              !settings.owner ||
              !settings.repo ||
              !settings.branch
            }
            className="flex-1 rounded-lg bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
