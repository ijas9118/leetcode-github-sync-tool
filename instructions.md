# LeetCode Documentation Automation Tool - Complete Specification

## 🎯 Project Overview

Build a Next.js web application that automates the process of documenting LeetCode solutions and pushing them to a GitHub repository. The tool should fetch problem details from LeetCode, generate AI-powered approach explanations, and maintain a structured repository with separate files for code solutions and documentation.

---

## 📋 Core Features

### 1. **Solution Input Interface**
Create a clean, modern form interface where users can:
- **Input Question Number** (e.g., `1358`)
- **Select Programming Language** (TypeScript, JavaScript, Python, Java, C++, Go)
- **Input Solution Code** (syntax-highlighted code editor)
- **Select Data Structure Category** (dropdown with options: arrays, hashmap, stack, dp, graph, backtracking, binary search tree, etc.)
- **Select Sub-category** (e.g., for arrays: binary-search, sliding-window, two-pointers)
- **Select Difficulty Badge** (🟢 Easy, 🟧 Medium, 🔴 Hard)

### 2. **Automated LeetCode Data Fetching**
- Fetch problem details using LeetCode's GraphQL API or web scraping
- Extract:
  - Problem title
  - Problem statement/description
  - Examples with input/output
  - Constraints
  - Topics/tags
  - Difficulty level
  - Problem URL
- Display fetched data in a preview panel for user verification

### 3. **AI-Powered Approach Generation**
Integrate AI (OpenAI GPT-4, Anthropic Claude, or Google Gemini) to:
- Analyze the user's solution code
- Generate a clear, beginner-friendly explanation of the approach
- Break down the algorithm into simple steps
- Explain the intuition behind the solution
- Include time and space complexity analysis

**Toggle Option:**
- Users can choose between:
  - ✅ **AI-Generated Approach** (auto-generate from solution code)
  - ✏️ **Manual Input** (write custom approach explanation)

### 4. **File Structure Generation**

For each problem, create a folder with the following structure:

```
<data-structure>/<sub-category>/<problem-number>-<problem-slug>/
├── solution.<ext>          # Code file (e.g., solution.ts, solution.py)
└── README.md               # Problem details and approach
```

**Example:**
```
arrays/sliding-window/1358-number-of-substrings-containing-all-three-characters/
├── solution.ts
└── README.md
```

### 5. **README.md Format**

Generate README.md following this exact structure:

```markdown
# Metadata

<table>
  <tr>
   <td>Problem
   </td>
   <td><a href="[LEETCODE_URL]">[PROBLEM_NUMBER]. [PROBLEM_TITLE]</a>
   </td>
  </tr>
  <tr>
   <td>Topics
   </td>
   <td>[COMMA_SEPARATED_TOPICS]
   </td>
  </tr>
  <tr>
   <td>Difficulty
   </td>
   <td>[DIFFICULTY_EMOJI] [DIFFICULTY_LEVEL]
   </td>
  </tr>
  <tr>
   <td>Date
   </td>
   <td>[SUBMISSION_DATE]
   </td>
  </tr>
</table>

# Problem Statement

[PROBLEM_DESCRIPTION]

**Example 1**

Input: [INPUT] \
Output: [OUTPUT]

**Example 2**

Input: [INPUT] \
Output: [OUTPUT]

# Approach

## Idea

[AI_GENERATED_OR_MANUAL_APPROACH_EXPLANATION]

## Solution Code

```[LANGUAGE]
[USER_SOLUTION_CODE]
```

# Complexity Analysis

<table>
  <tr>
   <td><strong>Approach</strong>
   </td>
   <td><strong>Worst TC</strong>
   </td>
   <td><strong>Space Complexity</strong>
   </td>
  </tr>
  <tr>
   <td>[APPROACH_NAME]
   </td>
   <td>[WORST_TIME_COMPLEXITY]
   </td>
   <td>[SPACE_COMPLEXITY]
   </td>
  </tr>
</table>
```

### 6. **Solution File Format**

Create a separate solution file with the appropriate extension:
- TypeScript: `solution.ts`
- JavaScript: `solution.js`
- Python: `solution.py`
- Java: `solution.java`
- C++: `solution.cpp`
- Go: `solution.go`

The file should contain **only the solution code** (clean, no markdown).

### 7. **GitHub Integration**

**Authentication Method: GitHub Personal Access Token (PAT)**

