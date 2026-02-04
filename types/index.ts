export * from "./api";
export * from "./forms";

// Backward compatibility alias if needed, or we can just rely on the new names.
// For now, let's keep 'Language' as an alias to 'SupportedLanguage' to reduce refactor noise if we want.
import { SupportedLanguage } from "./api";
export type Language = SupportedLanguage;

import { SolutionFormData } from "./forms";
export type FormData = SolutionFormData;
