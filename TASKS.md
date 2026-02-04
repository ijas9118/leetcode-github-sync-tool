# LeetCode GitHub Sync Tool - Implementation Tasks

**Project**: Code Quality & Architecture Improvements  
**Start Date**: 2026-02-04  
**Estimated Duration**: 4 phases, ~20-30 hours total

---

## 📊 Progress Overview

- [ ] **Phase 1**: Project Structure & Foundation (6-8 hours)
- [ ] **Phase 2**: Type Safety & API Standardization (5-6 hours)
- [ ] **Phase 3**: Component Refactoring with shadcn/ui (6-8 hours)
- [ ] **Phase 4**: Performance & Polish (3-4 hours)

---

## 🎯 Phase 1: Project Structure & Foundation

**Goal**: Reorganize folder structure, set up proper architecture, and create foundational utilities

**Estimated Time**: 6-8 hours

### 1.1 Folder Structure Reorganization

- [x] Create new folder structure:

  ```
  ├── app/
  ├── components/
  │   ├── ui/              # shadcn components
  │   ├── forms/           # Form-related components
  │   ├── preview/         # Preview components
  │   ├── layout/          # Layout components (header, etc.)
  │   └── modals/          # Modal dialogs
  ├── lib/
  │   ├── api/             # API utilities
  │   ├── github/          # GitHub-specific utilities
  │   ├── leetcode/        # LeetCode-specific utilities
  │   ├── utils/           # General utilities
  │   └── validations/     # Zod schemas
  ├── hooks/               # Custom React hooks
  ├── services/            # Business logic services
  ├── types/               # TypeScript types
  └── constants/           # App constants
  ```

- [x] Move existing files to new structure:
  - [x] Move `github-utils.ts` → split into `lib/github/` modules
  - [x] Move `leetcode-parser.ts` → `lib/leetcode/parser.ts`
  - [x] Move `validations.ts` → `lib/validations/schemas.ts`
  - [x] Move form components → `components/forms/`
  - [x] Move preview components → `components/preview/`

- [x] Update all import paths after restructuring

### 1.2 Create Type Definitions

- [x] Create `types/api.ts`:
  - [x] Define `LeetCodeProblem` interface
  - [x] Define `SolutionData` interface
  - [x] Define `GitHubConfig` interface
  - [x] Define `GitHubPushResult` interface
  - [x] Export `SupportedLanguage` type
  - [x] Export `Difficulty` type

- [x] Create `types/forms.ts`:
  - [x] Define form value types
  - [x] Define form state types

- [x] Create `types/components.ts`:
  - [x] Define component prop types

### 1.3 Environment Variable Management

- [x] Create `lib/env.ts` with Zod validation:
  - [x] Define environment schema
  - [x] Add validation function
  - [x] Export validated `env` object
  - [x] Add helpful error messages

- [x] Update `.gitignore`:
  - [x] Change `.env.local` to `.env*` pattern
  - [x] Add `!.env.example` to keep example file

- [x] Ensure `.env.example` has all required variables

- [x] Update API routes to use validated `env`:
  - [x] `app/api/github/push/route.ts`
  - [x] `app/api/github/config/route.ts`

### 1.4 Create API Response Utilities

- [x] Create `lib/api/response.ts`:
  - [x] Define `ApiError` class
  - [x] Create `errorResponse()` function
  - [x] Create `successResponse()` function
  - [x] Define response interfaces

- [x] Create `lib/api/errors.ts`:
  - [x] Define error codes enum
  - [x] Create custom error classes

### 1.5 Constants & Configuration

- [x] Create `constants/config.ts`:
  - [x] LeetCode API constants
  - [x] GitHub API constants
  - [x] Retry configuration
  - [x] Timeout values

- [x] Create `constants/options.ts`:
  - [x] Move category options
  - [x] Move subcategory options
  - [x] Move language options
  - [x] Add difficulty options

---

## 🎯 Phase 2: Type Safety & API Standardization

