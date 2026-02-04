import { NextRequest, NextResponse } from "next/server";

import { env } from "@/lib/env";
import {
  type GitHubConfig,
  type ProblemData,
  pushToGitHub,
  type SolutionData,
} from "@/lib/github-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { problemData, solutionData } = body;

    const config: GitHubConfig = {
      token: env.GITHUB_TOKEN,
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      branch: env.GITHUB_BRANCH,
    };

    // Validate request data
    if (!problemData || !solutionData) {
      return NextResponse.json(
        { success: false, error: "Missing problem or solution data" },
        { status: 400 }
      );
    }

    // Validate solution data
    if (
      !solutionData.code ||
      !solutionData.language ||
      !solutionData.category ||
      !solutionData.subcategory
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required solution fields" },
        { status: 400 }
      );
    }

    // Push to GitHub
    const result = await pushToGitHub(
      config,
      problemData as ProblemData,
      solutionData as SolutionData
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        readmeUrl: result.readmeUrl,
        solutionUrl: result.solutionUrl,
        message: "Successfully pushed to GitHub!",
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: result.error || "Failed to push to GitHub",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("GitHub push error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Push failed",
      },
      { status: 500 }
    );
  }
}
