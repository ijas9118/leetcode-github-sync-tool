import { NextResponse } from "next/server";

import { env } from "@/lib/env";

export async function GET() {
  try {
    const config = {
      hasToken: !!env.GITHUB_TOKEN,
      owner: env.GITHUB_OWNER,
      repo: env.GITHUB_REPO,
      branch: env.GITHUB_BRANCH,
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
