import { resolve } from "node:path";
import { config } from "dotenv";
import { z } from "zod/v4";

// Load .env from monorepo root
config({ path: resolve(import.meta.dirname, "../../../.env") });

const envSchema = z.object({
  SHOPIFY_SHOP: z
    .string()
    .min(1, "Store handle is required (e.g., 'your-store', not the full domain)"),
  SHOPIFY_CLIENT_ID: z
    .string()
    .min(1, "Client ID is required (from Dev Dashboard > Settings)"),
  SHOPIFY_CLIENT_SECRET: z
    .string()
    .min(1, "Client Secret is required (from Dev Dashboard > Settings)"),
  SHOPIFY_API_VERSION: z
    .string()
    .regex(/^\d{4}-\d{2}$/, "Must be a valid API version (e.g., 2026-01)")
    .default("2026-01"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:");
  console.error(parsed.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`).join("\n"));
  console.error("\nCopy .env.example to .env and fill in your Dev Dashboard credentials.");
  process.exit(1);
}

export const env = parsed.data;
