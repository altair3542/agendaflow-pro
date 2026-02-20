import { useMutation, useQueryClient } from "@tanstack/react-query";
import { qk } from "../../../shared/queryKeys";
import { requireActiveOrgId } from "../../../shared/tenant/activeOrg";
import { createBooking, updateBooking, cancelBooking } from "../api/bookingsApi";

/**
 * Mutaciones críticas (Sesión 2)
 * - Idempotencia: requestId por mutación (client-generated).
 * - Rollback conceptual: optimistic update + snapshot.
 * - Invalidación selectiva: solo el scope necesario.
 */

function makeRequestId() {
  // disponible en navegadores modernos; fallback simple:
  return (globalThis.crypto?.randomUUID?.() ?? `req_${Date.now()}_${Math.random().toString(16).slice(2)}`);
}

export function useCreateBookingMutation() {
  const qc = useQueryClient();
  const orgId = requireActiveOrgId();

  return useMutation({
    mutationFn: async ({ payload }) => {
      const requestId = makeRequestId();
      return createBooking({ orgId, payload, requestId });
    },
    onMutate: async ({ payload }) => {
      // 1) cancelar queries relacionadas para evitar interleaving
      await qc.cancelQueries({ queryKey: ["org", orgId, "bookings"] });

      // 2) snapshot previo (para rollback)
      const key = qk.bookingsList(orgId, { dateFrom: payload.start_at, dateTo: payload.end_at });
      const previous = qc.getQueryData(key);

      // 3) optimistic insert (temp id)
      const temp = { ...payload, id: `temp_${makeRequestId()}`, org_id: orgId, _optimistic: true };
      qc.setQueryData(key, (old = []) => [temp, ...old]);

      return { key, previous, tempId: temp.id };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      // rollback
      qc.setQueryData(ctx.key, ctx.previous);
    },
    onSuccess: (saved, _vars, ctx) => {
      if (!ctx) return;
      // reconciliar temp -> real
      qc.setQueryData(ctx.key, (old = []) =>
        old.map((b) => (b.id === ctx.tempId ? saved : b)),
      );
    },
    onSettled: (_data, _err, _vars) => {
      // invalidación selectiva (en sesiones posteriores, más fina por vista)
      qc.invalidateQueries({ queryKey: ["org", orgId, "bookings"] });
    },
  });
}

export function useUpdateBookingMutation() {
  const qc = useQueryClient();
  const orgId = requireActiveOrgId();

  return useMutation({
    mutationFn: async ({ bookingId, patch }) => {
      const requestId = makeRequestId();
      return updateBooking({ orgId, bookingId, patch, requestId });
    },
    onMutate: async ({ bookingId, patch }) => {
      await qc.cancelQueries({ queryKey: ["org", orgId, "bookings"] });

      const byIdKey = qk.bookingById(orgId, bookingId);
      const prevById = qc.getQueryData(byIdKey);

      qc.setQueryData(byIdKey, (old) => ({ ...(old ?? {}), ...patch, _optimistic: true }));

      return { byIdKey, prevById };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      qc.setQueryData(ctx.byIdKey, ctx.prevById);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["org", orgId, "bookings"] });
    },
  });
}

export function useCancelBookingMutation() {
  const qc = useQueryClient();
  const orgId = requireActiveOrgId();

  return useMutation({
    mutationFn: async ({ bookingId }) => {
      const requestId = makeRequestId();
      return cancelBooking({ orgId, bookingId, requestId });
    },
    onMutate: async ({ bookingId }) => {
      await qc.cancelQueries({ queryKey: ["org", orgId, "bookings"] });

      const byIdKey = qk.bookingById(orgId, bookingId);
      const prev = qc.getQueryData(byIdKey);

      qc.setQueryData(byIdKey, (old) => ({ ...(old ?? {}), status: "cancelled", _optimistic: true }));

      return { byIdKey, prev };
    },
    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      qc.setQueryData(ctx.byIdKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["org", orgId, "bookings"] });
    },
  });
}
