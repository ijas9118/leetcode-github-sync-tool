import { Octokit } from "@octokit/rest";

export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export interface ProblemData {
  questionFrontendId: string;
  title: string;
  difficulty: string;
  content: string;
  topicTags: string[];
  problemUrl: string;
}

export interface SolutionData {
  code: string;
  language: string;
  category: string;
  subcategory: string;
  approach: string;
  timeComplexity: string;
  spaceComplexity: string;
}

// Validate GitHub token by checking user authentication
export async function validateGitHubToken(token: string): Promise<{
  valid: boolean;
  user?: { login: string; name: string | null };
  error?: string;
}> {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.rest.users.getAuthenticated();

    return {
      valid: true,
      user: {
        login: data.login,
        name: data.name,
      },
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid token",
    };
  }
}

// Generate file path based on category structure
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

// Get file extension based on language
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

// Generate preview README content for the form preview
export function generatePreviewReadme(
  problemData: ProblemData | null,
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

  const solutionData: SolutionData = {
    code: formValues.solutionCode,
    language: formValues.language as SolutionData["language"],
    approach: formValues.approach || "*No approach provided yet*",
    timeComplexity: formValues.timeComplexity,
    spaceComplexity: formValues.spaceComplexity,
    category: "arrays", // Not used in README generation but required by interface
    subcategory: "other", // Not used in README generation but required by interface
  };

  return generateReadmeContent(problemData, solutionData);
}

// Generate README content
export function generateReadmeContent(
  problemData: ProblemData,
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
${solutionData.code}
\`\`\`

---

*Auto-generated using [LeetCode Documentation Tool](https://github.com/ijas9118/leetcode-github-sync-tool)*
`;
}

// Push files to GitHub as a single commit
export async function pushToGitHub(
  config: GitHubConfig,
  problemData: ProblemData,
  solutionData: SolutionData
): Promise<{
  success: boolean;
  readmeUrl?: string;
  solutionUrl?: string;
  error?: string;
}> {
  try {
    const octokit = new Octokit({ auth: config.token });
    const ext = getFileExtension(solutionData.language);

    // Generate file paths
    const readmePath = generateFilePath(
      solutionData.category,
      solutionData.subcategory,
      problemData.questionFrontendId,
      problemData.title,
      true
    );

    const solutionPath = `${generateFilePath(
      solutionData.category,
      solutionData.subcategory,
      problemData.questionFrontendId,
      problemData.title
    )}.${ext}`;

    // Generate content
    const readmeContent = generateReadmeContent(problemData, solutionData);

    // Get the current commit SHA of the branch
    const { data: refData } = await octokit.rest.git.getRef({
      owner: config.owner,
      repo: config.repo,
      ref: `heads/${config.branch}`,
    });
    const currentCommitSha = refData.object.sha;

    // Get the tree SHA of the current commit
    const { data: commitData } = await octokit.rest.git.getCommit({
      owner: config.owner,
      repo: config.repo,
      commit_sha: currentCommitSha,
    });
    const currentTreeSha = commitData.tree.sha;

    // Create blobs for both files
    const readmeBlob = await octokit.rest.git.createBlob({
      owner: config.owner,
      repo: config.repo,
      content: Buffer.from(readmeContent).toString("base64"),
      encoding: "base64",
    });

    const solutionBlob = await octokit.rest.git.createBlob({
      owner: config.owner,
      repo: config.repo,
      content: Buffer.from(solutionData.code).toString("base64"),
      encoding: "base64",
    });

    // Create a new tree with both files
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: config.owner,
      repo: config.repo,
      base_tree: currentTreeSha,
      tree: [
        {
          path: readmePath,
          mode: "100644",
          type: "blob",
          sha: readmeBlob.data.sha,
        },
        {
          path: solutionPath,
          mode: "100644",
          type: "blob",
          sha: solutionBlob.data.sha,
        },
      ],
    });

    // Check if files already exist to determine commit message
    let commitMessage: string;
    try {
      await octokit.rest.repos.getContent({
        owner: config.owner,
        repo: config.repo,
        path: readmePath,
        ref: config.branch,
      });
      commitMessage = `Update: ${problemData.questionFrontendId}. ${problemData.title}`;
    } catch {
      commitMessage = `Add: ${problemData.questionFrontendId}. ${problemData.title}`;
    }

    // Create a new commit with both files
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: config.owner,
      repo: config.repo,
      message: commitMessage,
      tree: newTree.sha,
      parents: [currentCommitSha],
    });

    // Update the branch reference to point to the new commit
    await octokit.rest.git.updateRef({
      owner: config.owner,
      repo: config.repo,
      ref: `heads/${config.branch}`,
      sha: newCommit.sha,
    });

    // Construct GitHub URLs for the files
    const baseUrl = `https://github.com/${config.owner}/${config.repo}/blob/${config.branch}`;
    const readmeUrl = `${baseUrl}/${readmePath}`;
    const solutionUrl = `${baseUrl}/${solutionPath}`;

    return {
      success: true,
      readmeUrl,
      solutionUrl,
    };
  } catch (error) {
    console.error("GitHub push error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to push to GitHub",
    };
  }
}
