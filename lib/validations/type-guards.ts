import {
  categoryOptions,
  difficultyOptions,
  languageOptions,
} from "@/constants/options";
import { SupportedLanguage } from "@/types/api";

type CategoryValue = (typeof categoryOptions)[number]["value"];
type DifficultyValue = (typeof difficultyOptions)[number]["value"];

/**
 * Type guard for supported languages
 */
export function isValidLanguage(value: string): value is SupportedLanguage {
  return languageOptions.some((option) => option.value === value);
}

/**
 * Type guard for difficulty levels
 */
export function isValidDifficulty(value: string): value is DifficultyValue {
  return difficultyOptions.some((option) => option.value === value);
}

/**
 * Type guard for data structure categories
 */
export function isValidCategory(value: string): value is CategoryValue {
  return categoryOptions.some((option) => option.value === value);
}

/**
 * Check if a string is a valid problem number (1-9999)
 */
export function isValidProblemNumber(value: string): boolean {
  if (!/^\d+$/.test(value)) return false;
  const num = parseInt(value, 10);
  return num >= 1 && num <= 9999;
}