**Goal**: Improve type safety, standardize API responses, and reduce code duplication

**Estimated Time**: 5-6 hours

### 2.1 GitHub Utilities Refactoring

- [x] Split `lib/github-utils.ts` into modules:
  - [x] Create `lib/github/auth.ts`:
    - [x] Move `validateGitHubToken()`
  - [x] Create `lib/github/file-generator.ts`:
    - [x] Move `generateFilePath()`
    - [x] Move `getFileExtension()`
    - [x] Move `generateReadmeContent()`
    - [x] Move `generatePreviewReadme()`
  - [x] Create `lib/github/api.ts`:
    - [x] Move `pushToGitHub()`
    - [x] Add structured error logging

- [x] Improve type safety in GitHub modules:
  - [x] Add explicit return types
  - [x] Remove `as` type assertions
  - [x] Create type guards where needed

- [x] Create `lib/github/index.ts` barrel export

### 2.2 LeetCode Utilities Refactoring

- [x] Refactor `lib/leetcode/parser.ts`:
  - [x] Create reusable `extractSection()` helper
  - [x] Reduce regex duplication
  - [x] Add JSDoc comments

- [x] Create `lib/leetcode/api.ts`:
  - [x] Move API logic from route
  - [x] Add retry with timeout
  - [x] Add rate limiting logic

- [x] Create `lib/leetcode/index.ts` barrel export

### 2.3 Validation Schema Improvements

- [x] Update `lib/validations/schemas.ts`:
  - [x] Add problem number range validation (1-9999)
  - [x] Add whitespace validation for code
  - [x] Add Big O notation regex for complexity
  - [x] Improve error messages

- [x] Create `lib/validations/type-guards.ts`:
  - [x] `isValidLanguage()` type guard
  - [x] `isValidDifficulty()` type guard
  - [x] `isValidCategory()` type guard

### 2.4 Standardize API Routes

- [x] Update `app/api/github/validate/route.ts`:
  - [x] Use `ApiError` class
  - [x] Use `successResponse()` and `errorResponse()`
  - [x] Add proper error codes

- [x] Update `app/api/github/push/route.ts`:
  - [x] Use validated `env`
  - [x] Use standardized responses
  - [x] Add structured logging

- [x] Update `app/api/github/config/route.ts`:
  - [x] Standardize response format

- [x] Update `app/api/leetcode/fetch-problem/route.ts`:
  - [x] Move business logic to service
  - [x] Use standardized responses
  - [x] Add request validation

### 2.5 Create Utility Helpers

- [x] Create `lib/utils/text.ts`:
  - [x] `truncateContent()` with smart truncation
  - [x] `slugify()` function
  - [x] `stripHtml()` (move from parser)

- [x] Create `lib/utils/difficulty.ts`:
  - [x] `getDifficultyBadge()` function
  - [x] `getDifficultyColor()` function

- [x] Create `lib/utils/logger.ts`:
  - [x] Structured logging functions
  - [x] Log levels (error, warn, info, debug)

---

## 🎯 Phase 3: Component Refactoring with shadcn/ui

**Goal**: Break down large components, integrate shadcn/ui, and improve component structure

**Estimated Time**: 6-8 hours

### 3.1 Install shadcn/ui Components

- [ ] Install required shadcn components:
  ```bash
  npx shadcn@latest add button
  npx shadcn@latest add input
  npx shadcn@latest add label
  npx shadcn@latest add select
  npx shadcn@latest add textarea
  npx shadcn@latest add card
  npx shadcn@latest add dialog
  npx shadcn@latest add tabs
  npx shadcn@latest add alert
  npx shadcn@latest add badge
  npx shadcn@latest add separator
  npx shadcn@latest add switch
  npx shadcn@latest add toast
  npx shadcn@latest add skeleton
  ```

### 3.2 Create Custom Hooks

- [ ] Create `hooks/useSolutionForm.ts`:
  - [ ] Move form state management
  - [ ] Move form submission logic
  - [ ] Add proper typing