We'll use Personal Access Tokens for simplicity and reliability:
- ✅ No OAuth server needed
- ✅ Simple one-time setup
- ✅ Full control over permissions
- ✅ Works perfectly for personal projects

**PAT Setup Steps:**
1. User generates a PAT at `github.com/settings/tokens` (classic token)
2. Grant `repo` scope (full control of repositories)
3. Copy token and store in app settings
4. Token is saved securely in browser localStorage (encrypted recommended)
5. Use Octokit SDK for all GitHub operations

**Security Notes:**
- Never commit the PAT to your code
- Store in environment variables for production
- Implement token validation on app launch
- Provide clear instructions for token regeneration

**Repository Operations:**
- Connect to repository: `github.com/ijas9118/my-leetcode-docs`
- Check if folder/file already exists
- Create new folders and files
- Commit changes with meaningful messages
- Push to main branch
- Display success/error notifications

**Commit Message Format:**
```
Add solution for [PROBLEM_NUMBER]: [PROBLEM_TITLE]

- Category: [DATA_STRUCTURE]/[SUB_CATEGORY]
- Language: [LANGUAGE]
- Difficulty: [DIFFICULTY]
```

### 8. **Preview & Validation**

Before pushing to GitHub:
- Show a live preview of generated README.md (rendered markdown)
- Display solution code with syntax highlighting
- Show folder structure that will be created
- Allow users to edit any field before final submission
- Validation checks:
  - Ensure problem number is valid
  - Check if solution already exists in repo
  - Verify GitHub connection

### 9. **Additional Features**

- **Auto-save Draft**: Save form data to localStorage
- **History**: Show recently submitted problems
- **Search Existing Solutions**: Browse previously submitted solutions
- **Bulk Import**: Upload multiple solutions via JSON/CSV
- **Dark/Light Mode**: Toggle theme
- **Keyboard Shortcuts**: Quick actions (Ctrl+Enter to submit, etc.)

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui or Radix UI
- **Code Editor**: Monaco Editor or CodeMirror
- **Markdown Renderer**: react-markdown or MDX
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: Zustand or React Context

### APIs & Services
- **LeetCode API**: GraphQL endpoint or web scraping with Cheerio/Puppeteer
- **AI Integration**: 
  - OpenAI GPT-4 API (free tier available)
  - Anthropic Claude API
  - Google Gemini API (free tier)
  - Or Hugging Face Inference API (free)
- **GitHub API**: 
  - `@octokit/rest` for GitHub operations
  - GitHub OAuth for authentication

### Deployment (Free Options)
- **Hosting**: Vercel (free tier) - perfect for Next.js
- **Alternative**: Netlify, Railway, or Render
- **Database** (if needed): Vercel Postgres, Supabase, or PlanetScale (free tier)

---

## 🔐 GitHub Integration - Implementation Guide

### Using Personal Access Token (PAT)

**User Setup Steps:**
1. Navigate to `github.com/settings/tokens`
2. Click "Generate new token (classic)"
3. Give it a descriptive name (e.g., "LeetCode Automation Tool")
4. Select `repo` scope (full control of private repositories)
5. Click "Generate token" and copy it immediately
6. Paste token into your app's settings page

**Implementation Code:**

```typescript
import { Octokit } from "@octokit/rest";

// Initialize Octokit with user's PAT
const octokit = new Octokit({ 
  auth: process.env.GITHUB_PAT // or from user input
});

// Function to create folder and files
async function pushToGitHub(problemData) {
  const owner = "ijas9118";
  const repo = "my-leetcode-docs";
  const folderPath = `${problemData.category}/${problemData.subcategory}/${problemData.problemNumber}-${problemData.slug}`;
  
  try {
    // Create README.md
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `${folderPath}/README.md`,
      message: `Add solution for ${problemData.problemNumber}: ${problemData.title}`,
      content: Buffer.from(problemData.readmeContent).toString("base64"),
      branch: "main"
    });
    
    // Create solution file
    await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path: `${folderPath}/solution.${problemData.extension}`,
      message: `Add solution code for ${problemData.problemNumber}`,
      content: Buffer.from(problemData.solutionCode).toString("base64"),
      branch: "main"
    });
    
    return { success: true };
  } catch (error) {
    console.error("GitHub push failed:", error);
    return { success: false, error: error.message };
  }
}
```

