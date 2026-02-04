import { NextRequest } from "next/server";

import { ErrorCode } from "@/lib/api/errors";
import { errorResponse, successResponse } from "@/lib/api/response";
import { validateGitHubToken } from "@/lib/github/auth";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return errorResponse(
        "Token is required",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const result = await validateGitHubToken(token);

    if (result.valid) {
      return successResponse({
        valid: true,
        user: result.user,
      });
    } else {
      return errorResponse(
        result.error || "Invalid token",
        401,
        ErrorCode.UNAUTHORIZED
      );
    }
  } catch (error) {
    console.error("GitHub validation error:", error);
    return errorResponse(
      error instanceof Error ? error.message : "Validation failed",
      500,
      ErrorCode.INTERNAL_ERROR
    );
  }
}
