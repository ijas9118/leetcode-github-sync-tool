import { APP_CONFIG, LEETCODE_API } from "@/constants/config";
import { ErrorCode } from "@/lib/api/errors";
import { ApiError } from "@/lib/api/response";
import { Difficulty, LeetCodeProblem } from "@/types/api";

import { stripHtml } from "../utils/text";

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
  maxRetries = APP_CONFIG.RETRY_COUNT
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
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error("Max retries exceeded");
}

export async function fetchProblemData(
  problemNumber: string
): Promise<LeetCodeProblem> {
  // Step 1: Get the titleSlug from problem number
  const listResponse = await fetchWithRetry(LEETCODE_API.GRAPHQL_ENDPOINT, {
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
        limit: 1, // Only need 1 match
        filters: {
          searchKeywords: problemNumber,
        },
      },
    }),
  });

  const listData: ProblemListResponse = await listResponse.json();

  if (listData.errors || !listData.data?.problemsetQuestionList) {
    throw new ApiError(
      "Failed to fetch problem list from LeetCode",
      502,
      ErrorCode.EXTERNAL_API_ERROR
    );
  }

  // Find the exact match for the problem number
  const problem = listData.data.problemsetQuestionList.questions.find(
    (q) => q.questionFrontendId === problemNumber
  );

  if (!problem) {
    throw new ApiError(
      `Problem #${problemNumber} not found`,
      404,
      ErrorCode.NOT_FOUND
    );
  }

  // Step 2: Get full problem details using titleSlug
  const detailsResponse = await fetchWithRetry(LEETCODE_API.GRAPHQL_ENDPOINT, {
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
  });

  const detailsData: LeetCodeProblemResponse = await detailsResponse.json();

  if (detailsData.errors || !detailsData.data?.question) {
    throw new ApiError(
      "Failed to fetch problem details from LeetCode",
      502,
      ErrorCode.EXTERNAL_API_ERROR
    );
  }

  const questionData = detailsData.data.question;

  return {
    questionId: questionData.questionId,
    questionFrontendId: questionData.questionFrontendId,
    title: questionData.title,
    titleSlug: questionData.titleSlug,
    difficulty: questionData.difficulty as Difficulty,
    content: questionData.content,
    topicTags: questionData.topicTags.map((tag) => tag.name),
    exampleTestcases: questionData.exampleTestcases,
    hints: (questionData.hints || []).map((hint) => stripHtml(hint)),
    sampleTestCase: questionData.sampleTestCase,
    problemUrl: `${LEETCODE_API.BASE_URL}/problems/${questionData.titleSlug}/`,
  };
}