**Token Storage (Client-Side):**
```typescript
// Store token securely
const saveToken = (token: string) => {
  localStorage.setItem('github_pat', btoa(token)); // Basic encoding
};

// Retrieve token
const getToken = () => {
  const encoded = localStorage.getItem('github_pat');
  return encoded ? atob(encoded) : null;
};
```

**Token Validation:**
```typescript
async function validateToken(token: string) {
  try {
    const octokit = new Octokit({ auth: token });
    const { data } = await octokit.users.getAuthenticated();
    return { valid: true, username: data.login };
  } catch (error) {
    return { valid: false, error: "Invalid token" };
  }
}
```

---

## 📊 Sample Workflow

1. User opens the app
2. Connects GitHub account (one-time setup)
3. Enters problem number: `1358`
4. App fetches problem details from LeetCode
5. User pastes solution code (TypeScript)
6. User selects category: `arrays` > `sliding-window`
7. User clicks "Generate Approach with AI"
8. AI analyzes code and generates explanation
9. User reviews preview (README + solution file)
10. User enters complexity analysis or lets AI estimate
11. User clicks "Push to GitHub"
12. App creates folder structure and commits files
13. Success notification with link to GitHub commit

---

## 🎨 UI/UX Design Requirements

### Design Principles
- **Modern & Minimal**: Clean interface with focus on functionality
- **Dark Mode First**: Developer-friendly dark theme with light mode toggle
- **Responsive**: Mobile, tablet, and desktop optimized
- **Fast & Smooth**: Instant feedback, loading states, smooth transitions
- **Premium Feel**: Use gradients, shadows, and micro-animations

### Color Scheme
- **Primary**: Vibrant blue/purple gradient
- **Background**: Deep dark (#0a0a0a) with subtle noise texture
- **Cards**: Dark gray (#1a1a1a) with border glow
- **Accent**: Neon green for success, neon red for errors
- **Code Blocks**: VS Code dark+ theme

### Key Components
1. **Header**: Logo, GitHub connection status, theme toggle
2. **Input Form**: Multi-step wizard or single-page form
3. **Code Editor**: Full-screen mode, syntax highlighting
4. **Preview Panel**: Split view (form left, preview right)
5. **Toast Notifications**: Success/error feedback
6. **Loading States**: Skeleton screens, progress indicators

---

## 🚀 Implementation Roadmap

### Phase 1: Core Setup
- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Tailwind CSS and UI component library
- [ ] Create basic layout and routing
- [ ] Implement dark/light mode toggle

### Phase 2: Form & Input
- [ ] Build solution input form
- [ ] Add code editor (Monaco)
- [ ] Implement category/subcategory selection
- [ ] Add form validation with Zod

### Phase 3: LeetCode Integration
- [ ] Research LeetCode API/scraping approach
- [ ] Implement problem data fetching
- [ ] Parse and format problem details
- [ ] Handle edge cases and errors

### Phase 4: AI Integration
- [ ] Setup AI API (OpenAI/Gemini)
- [ ] Create prompt engineering for approach generation
- [ ] Implement complexity analysis generation
- [ ] Add manual override option

### Phase 5: GitHub Integration
- [ ] Implement GitHub OAuth or PAT authentication
- [ ] Create file generation logic
- [ ] Implement commit and push functionality
- [ ] Add conflict detection and handling

### Phase 6: Preview & Finalization
- [ ] Build markdown preview renderer
- [ ] Implement edit before submit
- [ ] Add validation and error handling
- [ ] Create success/failure notifications

### Phase 7: Polish & Deploy
- [ ] Add loading states and animations
- [ ] Implement auto-save and history
- [ ] Write documentation
- [ ] Deploy to Vercel
- [ ] Test end-to-end workflow

---

## 🔍 Technical Considerations

### LeetCode Data Fetching Challenges
- LeetCode doesn't have an official public API
- Options:
  1. **GraphQL API** (undocumented but works): `https://leetcode.com/graphql`
  2. **Web Scraping**: Use Puppeteer/Playwright
  3. **Third-party APIs**: LeetCode API alternatives
- Handle rate limiting and errors gracefully

### GitHub API Considerations
- File content must be base64 encoded
- Need SHA hash for updating existing files
- Handle large files (>1MB) using Git Data API
- Respect rate limits (5000 requests/hour for authenticated users)

### AI API Cost Optimization
- Use cheaper models for approach generation (GPT-3.5-turbo)
- Cache common patterns and explanations
- Implement token usage limits
- Consider free alternatives (Hugging Face, local models)

### Security Best Practices
- Never expose API keys in client-side code
- Use environment variables for sensitive data
- Implement API routes in Next.js for server-side operations
- Validate all user inputs
- Sanitize generated content before rendering

---

## 📦 Required Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "typescript": "^5.0.0",
    "@octokit/rest": "^20.0.0",
    "openai": "^4.0.0",
    "react-hook-form": "^7.0.0",
    "zod": "^3.22.0",
    "@monaco-editor/react": "^4.6.0",
    "react-markdown": "^9.0.0",
    "next-auth": "^4.24.0",
    "cheerio": "^1.0.0",
    "axios": "^1.6.0",
    "date-fns": "^3.0.0",
    "zustand": "^4.4.0",
    "@radix-ui/react-*": "latest",
    "tailwindcss": "^3.4.0"
  }
}
```

---

## 🎯 Success Criteria

The tool is successful when:
- ✅ User can submit a LeetCode solution in under 2 minutes
- ✅ AI generates accurate approach explanations 90%+ of the time
- ✅ GitHub integration works without manual git commands
- ✅ Generated documentation matches existing format exactly
- ✅ The UI feels premium and is enjoyable to use
- ✅ Zero cost for hosting and basic usage

---

## 💡 Future Enhancements

- **Stats Dashboard**: Track problems solved, languages used, difficulty distribution
- **Study Planner**: Schedule problems by topic and difficulty
- **Company Tags**: Filter by company-specific problems
- **Collaboration**: Share solutions with team members
- **Browser Extension**: Submit directly from LeetCode
- **Mobile App**: React Native version
- **PDF Export**: Generate study guides
- **Spaced Repetition**: Review system for problems

---

## 📄 Sample Prompts for AI Generation

### Approach Generation Prompt:
```
Analyze this LeetCode solution and generate a clear, beginner-friendly explanation:

