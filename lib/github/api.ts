import { Octokit } from "@octokit/rest";

import { GitHubConfig, LeetCodeProblem, SolutionData } from "@/types/api";

import {
  generateFilePath,
  generateReadmeContent,
  getFileExtension,
} from "./file-generator";

export interface GitHubPushResult {
  success: boolean;
  readmeUrl?: string;
  solutionUrl?: string;
  error?: string;
}

/**
 * Push files to GitHub as a single commit
 */
export async function pushToGitHub(
  config: GitHubConfig,
  problemData: LeetCodeProblem,
  solutionData: SolutionData
): Promise<GitHubPushResult> {
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
      content: Buffer.from(solutionData.solutionCode).toString("base64"),
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
