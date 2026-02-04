import { NextRequest } from "next/server";

import { ErrorCode } from "@/lib/api/errors";
import { ApiError, errorResponse, successResponse } from "@/lib/api/response";
import { fetchProblemData } from "@/lib/leetcode/api";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const problemNumber = searchParams.get("number");

    if (!problemNumber) {
      return errorResponse(
        "Problem number is required",
        400,
        ErrorCode.VALIDATION_ERROR
      );
    }

    const problemData = await fetchProblemData(problemNumber);

    return successResponse(problemData);
  } catch (error) {
    console.error("LeetCode API Error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch problem";
    const status = (error as ApiError).statusCode || 500;
    const code = (error as ApiError).code || ErrorCode.INTERNAL_ERROR;

    return errorResponse(message, status, code);
  }
}