Problem: [PROBLEM_TITLE]
Difficulty: [DIFFICULTY]
Topics: [TOPICS]

Solution Code:
[USER_CODE]

Generate:
1. A simple explanation of the main idea (2-3 sentences)
2. Step-by-step breakdown of the approach
3. Key insights that make this solution work
4. Common pitfalls to avoid

Write in a conversational, teaching style. Use simple language.
```

### Complexity Analysis Prompt:
```
Analyze the time and space complexity of this solution:

[USER_CODE]

Provide:
- Worst case time complexity (Big O notation)
- Space complexity (Big O notation)

Explain briefly why for each one.
```

---

## 🔗 Resources & References

- **LeetCode GraphQL Playground**: Inspect network tab on leetcode.com
- **GitHub API Docs**: https://docs.github.com/en/rest
- **Octokit SDK**: https://github.com/octokit/rest.js
- **Next.js Docs**: https://nextjs.org/docs
- **OpenAI API**: https://platform.openai.com/docs
- **Tailwind UI**: https://tailwindui.com

---

## 🎬 Getting Started

To build this tool:

1. **Setup Project**:
   ```bash
   npx create-next-app@latest leetcode-automation --typescript --tailwind --app
   cd leetcode-automation
   ```

2. **Install Dependencies**:
   ```bash
   npm install @octokit/rest openai react-hook-form zod @monaco-editor/react
   ```

3. **Create Environment Variables** (`.env.local`):
   ```
   OPENAI_API_KEY=your_key_here
   GITHUB_CLIENT_ID=your_client_id
   GITHUB_CLIENT_SECRET=your_client_secret
   NEXTAUTH_SECRET=generate_random_secret
   ```

4. **Start Building**:
   - Follow the implementation roadmap
   - Test each feature incrementally
   - Deploy early and iterate

---

## ✨ Final Notes

This tool should feel like magic to use. Every interaction should be smooth, every generated document should be perfect, and every push to GitHub should be seamless. Focus on the developer experience first - if it's delightful to use, you've succeeded.

The goal is to turn a 15-minute manual process into a 2-minute automated workflow while maintaining the quality and structure of your documentation.

**Remember**: Start simple, ship fast, iterate based on real usage. Don't over-engineer the first version.

Good luck building! 🚀
