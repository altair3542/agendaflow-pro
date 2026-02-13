/**
 * Dominio (JS puro). Regla: domain NO importa infra/app/features.
 */

export function assertBookingTimeWindow({ startAt, endAt }) {
  const s = new Date(startAt).getTime();
  const e = new Date(endAt).getTime();
  if (!Number.isFinite(s) || !Number.isFinite(e)) throw new Error("Fechas inválidas.");
  if (s >= e) throw new Error("startAt debe ser menor que endAt.");
  if (e - s < 5 * 60 * 1000) throw new Error("Duración mínima 5 minutos.");
}

export function canCancelBooking(status) {
  return status === "confirmed" || status === "pending";
}