- [ ] Create `hooks/useProblemFetch.ts`:
  - [ ] Move problem fetching logic
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] Create `hooks/useGitHubPush.ts`:
  - [ ] Move GitHub push logic
  - [ ] Add progress tracking
  - [ ] Add error handling

- [ ] Create `hooks/useDebounce.ts`:
  - [ ] Implement custom debounce hook
  - [ ] Add TypeScript generics
  - [ ] Add cancel functionality

### 3.3 Refactor Solution Form Components

- [ ] Create `components/forms/solution-form/` directory

- [ ] Extract sub-components:
  - [ ] Create `ProblemInput.tsx`:
    - [ ] Problem number input
    - [ ] Fetch button with loading state
    - [ ] Use shadcn Button, Input
  - [ ] Create `LanguageSelector.tsx`:
    - [ ] Language dropdown
    - [ ] Use shadcn Select
  - [ ] Create `CategorySelector.tsx`:
    - [ ] Category and subcategory selects
    - [ ] Use shadcn Select
  - [ ] Create `CodeEditorSection.tsx`:
    - [ ] Monaco editor wrapper
    - [ ] Use shadcn Card
  - [ ] Create `ApproachSection.tsx`:
    - [ ] AI toggle switch
    - [ ] Manual input area
    - [ ] Use shadcn Switch, Textarea
  - [ ] Create `ComplexityInputs.tsx`:
    - [ ] Time complexity input
    - [ ] Space complexity input
    - [ ] Use shadcn Input, Label
  - [ ] Create `FormActions.tsx`:
    - [ ] Reset button
    - [ ] Submit button
    - [ ] Use shadcn Button

- [ ] Update main `components/forms/solution-form/index.tsx`:
  - [ ] Use custom hooks
  - [ ] Compose sub-components
  - [ ] Keep < 200 lines

### 3.4 Refactor Preview Components

- [ ] Move to `components/preview/`:
  - [ ] Update `ProblemPreview.tsx`:
    - [ ] Use shadcn Card, Badge
    - [ ] Add loading skeleton
  - [ ] Update `MarkdownPreview.tsx`:
    - [ ] Use shadcn Card, Tabs
  - [ ] Update `FolderTreePreview.tsx`:
    - [ ] Use shadcn Card

- [ ] Create `components/preview/PreviewPanel.tsx`:
  - [ ] Unified preview container
  - [ ] Tab navigation
  - [ ] Use shadcn Tabs

### 3.5 Refactor Modal Components

- [ ] Move to `components/modals/`:
  - [ ] Update `GitHubSettingsModal.tsx`:
    - [ ] Use shadcn Dialog
    - [ ] Use shadcn Input, Button
    - [ ] Improve validation feedback

- [ ] Update `ValidationChecklist.tsx`:
  - [ ] Move to appropriate location
  - [ ] Use shadcn Alert, Badge

### 3.6 Update Layout Components

- [ ] Move `Header.tsx` to `components/layout/`:
  - [ ] Use shadcn components
  - [ ] Improve styling

- [ ] Update `ThemeToggle.tsx`:
  - [ ] Use shadcn Button
  - [ ] Add smooth transitions

### 3.7 Create Shared Components

- [ ] Create `components/ui/loading-button.tsx`:
  - [ ] Extends shadcn Button
  - [ ] Loading state built-in

- [ ] Create `components/ui/form-field.tsx`:
  - [ ] Reusable form field wrapper
  - [ ] Error display
  - [ ] Label + input combo

---

## 🎯 Phase 4: Performance & Polish

**Goal**: Optimize performance, add polish, and improve user experience

**Estimated Time**: 3-4 hours

### 4.1 Performance Optimizations

- [ ] Add React.memo to components:
  - [ ] `MarkdownPreview`
  - [ ] `CodeEditorSection`
  - [ ] `ProblemPreview`
  - [ ] `FolderTreePreview`

- [ ] Add useMemo for expensive computations:
  - [ ] Preview generation in form
  - [ ] Category options filtering
  - [ ] Markdown rendering

