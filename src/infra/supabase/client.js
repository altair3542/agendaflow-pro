import { createClient } from "@supabase/supabase-js";
import { env } from "../../shared/env";

/**
 * Cliente Supabase para operaciones user-facing.
 * IMPORTANTE: reglas críticas deben vivir en DB (RLS/constraints).
 * La anon key es publishable; NO es un secreto.
 */
export const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
