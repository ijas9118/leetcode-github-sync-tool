import { SolutionForm } from "@/components/solution-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
              Create Documentation
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Enter your LeetCode solution details below to generate documentation and push to GitHub.
            </p>
          </div>

          <div className="bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
            <SolutionForm />
          </div>
        </div>
      </main>
    </div>
  );
}

