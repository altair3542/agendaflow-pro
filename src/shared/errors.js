/**
 * Normalización de errores (cliente).
 *
 * Objetivo:
 * - Tener criterios consistentes para UX (matriz error->UX)
 * - Poder decidir retry/backoff de forma determinista
 * - Evitar loggear datos sensibles sin querer
 */

export class AppError extends Error {
  constructor({ message, status, code, cause, meta } = {}) {
    super(message || "Error");
    this.name = "AppError";
    this.status = status ?? null;
    this.code = code ?? null;
    this.cause = cause ?? null;
    this.meta = meta ?? null;
  }
}

/**
 * Intenta mapear un error de Supabase o un Error genérico a AppError.
 * Supabase suele exponer: { message, details, hint, code } y a veces `status`.
 */
export function normalizeError(err) {
  if (!err) return new AppError({ message: "Error desconocido" });
  if (err instanceof AppError) return err;

  // Supabase errors: err puede ser objeto con message/code/status
  const message = err.message || "Error";
  const status = err.status ?? err.statusCode ?? null;
  const code = err.code ?? null;

  return new AppError({ message, status, code, cause: err });
}

export function getStatus(err) {
  const e = normalizeError(err);
  return e.status ?? null;
}

export function isAuthError(err) {
  const s = getStatus(err);
  return s === 401;
}

export function isForbiddenError(err) {
  const s = getStatus(err);
  return s === 403;
}

export function isConflictError(err) {
  const s = getStatus(err);
  return s === 409;
}

export function isValidationError(err) {
  const s = getStatus(err);
  return s === 422;
}

export function isRateLimitError(err) {
  const s = getStatus(err);
  return s === 429;
}

export function isRetriableError(err) {
  const e = normalizeError(err);
  const s = e.status;

  // No retry en errores "decisivos"
  if (s === 401 || s === 403 || s === 409 || s === 422) return false;

  // Sí retry en rate limit (con backoff) o en ausencia de status (red/unknown)
  if (s === 429) return true;
  if (s == null) return true;

  // 5xx suele ser transitorio
  if (s >= 500 && s <= 599) return true;

  return false;
}

/**
 * Backoff exponencial con jitter básico y tope.
 * attemptIndex: 0 para el primer retry, 1 para el segundo, etc.
 */
export function getRetryDelayMs(attemptIndex, err) {
  const e = normalizeError(err);
  const base = e.status === 429 ? 1200 : 500;
  const max = 8_000;
  const exp = Math.min(max, base * Math.pow(2, attemptIndex));
  const jitter = Math.floor(Math.random() * 200);
  return Math.min(max, exp + jitter);
}
