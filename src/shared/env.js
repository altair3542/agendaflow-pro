import { z } from "zod";

/**
 * Validación fail-fast de envs.
 * Vite solo expone variables con prefijo VITE_ a import.meta.env
 */
const EnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
});

export const env = EnvSchema.parse(import.meta.env);
