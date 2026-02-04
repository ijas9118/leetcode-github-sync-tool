import { z } from "zod";

const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, "GITHUB_TOKEN is required"),
  GITHUB_OWNER: z.string().min(1, "GITHUB_OWNER is required"),
  GITHUB_REPO: z.string().min(1, "GITHUB_REPO is required"),
  GITHUB_BRANCH: z.string().default("main"),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = envSchema.parse(process.env);
