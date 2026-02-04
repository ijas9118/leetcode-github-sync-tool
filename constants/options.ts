// Language display names
export const languageOptions = [
  { value: "typescript", label: "TypeScript", extension: "ts" },
  { value: "javascript", label: "JavaScript", extension: "js" },
  { value: "python", label: "Python", extension: "py" },
  { value: "java", label: "Java", extension: "java" },
  { value: "cpp", label: "C++", extension: "cpp" },
  { value: "go", label: "Go", extension: "go" },
] as const;

// Category display names
export const categoryOptions = [
  { value: "arrays", label: "Arrays" },
  { value: "hashmap", label: "Hash Map" },
  { value: "stack", label: "Stack" },
  { value: "queue", label: "Queue" },
  { value: "linked-list", label: "Linked List" },
  { value: "tree", label: "Tree" },
  { value: "graph", label: "Graph" },
  { value: "dp", label: "Dynamic Programming" },
  { value: "backtracking", label: "Backtracking" },
  { value: "binary-search-tree", label: "Binary Search Tree" },
  { value: "heap", label: "Heap" },
  { value: "trie", label: "Trie" },
  { value: "string", label: "String" },
  { value: "math", label: "Math" },
  { value: "bit-manipulation", label: "Bit Manipulation" },
  { value: "greedy", label: "Greedy" },
  { value: "divide-and-conquer", label: "Divide and Conquer" },
] as const;

// Subcategory options based on category
export const subcategoryOptions: Record<string, string[]> = {
  arrays: [
    "binary-search",
    "sliding-window",
    "two-pointers",
    "prefix-sum",
    "kadane",
    "other",
  ],
  hashmap: ["counting", "grouping", "frequency", "other"],
  stack: ["monotonic", "parentheses", "other"],
  queue: ["bfs", "deque", "priority-queue", "other"],
  "linked-list": ["reversal", "two-pointers", "fast-slow", "other"],
  tree: ["traversal", "bst", "construction", "other"],
  graph: ["bfs", "dfs", "shortest-path", "topological-sort", "other"],
  dp: ["linear", "2d", "knapsack", "subsequence", "other"],
  backtracking: ["permutations", "combinations", "subsets", "other"],
  "binary-search-tree": ["validation", "traversal", "construction", "other"],
  heap: ["min-heap", "max-heap", "k-elements", "other"],
  trie: ["prefix-tree", "word-search", "autocomplete", "other"],
  string: ["pattern-matching", "palindrome", "substring", "other"],
  math: ["number-theory", "geometry", "combinatorics", "other"],
  "bit-manipulation": ["bitwise-operations", "bit-masking", "other"],
  greedy: ["intervals", "scheduling", "optimization", "other"],
  "divide-and-conquer": ["sorting", "searching", "merge", "other"],
};

export const difficultyOptions = [
  { value: "Easy", label: "Easy", color: "green" },
  { value: "Medium", label: "Medium", color: "orange" },
  { value: "Hard", label: "Hard", color: "red" },
] as const;
