export interface ValidationRule {
  id: string;
  label: string;
  passed: boolean;
  errorMessage: string;
}

export interface ValidationResult {
  isValid: boolean;
  rules: ValidationRule[];
}

interface FormData {
  problemNumber?: string;
  solutionCode?: string;
  language?: string;
  category?: string;
  subcategory?: string;
  manualApproach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

interface ProblemData {
  questionFrontendId?: string;
  title?: string;
}

interface GitHubConfig {
  hasToken: boolean;
  owner: string;
  repo: string;
}

export function validateSolutionForm(
  formData: FormData,
  problemData: ProblemData | null,
  githubConfig: GitHubConfig | null
): ValidationResult {
  const rules: ValidationRule[] = [
    {
      id: "problem-data",
      label: "Problem data loaded",
      passed: !!problemData && !!problemData.questionFrontendId,
      errorMessage: "Please fetch a problem or enter manual problem data",
    },
    {
      id: "solution-code",
      label: "Solution code provided",
      passed:
        !!formData.solutionCode && formData.solutionCode.trim().length > 0,
      errorMessage: "Solution code cannot be empty",
    },
    {
      id: "language",
      label: "Programming language selected",
      passed: !!formData.language && formData.language.trim().length > 0,
      errorMessage: "Please select a programming language",
    },
    {
      id: "category",
      label: "Category selected",
      passed: !!formData.category && formData.category.trim().length > 0,
      errorMessage: "Please select a problem category",
    },
    {
      id: "subcategory",
      label: "Subcategory selected",
      passed: !!formData.subcategory && formData.subcategory.trim().length > 0,
      errorMessage: "Please select a subcategory",
    },
    {
      id: "approach",
      label: "Solution approach provided",
      passed:
        !!formData.manualApproach && formData.manualApproach.trim().length > 0,
      errorMessage: "Please explain your solution approach",
    },
    {
      id: "time-complexity",
      label: "Time complexity provided",
      passed:
        !!formData.timeComplexity &&
        /^O\(.+\)$/.test(formData.timeComplexity.trim()),
      errorMessage: "Must be in Big O notation, e.g., O(n)",
    },
    {
      id: "space-complexity",
      label: "Space complexity provided",
      passed:
        !!formData.spaceComplexity &&
        /^O\(.+\)$/.test(formData.spaceComplexity.trim()),
      errorMessage: "Must be in Big O notation, e.g., O(1)",
    },
    {
      id: "github-config",
      label: "GitHub configured",
      passed: !!githubConfig && githubConfig.hasToken,
      errorMessage: "GitHub token not configured in .env.local",
    },
  ];

  const isValid = rules.every((rule) => rule.passed);

  return {
    isValid,
    rules,
  };
}
