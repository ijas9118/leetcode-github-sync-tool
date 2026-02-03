// Helper functions for parsing LeetCode problem content

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

  // Match example blocks - they can be in <p> tags with <strong class="example"> or just <strong>
  // Pattern: <strong class="example">Example 1:</strong> ... content in <pre> tags or directly
  const exampleRegex = /<p><strong class="example">Example\s+(\d+):<\/strong><\/p>\s*<pre>([\s\S]*?)<\/pre>/gi;
  
  let match;
  while ((match = exampleRegex.exec(content)) !== null) {
    const exampleNum = match[1];
    const preContent = match[2];
    
    // Extract Input - can be <strong>Input:</strong> s = "..." or plain text
    const inputMatch = preContent.match(/<strong>Input:<\/strong>\s*(.+?)(?=\n<strong>|$)/i);
    let input = inputMatch ? stripHtml(inputMatch[1]).trim() : "";
    
    // If no match, try without strong tags
    if (!input) {
      const plainInputMatch = preContent.match(/Input:\s*(.+?)(?=\nOutput:|$)/i);
      input = plainInputMatch ? plainInputMatch[1].trim() : "";
    }
    
    // Extract Output
    const outputMatch = preContent.match(/<strong>Output:<\/strong>\s*(.+?)(?=\n<strong>|$)/i);
    let output = outputMatch ? stripHtml(outputMatch[1]).trim() : "";
    
    // If no match, try without strong tags
    if (!output) {
      const plainOutputMatch = preContent.match(/Output:\s*(.+?)(?=\nExplanation:|$)/i);
      output = plainOutputMatch ? plainOutputMatch[1].trim() : "";
    }
    
    // Extract Explanation (optional)
    const explanationMatch = preContent.match(/<strong>Explanation:<\/strong>\s*([\s\S]+?)(?=\n<strong>|$)/i);
    let explanation = explanationMatch ? stripHtml(explanationMatch[1]).trim() : undefined;
    
    // If no match, try without strong tags
    if (!explanation) {
      const plainExplanationMatch = preContent.match(/Explanation:\s*([\s\S]+?)$/i);
      explanation = plainExplanationMatch ? plainExplanationMatch[1].trim() : undefined;
    }

    if (input && output) {
      examples.push({ input, output, explanation });
    }
  }

  return examples;
}

export function parseConstraints(content: string): string {
  // Match constraints section - can be <p><strong>Constraints:</strong></p> followed by <ul>
  const constraintsMatch = content.match(/<p><strong>Constraints:<\/strong><\/p>\s*<ul>([\s\S]*?)<\/ul>/i);
  
  if (!constraintsMatch) {
    // Try alternative format without p tags
    const altMatch = content.match(/<strong>Constraints:<\/strong>([\s\S]*?)(?=<\/div>|<p><strong|$)/i);
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

export function extractProblemStatement(content: string): string {
  // Remove example and constraints sections to get just the problem statement
  let statement = content;
  
  // Remove examples - handle both formats
  statement = statement.replace(/<p><strong class="example">Example\s+\d+:<\/strong><\/p>\s*<pre>[\s\S]*?<\/pre>/gi, "");
  statement = statement.replace(/<strong(?:\s+class="[^"]*")?>Example\s+\d+:<\/strong>[\s\S]*?(?=<strong(?:\s+class="[^"]*")?>(?:Example\s+\d+:|Constraints:)|$)/gi, "");
  
  // Remove constraints - handle both formats
  statement = statement.replace(/<p><strong>Constraints:<\/strong><\/p>\s*<ul>[\s\S]*?<\/ul>/i, "");
  statement = statement.replace(/<strong(?:\s+class="[^"]*")?>Constraints:<\/strong>[\s\S]*$/i, "");
  
  // Strip HTML and clean up
  statement = stripHtml(statement).trim();
  
  // Remove excessive whitespace
  statement = statement.replace(/\n{3,}/g, "\n\n");
  
  return statement;
}

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

export function formatDifficulty(difficulty: string): "Easy" | "Medium" | "Hard" {
  const normalized = difficulty.toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium") return "Medium";
  if (normalized === "hard") return "Hard";
  return "Medium"; // default
}
