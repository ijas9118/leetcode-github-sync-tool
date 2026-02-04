export type SupportedLanguage =
  | "typescript"
  | "javascript"
  | "python"
  | "java"
  | "cpp"
  | "go";

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface LeetCodeProblem {
  questionId: string;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  content: string;
  difficulty: Difficulty;
  topicTags: string[];
  exampleTestcases?: string;
  sampleTestCase?: string;
  constraints?: string;
  hints?: string[];
  problemUrl?: string; // Optional because it's constructed
}

export interface Example {
  input: string;
  output: string;
  explanation?: string;
}

export interface SolutionData {
  problemNumber: string;
  problemTitle: string;
  problemSlug: string;
  problemUrl: string;
  problemStatement: string;
  examples: Example[];
  constraints: string;
  topics: string[];
  difficulty: Difficulty;
  language: SupportedLanguage;
  solutionCode: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: string;
  subcategory: string;
  submissionDate: string;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface GitHubPushResult {
  success: boolean;
  url?: string;
  error?: string;
  prNumber?: number;
}
