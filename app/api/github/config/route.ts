import { ErrorCode } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { env } from "@/lib/env";

export async function GET() {
  try {
    const config = {
      hasToken: !!env.GITHUB_TOKEN,
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      branch: env.GITHUB_BRANCH,
    };

    return successResponse(config);
  } catch (error) {
    console.error("GitHub config error:", error);
    return errorResponse(
      "Failed to get GitHub config",
      500,
      ErrorCode.INTERNAL_ERROR
    );
  }
}
