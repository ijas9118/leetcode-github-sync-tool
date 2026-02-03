// Core type definitions for LeetCode Documentation Automation Tool

export type Language = 'typescript' | 'javascript' | 'python' | 'java' | 'cpp' | 'go';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type DataStructureCategory = 
  | 'arrays'
  | 'hashmap'
  | 'stack'
  | 'queue'
  | 'linked-list'
  | 'tree'
  | 'graph'
  | 'dp'
  | 'backtracking'
  | 'binary-search-tree'
  | 'heap'
  | 'trie'
  | 'string'
  | 'math'
  | 'bit-manipulation'
  | 'greedy'
  | 'divide-and-conquer';

export type SubCategory = {
  arrays: 'binary-search' | 'sliding-window' | 'two-pointers' | 'prefix-sum' | 'kadane' | 'other';
  hashmap: 'counting' | 'grouping' | 'frequency' | 'other';
  stack: 'monotonic' | 'parentheses' | 'other';
  queue: 'bfs' | 'deque' | 'priority-queue' | 'other';
  tree: 'traversal' | 'bst' | 'construction' | 'other';
  graph: 'bfs' | 'dfs' | 'shortest-path' | 'topological-sort' | 'other';
  dp: 'linear' | '2d' | 'knapsack' | 'subsequence' | 'other';
  string: 'pattern-matching' | 'palindrome' | 'substring' | 'other';
  // Add more as needed
  [key: string]: string;
};

export interface LeetCodeProblem {
  questionId: string;
  title: string;
  titleSlug: string;
  content: string;
  difficulty: Difficulty;
  topicTags: string[];
  exampleTestcases?: string;
  sampleTestCase?: string;
  constraints?: string;
  hints?: string[];
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
  language: Language;
  solutionCode: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
  category: DataStructureCategory;
  subcategory: string;
  submissionDate: string;
}

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface FormData {
  problemNumber: string;
  language: Language;
  solutionCode: string;
  category: DataStructureCategory;
  subcategory: string;
  difficulty: Difficulty;
  useAI: boolean;
  manualApproach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface HistoryItem {
  id: string;
  problemNumber: string;
  problemTitle: string;
  language: Language;
  difficulty: Difficulty;
  timestamp: number;
  githubUrl?: string;
}
