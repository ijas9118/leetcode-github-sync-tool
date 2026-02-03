import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const config = {
      hasToken: !!process.env.GITHUB_TOKEN,
      owner: process.env.GITHUB_OWNER || "",
      repo: process.env.GITHUB_REPO || "",
      branch: process.env.GITHUB_BRANCH || "main",
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error("GitHub config error:", error);
    return NextResponse.json(
      { error: "Failed to get GitHub config" },
      { status: 500 }
    );
  }
}
