import { NextRequest, NextResponse } from "next/server";
import { validateGitHubToken } from "@/lib/github-utils";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: "Token is required" },
        { status: 400 }
      );
    }

    const result = await validateGitHubToken(token);

    if (result.valid) {
      return NextResponse.json({
        valid: true,
        user: result.user,
      });
    } else {
      return NextResponse.json(
        {
          valid: false,
          error: result.error || "Invalid token",
        },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("GitHub validation error:", error);
    return NextResponse.json(
      {
        valid: false,
        error: error instanceof Error ? error.message : "Validation failed",
      },
      { status: 500 }
    );
  }
}
