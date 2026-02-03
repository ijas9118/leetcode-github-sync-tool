export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
              LeetCode Documentation Automation
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Automate your LeetCode solution documentation and push them to GitHub with AI-powered approach explanations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors">
              <div className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center mb-4">
                <span className="text-2xl filter invert dark:invert-0">📝</span>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Input Solution
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Enter your problem number and solution code with syntax highlighting
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors">
              <div className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center mb-4">
                <span className="text-2xl filter invert dark:invert-0">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                AI Generation
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Generate approach explanations using AI or write your own
              </p>
            </div>

            <div className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-black dark:hover:border-white transition-colors">
              <div className="w-10 h-10 rounded-lg bg-black dark:bg-white flex items-center justify-center mb-4">
                <span className="text-2xl filter invert dark:invert-0">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Push to GitHub
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Automatically create structured folders and files in your repo
              </p>
            </div>
          </div>

          <div className="text-center">
            <button className="px-8 py-3 rounded-lg bg-black dark:bg-white text-white dark:text-black font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

