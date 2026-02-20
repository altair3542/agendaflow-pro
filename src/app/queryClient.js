import { QueryClient } from "@tanstack/react-query";
import { isRetriableError, getRetryDelayMs } from "../shared/errors";

/**
 * Baseline de server state (Sesión 2).
 *
 * Principios:
 * - "Server state != UI state": el estado remoto vive en cache con query keys auditables.
 * - Reintentos solo cuando tiene sentido (red/transitorio), NO para 401/403/409/422.
 * - Backoff exponencial con tope.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (!isRetriableError(error)) return false;
        return failureCount < 2; // 2 reintentos + el intento inicial
      },
      retryDelay: (attemptIndex, error) => getRetryDelayMs(attemptIndex, error),
    },
    mutations: {
      retry: false,
    },
  },
});
