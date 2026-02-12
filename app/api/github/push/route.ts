import { NextRequest } from "next/server";

import { APP_CONFIG } from "@/constants/config";
import { ErrorCode } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { env } from "@/lib/env";
import { pushToGitHub } from "@/lib/github/api";
import { GitHubConfig, LeetCodeProblem, SolutionData } from "@/types/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemData, solutionData } = body;

    const config: GitHubConfig = {
      token: env.GITHUB_TOKEN,
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      branch: env.GITHUB_BRANCH || APP_CONFIG.DEFAULT_BRANCH,
    };

    // Validate request data
    if (!problemData || !solutionData) {
      return errorResponse(
        "Missing problem or solution data",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Validate solution data
    if (
      !solutionData.solutionCode ||
      !solutionData.language ||
      !solutionData.category ||
      !solutionData.subcategory
    ) {
      return errorResponse(
        "Missing required solution fields",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    // Ensure topics are populated
    if (!solutionData.topics && problemData.topicTags) {
      solutionData.topics = problemData.topicTags;
    }

    // Push to GitHub
    const result = await pushToGitHub(
      config,
      problemData as LeetCodeProblem,
      solutionData as SolutionData
    );

    if (result.success) {
      return successResponse(
        {
          readmeUrl: result.readmeUrl,
          solutionUrl: result.solutionUrl,
        },
        "Successfully pushed to GitHub!"
      );
    } else {
      return errorResponse(
        result.error || "Failed to push to GitHub",
        500,
        ErrorCode.EXTERNAL_API_ERROR
      );
    }
  } catch (error) {
    console.error("GitHub push error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Push failed",
      500,
      ErrorCode.INTERNAL_ERROR
    );
  }
}
