# LeetCode Solution Sync Tool 🚀

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn-UI-black?logo=radix-ui)

An automated documentation tool designed to help developers seamlessly document and sync their LeetCode solutions to GitHub. It generates professional `README.md` files and organizes your code into a structured repository, making your portfolio stand out.

---

## 🌟 Features

| Feature | Description |
| :--- | :--- |
| **🔄 Auto-Sync** | Push your solutions and documentation to GitHub with a single click. |
| **📝 Smart Documentation** | Automatically generates `README.md` with problem descriptions, tags, and complexity analysis. |
| **🎨 Modern UI** | Built with **Shadcn UI** and **Tailwind CSS** for a clean, accessible, and responsive experience. |
| **💻 Code Editor** | Integrated **Monaco Editor** for a premium coding experience right in the browser. |
| **📂 Structured Repo** | Organizes solutions by category and difficulty (e.g., `Arrays/Unknown/1-two-sum/`). |
| **🔒 Secure** | Uses your personal GitHub Token (PAT) stored locally in environment variables. |

---

## 🛠️ Tech Stack

This project is built using modern web technologies to ensure performance and scalability.

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **GitHub Integration**: [Octokit](https://github.com/octokit/rest.js)
- **Code Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

---

## 🚀 How It Works

1.  **Input Problem Details**: Enter the LeetCode problem ID, title, description, and your solution code.

2.  **Add Approach & Complexity**: Document your thought process, time complexity, and space complexity.

3.  **Generate Preview**: The tool creates a live preview of exactly how your GitHub README will look.

4.  **Sync to GitHub**: With one click, the tool pushes two files to your configured repository:
    *   `Solution.{ext}` (Your code file)

    *   `README.md` (Formatted documentation)

### Example Generated README Structure

When a solution is pushed, it creates a folder structure like `Category/Subcategory/Id-Slug/`. The generated `README.md` inside looks like this:

> # 1. Two Sum
>
> **Difficulty**: 🟢 Easy
> **Topics**: Array, Hash Table
> **Link**: [LeetCode](https://leetcode.com/problems/two-sum/)
>
> ---
>
> ## Problem Description
> Given an array of integers `nums` and an integer `target`...
>
> ---
>
> ## Solution Approach
> We can use a hash map to store the indices of the numbers...
>
> **Time Complexity**: O(n)
> **Space Complexity**: O(n)
>
> ---
>
> ## Solution Code
> ```typescript
> function twoSum(nums: number[], target: number): number[] { ... }
> ```

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository
```bash
git clone https://github.com/ijas9118/leetcode-github-sync-tool.git
cd leetcode-github-sync-tool
```

### 2. Install Dependencies
We use `pnpm` for package management.
```bash
pnpm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory. You can use the example file as a template:
```bash
cp .env.example .env.local
```

### 4. Setup GitHub Token (Important) 🔑
To allow the tool to push code to your repository, you need a GitHub Personal Access Token.

1.  Go to [GitHub Developer Settings > Personal Access Tokens](https://github.com/settings/tokens).
2.  Click **Generate new token (classic)**.
3.  Give it a name (e.g., "LeetCode Sync Tool").
4.  **Select Scopes**: Check `repo` (Full control of private repositories).
5.  Click **Generate token**.
6.  Copy the token starting with `ghp_...`.

Update your `.env.local` file:
```env
# GitHub Personal Access Token
GITHUB_TOKEN=ghp_your_generated_token_here

# Target Repository Details
GITHUB_OWNER=your_github_username
GITHUB_REPO=your_target_repo_name
GITHUB_BRANCH=main
```
*Note: Ensure the `GITHUB_REPO` already exists in your GitHub account.*

### 5. Run the Application
Start the development server:
```bash
pnpm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

Created with ❤️ by **[ijas9118](https://github.com/ijas9118)**
