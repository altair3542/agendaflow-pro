import React, { useMemo, useState } from "react";
import { useBookingsQuery } from "../hooks/useBookingsQuery";
import { useCreateBookingMutation } from "../hooks/useBookingMutations";
import { normalizeError, isForbiddenError, isConflictError, isValidationError, isAuthError } from "../../../shared/errors";

/**
 * Demo didáctica (Sesión 2).
 *
 * - Muestra server state (loading/error/data) y cómo el cache reacciona.
 * - No asume que tu DB exista aún: si falla, el objetivo es ver UX consistente.
 */
export default function BookingsDemoPage() {
  const [dateFrom, setDateFrom] = useState(() => new Date().toISOString());
  const [dateTo, setDateTo] = useState(() => new Date(Date.now() + 60 * 60 * 1000).toISOString());

  const filters = useMemo(() => ({ dateFrom, dateTo }), [dateFrom, dateTo]);
  const q = useBookingsQuery(filters);

  const createM = useCreateBookingMutation();

  const err = q.error ? normalizeError(q.error) : null;

  const errorLabel = (() => {
    if (!err) return null;
    if (isAuthError(err)) return "AUTH (401): sesión inválida o expirada";
    if (isForbiddenError(err)) return "RLS / Permisos (403): no autorizado";
    if (isConflictError(err)) return "Conflicto (409): colisión / solape";
    if (isValidationError(err)) return "Validación (422): datos inválidos";
    return `Error (${err.status ?? "?"}): ${err.message}`;
  })();

  return (
    <section className="rounded-xl border p-4">
      <h2 className="text-base font-medium">Bookings (server state demo)</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Ajusta el rango y recarga para observar caching/invalidation.
      </p>

      <div className="mt-4 grid gap-2">
        <label className="text-sm font-medium" htmlFor="df">dateFrom (ISO)</label>
        <input id="df" className="h-10 rounded-md border px-3 text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <label className="text-sm font-medium" htmlFor="dt">dateTo (ISO)</label>
        <input id="dt" className="h-10 rounded-md border px-3 text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="rounded-md border px-3 py-2 text-sm" onClick={() => q.refetch()} type="button">
          Refetch
        </button>

        <button
          className="rounded-md border px-3 py-2 text-sm"
          onClick={() =>
            createM.mutate({
              payload: {
                start_at: dateFrom,
                end_at: dateTo,
                status: "pending",
                resource_id: "resource_demo",
                title: "Demo booking",
              },
            })
          }
          type="button"
        >
          Crear booking (optimistic)
        </button>
      </div>

      <div className="mt-4 rounded-md bg-neutral-50 p-3 text-sm">
        <div><b>status:</b> {q.isFetching ? "fetching" : q.isLoading ? "loading" : "idle"}</div>
        {errorLabel ? <div className="mt-1"><b>error:</b> {errorLabel}</div> : null}
        <div className="mt-1"><b>count:</b> {Array.isArray(q.data) ? q.data.length : 0}</div>
      </div>

      <ul className="mt-4 space-y-2">
        {(q.data ?? []).map((b) => (
          <li key={b.id} className="rounded-md border p-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">{b.title ?? "(sin título)"} {b._optimistic ? "(optimistic)" : ""}</span>
              <span className="text-neutral-600">{b.status}</span>
            </div>
            <div className="mt-1 text-neutral-700">
              {b.start_at} → {b.end_at}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
