import { Difficulty, SupportedLanguage } from "./api";

export type DataStructureCategory =
  | "arrays"
  | "hashmap"
  | "stack"
  | "queue"
  | "linked-list"
  | "tree"
  | "graph"
  | "dp"
  | "backtracking"
  | "binary-search-tree"
  | "heap"
  | "trie"
  | "string"
  | "math"
  | "bit-manipulation"
  | "greedy"
  | "divide-and-conquer";

export type SubCategory = {
  arrays:
    | "binary-search"
    | "sliding-window"
    | "two-pointers"
    | "prefix-sum"
    | "kadane"
    | "other";
  hashmap: "counting" | "grouping" | "frequency" | "other";
  stack: "monotonic" | "parentheses" | "other";
  queue: "bfs" | "deque" | "priority-queue" | "other";
  tree: "traversal" | "bst" | "construction" | "other";
  graph: "bfs" | "dfs" | "shortest-path" | "topological-sort" | "other";
  dp: "linear" | "2d" | "knapsack" | "subsequence" | "other";
  string: "pattern-matching" | "palindrome" | "substring" | "other";
  // Add more as needed
  [key: string]: string;
};

export interface SolutionFormData {
  problemNumber: string;
  language: SupportedLanguage;
  solutionCode: string;
  category: DataStructureCategory;
  subcategory: string;
  difficulty: Difficulty;
  useAI: boolean;
  manualApproach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}
