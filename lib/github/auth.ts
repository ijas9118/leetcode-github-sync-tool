import { Octokit } from "@octokit/rest";

export interface GitHubUser {
  login: string;
  name: string | null;
}

/**
 * Validate GitHub token by checking user authentication
 * @param token GitHub personal access token
 * @returns Object indicating validity and user details if valid
 */
export async function validateGitHubToken(token: string): Promise<{
  valid: boolean;
  user?: GitHubUser;
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
