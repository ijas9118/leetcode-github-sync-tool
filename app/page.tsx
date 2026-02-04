import { SolutionForm } from "@/components/forms/solution-form";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-black dark:text-white">
              Create Documentation
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Enter your LeetCode solution details below to generate
              documentation and push to GitHub.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-black">
            <SolutionForm />
          </div>
        </div>
      </main>
    </div>
  );
}
