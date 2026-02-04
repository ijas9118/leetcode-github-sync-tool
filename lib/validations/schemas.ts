import { z } from "zod";

import { categoryOptions, languageOptions } from "@/constants/options";

export const solutionFormSchema = z.object({
  problemNumber: z
    .string()
    .min(1, "Problem number is required")
    .regex(/^\d+$/, "Must be a valid number")
    .refine((val) => {
      const num = parseInt(val, 10);
      return num >= 1 && num <= 9999;
    }, "Problem number must be between 1 and 9999"),

  language: z
    .string()
    .min(1, "Please select a language")
    .refine(
      (val) => languageOptions.some((opt) => opt.value === val),
      "Please select a valid language"
    ),

  solutionCode: z
    .string()
    .min(10, "Solution code must be at least 10 characters")
    .refine((val) => val.trim().length > 0, "Solution code cannot be empty"),

  category: z
    .string()
    .min(1, "Please select a category")
    .refine(
      (val) => categoryOptions.some((opt) => opt.value === val),
      "Please select a valid category"
    ),

  subcategory: z.string().min(1, "Subcategory is required"),

  difficulty: z.enum(["Easy", "Medium", "Hard"]),

  useAI: z.boolean().default(true),

  manualApproach: z.string().optional(),

  timeComplexity: z
    .string()
    .min(1, "Time complexity is required")
    .regex(/^O\(.+\)$/, "Must be in Big O notation, e.g., O(n)"),

  spaceComplexity: z
    .string()
    .min(1, "Space complexity is required")
    .regex(/^O\(.+\)$/, "Must be in Big O notation, e.g., O(1)"),
});

export type SolutionFormValues = z.infer<typeof solutionFormSchema>;

// Subcategory options based on category
export {
  categoryOptions,
  languageOptions,
  subcategoryOptions,
} from "@/constants/options";
