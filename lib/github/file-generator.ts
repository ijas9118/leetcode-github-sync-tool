import { LeetCodeProblem, SolutionData, SupportedLanguage } from "@/types/api";

/**
 * Generate file path based on category structure
 */
export function generateFilePath(
  category: string,
  subcategory: string,
  problemNumber: string,
  title: string,
  isReadme: boolean = false
): string {
  // Create slug from title
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const folderName = `${problemNumber}-${slug}`;
  const fileName = isReadme ? "README.md" : `solution`;

  return `${category}/${subcategory}/${folderName}/${fileName}`;
}

/**
 * Get file extension based on language
 */
export function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    typescript: "ts",
    javascript: "js",
    python: "py",
    java: "java",
    cpp: "cpp",
    go: "go",
  };

  return extensions[language] || "txt";
}

/**
 * Generate README content
 */
export function generateReadmeContent(
  problemData: LeetCodeProblem,
  solutionData: SolutionData
): string {
  const difficultyBadge =
    {
      Easy: "🟢 Easy",
      Medium: "🟧 Medium",
      Hard: "🔴 Hard",
    }[problemData.difficulty] || problemData.difficulty;

  return `# ${problemData.questionFrontendId}. ${problemData.title}

**Difficulty**: ${difficultyBadge}  
**Topics**: ${problemData.topicTags.join(", ")}  
**Link**: [LeetCode](${problemData.problemUrl})

---

## Problem Description

${problemData.content.replace(/<[^>]+>/g, "").substring(0, 500)}...

[View full problem on LeetCode](${problemData.problemUrl})

---

## Solution Approach

${solutionData.approach}

**Time Complexity**: ${solutionData.timeComplexity}  
**Space Complexity**: ${solutionData.spaceComplexity}

---

## Solution Code

\`\`\`${solutionData.language}
${solutionData.solutionCode}
\`\`\`

---

*Auto-generated using [LeetCode Documentation Tool](https://github.com/ijas9118/leetcode-github-sync-tool)*
`;
}

/**
 * Generate preview README content for the form preview
 */
export function generatePreviewReadme(
  problemData: LeetCodeProblem | null,
  formValues: {
    approach: string;
    timeComplexity: string;
    spaceComplexity: string;
    language: string;
    solutionCode: string;
  }
): string {
  if (!problemData) {
    return `# Preview README

*Fetch a problem to see the full preview*

## Solution Approach

${formValues.approach || "*No approach provided yet*"}

**Time Complexity**: ${formValues.timeComplexity || "Not specified"}  
**Space Complexity**: ${formValues.spaceComplexity || "Not specified"}

## Solution Code

\`\`\`${formValues.language || "typescript"}
${formValues.solutionCode || "// Your solution code will appear here"}
\`\`\`
`;
  }

  // Map form values to SolutionData interface structure
  const solutionData: SolutionData = {
    problemNumber: problemData.questionFrontendId,
    problemTitle: problemData.title,
    problemSlug: problemData.titleSlug,
    problemUrl: problemData.problemUrl || "",
    problemStatement: problemData.content,
    examples: [],
    constraints: "",
    topics: problemData.topicTags,
    difficulty: problemData.difficulty,
    language: formValues.language as SupportedLanguage,
    solutionCode: formValues.solutionCode,
    approach: formValues.approach || "*No approach provided yet*",
    timeComplexity: formValues.timeComplexity,
    spaceComplexity: formValues.spaceComplexity,
    category: "arrays", // Placeholder
    subcategory: "other", // Placeholder
    submissionDate: new Date().toISOString(),
  };

  return generateReadmeContent(problemData, solutionData);
}
