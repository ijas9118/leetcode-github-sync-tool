/**
 * Helper functions for parsing LeetCode problem content
 */

/**
 * Remove HTML tags from string
 */
export function stripHtml(html: string): string {
  // Remove HTML tags
  let text = html.replace(/<[^>]+>/g, " ");

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/<sup>/g, "^")
    .replace(/<\/sup>/g, "");

  // Clean up whitespace
  text = text.replace(/\s+/g, " ");
  text = text.replace(/\n\s+/g, "\n");

  return text.trim();
}

/**
 * Parse examples from problem content
 */
export function parseExamples(content: string): Array<{
  input: string;
  output: string;
  explanation?: string;
}> {
  const examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }> = [];

  // Find all "Example X:" headers
  // This matches:
  // <p><strong>Example 1:</strong></p>
  // <strong class="example">Example 1:</strong>
  // <strong>Example 1:</strong>
  const exampleHeaderRegex =
    /<[^>]*strong[^>]*>Example\s+(\d+):<\/[^>]*strong>(?:<\/[^>]*p>)?/gi;

  // Find all matches to get their positions
  const matches = [];
  let match;
  while ((match = exampleHeaderRegex.exec(content)) !== null) {
    matches.push({
      index: match.index,
      endIndex: match.index + match[0].length,
      fullMatch: match[0],
    });
  }

  // Process each example section
  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].endIndex;
    // End is either start of next example, Constraints section, or end of content
    let end = content.length;

    // Check for next example
    if (i + 1 < matches.length) {
      end = matches[i + 1].index;
    } else {
      // Check for Constraints section
      const constraintsMatch = content.match(
        /<[^>]*strong[^>]*>Constraints:<\/[^>]*strong>/i
      );
      if (constraintsMatch && constraintsMatch.index! > start) {
        end = constraintsMatch.index!;
      }
    }

    const exampleContent = content.substring(start, end);

    // Extract Input
    // Matches: <strong>Input:</strong> ... or Input: ...
    const inputMatch = exampleContent.match(
      /(?:<strong>)?Input:(?:<\/strong>)?\s*([\s\S]+?)(?=(?:<[^>]+>)?Output:|$)/i
    );
    const input = inputMatch ? stripHtml(inputMatch[1]).trim() : "";

    // Extract Output
    const outputMatch = exampleContent.match(
      /(?:<strong>)?Output:(?:<\/strong>)?\s*([\s\S]+?)(?=(?:<[^>]+>)?Explanation:|$)/i
    );
    const output = outputMatch ? stripHtml(outputMatch[1]).trim() : "";

    // Extract Explanation
    const explanationMatch = exampleContent.match(
      /(?:<strong>)?Explanation:(?:<\/strong>)?\s*([\s\S]+?)$/i
    );
    const explanation = explanationMatch
      ? stripHtml(explanationMatch[1]).trim()
      : undefined;

    if (input && output) {
      examples.push({ input, output, explanation });
    }
  }

  return examples;
}

/**
 * Parse constraints from problem content
 */
export function parseConstraints(content: string): string {
  // Match constraints section - can be <p><strong>Constraints:</strong></p> followed by <ul>
  const constraintsMatch = content.match(
    /<p><strong>Constraints:<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/i
  );

  if (!constraintsMatch) {
    // Try alternative format without p tags
    const altMatch = content.match(
      /<strong>Constraints:<\/strong>([\s\S]*?)(?=<\/div>|<p><strong|$)/i
    );
    if (!altMatch) {
      return "";
    }
    const constraintsHtml = altMatch[1];
    const listItems = constraintsHtml.match(/<li[^>]*>(.*?)<\/li>/gi);

    if (listItems) {
      return listItems
        .map((item) => {
          const text = stripHtml(item).trim();
          return `• ${text}`;
        })
        .join("\n");
    }
    return stripHtml(constraintsHtml).trim();
  }

  const constraintsHtml = constraintsMatch[1];

  // Extract list items
  const listItems = constraintsHtml.match(/<li[^>]*>(.*?)<\/li>/gi);

  if (listItems) {
    return listItems
      .map((item) => {
        const text = stripHtml(item).trim();
        return `• ${text}`;
      })
      .join("\n");
  }

  return stripHtml(constraintsHtml).trim();
}

/**
 * Extract problem statement (remove examples and constraints)
 */
export function extractProblemStatement(content: string): string {
  // Remove example and constraints sections to get just the problem statement
  let statement = content;

  // Remove examples - handle both formats
  statement = statement.replace(
    /<p><strong class="example">Example\s+\d+:<\/strong><\/p>\s*<pre>[\s\S]*?<\/pre>/gi,
    ""
  );
  statement = statement.replace(
    /<strong(?:\s+class="[^"]*")?>Example\s+\d+:<\/strong>[\s\S]*?(?=<strong(?:\s+class="[^"]*")?>(?:Example\s+\d+:|Constraints:)|$)/gi,
    ""
  );

  // Remove constraints - handle both formats
  statement = statement.replace(
    /<p><strong>Constraints:<\/strong><\/p>\s*<ul>[\s\S]*?<\/ul>/i,
    ""
  );
  statement = statement.replace(
    /<strong(?:\s+class="[^"]*")?>Constraints:<\/strong>[\s\S]*$/i,
    ""
  );

  // Strip HTML and clean up
  statement = stripHtml(statement).trim();

  // Remove excessive whitespace
  statement = statement.replace(/\n{3,}/g, "\n\n");

  return statement;
}

/**
 * Format difficulty string
 */
export function formatDifficulty(
  difficulty: string
): "Easy" | "Medium" | "Hard" {
  const normalized = difficulty.toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium") return "Medium";
  if (normalized === "hard") return "Hard";
  return "Medium"; // default
}