- [ ] Add useCallback for event handlers:
  - [ ] Form submission
  - [ ] Problem fetching
  - [ ] GitHub push

- [ ] Implement debounce for:
  - [ ] Problem number input
  - [ ] Code editor changes (for preview)

### 4.2 Loading States & Skeletons

- [ ] Add loading skeletons:
  - [ ] Problem preview skeleton
  - [ ] Code editor skeleton
  - [ ] Markdown preview skeleton

- [ ] Add loading spinners:
  - [ ] Fetch button
  - [ ] Submit button
  - [ ] GitHub validation

### 4.3 Error Handling UI

- [ ] Add toast notifications:
  - [ ] Success messages
  - [ ] Error messages
  - [ ] Warning messages

- [ ] Add inline error displays:
  - [ ] Form field errors
  - [ ] API error alerts
  - [ ] Validation errors

- [ ] Add error boundaries:
  - [ ] Create `components/error-boundary.tsx`
  - [ ] Wrap main app sections

### 4.4 Accessibility Improvements

- [ ] Add ARIA labels:
  - [ ] All interactive buttons
  - [ ] Form inputs
  - [ ] Modal dialogs

- [ ] Keyboard navigation:
  - [ ] ESC to close modals
  - [ ] Enter to submit forms
  - [ ] Tab order optimization

- [ ] Focus management:
  - [ ] Auto-focus on modal open
  - [ ] Focus trap in dialogs
  - [ ] Return focus on modal close

### 4.5 User Experience Polish

- [ ] Add micro-interactions:
  - [ ] Button hover effects
  - [ ] Card hover effects
  - [ ] Smooth transitions

- [ ] Add visual feedback:
  - [ ] Success checkmarks
  - [ ] Progress indicators
  - [ ] Form validation icons

- [ ] Add helpful hints:
  - [ ] Tooltips for complex fields
  - [ ] Placeholder examples
  - [ ] Helper text

### 4.6 Code Quality Final Pass

- [ ] Run linter and fix all warnings:

  ```bash
  pnpm lint:fix
  ```

- [ ] Format all code:

  ```bash
  pnpm format
  ```

- [ ] Type check:

  ```bash
  pnpm typecheck
  ```

- [ ] Remove unused imports and variables

- [ ] Add JSDoc comments to all public functions

### 4.7 Build & Deploy Verification

- [ ] Test production build:

  ```bash
  pnpm build
  ```

- [ ] Verify no build errors

- [ ] Check bundle size

- [ ] Test all features in production mode

---

## 📝 Notes & Guidelines

### Coding Standards

- All functions must have explicit return types
- Use TypeScript strict mode
- No `any` types without explicit reason
- Prefer `interface` over `type` for object shapes
- Use `const` over `let` when possible
- Keep functions under 50 lines
- Keep components under 200 lines

### Component Guidelines

- One component per file
- Use named exports
- Props interface should be exported
- Use shadcn components when available
- Add prop-types or TypeScript interfaces

### Import Order (enforced by ESLint)

1. React imports
2. Third-party imports
3. Internal imports (components, hooks, utils)
4. Types
5. Styles

### File Naming

- Components: PascalCase (`UserProfile.tsx`)
- Hooks: camelCase with 'use' prefix (`useDebounce.ts`)
- Utils: camelCase (`formatDate.ts`)
- Types: camelCase (`user.types.ts` or in `types/` folder)

---

## ✅ Definition of Done

Each task is considered complete when:

- [ ] Code is written and working
- [ ] Types are properly defined (no `any`)
- [ ] Imports are updated and sorted
- [ ] No ESLint warnings
- [ ] Code is formatted with Prettier
- [ ] TypeScript compiles without errors
- [ ] Feature is manually tested
- [ ] Related files are updated

---

## 🚀 Ready to Start!

**First Phase**: Phase 1 - Project Structure & Foundation

Let's begin with reorganizing the project structure and setting up the foundation!
