import { NextRequest, NextResponse } from "next/server";

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

    // Get GitHub config from environment variables
    const token = process.env.GITHUB_TOKEN;
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const branch = process.env.GITHUB_BRANCH || "main";

    // Validate environment configuration
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "GITHUB_TOKEN not configured in environment variables",
        },
        { status: 500 }
      );
    }

    if (!owner || !repo) {
      return NextResponse.json(
        {
          success: false,
          error:
            "GITHUB_OWNER and GITHUB_REPO must be configured in environment variables",
        },
        { status: 500 }
      );
    }

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

    const config: GitHubConfig = {
      token,
      owner,
      repo,
      branch,
    };

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
