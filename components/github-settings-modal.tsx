"use client";

import { useState, useEffect } from "react";
import { X, Check, AlertCircle } from "lucide-react";

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

export function GitHubSettingsModal({ isOpen, onClose }: GitHubSettingsModalProps) {
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            ⚙️ GitHub Settings
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Box */}
          <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
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
              3. Select <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">repo</code> scope
              <br />
              4. Copy the token and paste it below
            </p>
          </div>

          {/* Token Input */}
          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              GitHub Personal Access Token *
            </label>
            <input
              type="password"
              value={settings.token}
              onChange={(e) => setSettings({ ...settings, token: e.target.value })}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white font-mono text-sm"
            />
            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Your token is stored locally in your browser only
            </p>
          </div>

          {/* Test Connection Button */}
          <button
            onClick={testConnection}
            disabled={testing || !settings.token}
            className="w-full px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? "Testing..." : "🔌 Test Connection"}
          </button>

          {/* Test Result */}
          {testResult && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border ${
                testResult.success
                  ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
              }`}
            >
              {testResult.success ? (
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
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
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {testResult.user.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Repository Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Repository Owner *
              </label>
              <input
                type="text"
                value={settings.owner}
                onChange={(e) => setSettings({ ...settings, owner: e.target.value })}
                placeholder="username"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black dark:text-white mb-2">
                Repository Name *
              </label>
              <input
                type="text"
                value={settings.repo}
                onChange={(e) => setSettings({ ...settings, repo: e.target.value })}
                placeholder="my-leetcode-docs"
                className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-white mb-2">
              Branch *
            </label>
            <input
              type="text"
              value={settings.branch}
              onChange={(e) => setSettings({ ...settings, branch: e.target.value })}
              placeholder="main"
              className="w-full px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black text-black dark:text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
          </div>

          {/* Repository URL Preview */}
          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">Repository URL:</p>
            <p className="text-sm text-black dark:text-white font-mono break-all">
              https://github.com/{settings.owner}/{settings.repo}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveSettings}
            disabled={!settings.token || !settings.owner || !settings.repo || !settings.branch}
            className="flex-1 px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
