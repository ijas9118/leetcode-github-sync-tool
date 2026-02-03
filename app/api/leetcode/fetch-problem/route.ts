import { NextRequest, NextResponse } from "next/server";

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const PROBLEM_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      questionId
      questionFrontendId
      title
      titleSlug
      content
      difficulty
      exampleTestcases
      topicTags {
        name
      }
      hints
      sampleTestCase
    }
  }
`;

const PROBLEM_BY_ID_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        questionId
        questionFrontendId
        title
        titleSlug
      }
    }
  }
`;

interface LeetCodeProblemResponse {
  data?: {
    question?: {
      questionId: string;
      questionFrontendId: string;
      title: string;
      titleSlug: string;
      content: string;
      difficulty: string;
      exampleTestcases?: string;
      topicTags: { name: string }[];
      hints?: string[];
      sampleTestCase?: string;
    };
  };
  errors?: { message: string; extensions?: Record<string, unknown> }[];
}

interface ProblemListResponse {
  data?: {
    problemsetQuestionList?: {
      total: number;
      questions: {
        questionId: string;
        questionFrontendId: string;
        title: string;
        titleSlug: string;
      }[];
    };
  };
  errors?: { message: string; extensions?: Record<string, unknown> }[];
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries = 3
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      if (response.ok || response.status === 404) {
        return response;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxRetries - 1) {
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const problemNumber = searchParams.get("number");

    if (!problemNumber) {
      return NextResponse.json(
        { error: "Problem number is required" },
        { status: 400 }
      );
    }

    // Step 1: Get the titleSlug from problem number
    const listResponse = await fetchWithRetry(
      LEETCODE_GRAPHQL_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify({
          query: PROBLEM_BY_ID_QUERY,
          variables: {
            categorySlug: "",
            skip: 0,
            limit: 5000,
            filters: {
              searchKeywords: problemNumber,
            },
          },
        }),
      },
      3
    );

    const listData: ProblemListResponse = await listResponse.json();

    if (listData.errors || !listData.data?.problemsetQuestionList) {
      return NextResponse.json(
        { error: "Failed to fetch problem list" },
        { status: 500 }
      );
    }

    // Find the exact match for the problem number
    const problem = listData.data.problemsetQuestionList.questions.find(
      (q) => q.questionFrontendId === problemNumber
    );

    if (!problem) {
      return NextResponse.json(
        { error: `Problem #${problemNumber} not found` },
        { status: 404 }
      );
    }

    // Step 2: Get full problem details using titleSlug
    const detailsResponse = await fetchWithRetry(
      LEETCODE_GRAPHQL_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0",
        },
        body: JSON.stringify({
          query: PROBLEM_QUERY,
          variables: {
            titleSlug: problem.titleSlug,
          },
        }),
      },
      3
    );

    const detailsData: LeetCodeProblemResponse = await detailsResponse.json();

    if (detailsData.errors || !detailsData.data?.question) {
      return NextResponse.json(
        { error: "Failed to fetch problem details" },
        { status: 500 }
      );
    }

    const questionData = detailsData.data.question;

    // Parse and structure the response
    const problemData = {
      questionId: questionData.questionId,
      questionFrontendId: questionData.questionFrontendId,
      title: questionData.title,
      titleSlug: questionData.titleSlug,
      difficulty: questionData.difficulty,
      content: questionData.content,
      topicTags: questionData.topicTags.map((tag) => tag.name),
      exampleTestcases: questionData.exampleTestcases,
      hints: questionData.hints || [],
      sampleTestCase: questionData.sampleTestCase,
      problemUrl: `https://leetcode.com/problems/${questionData.titleSlug}/`,
    };

    return NextResponse.json(problemData);
  } catch (error) {
    console.error("LeetCode API Error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch problem from LeetCode",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
