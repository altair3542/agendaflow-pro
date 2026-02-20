/**
 * Query keys (Sesión 2)
 *
 * Regla no negociable:
 *   La key SIEMPRE empieza con: ["org", orgId, ...]
 *
 * Esto evita contaminación de cache cross-tenant.
 */

function stableObject(obj) {
  if (obj == null || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(stableObject);

  const keys = Object.keys(obj).sort();
  const out = {};
  for (const k of keys) out[k] = stableObject(obj[k]);
  return out;
}

export function orgScope(orgId) {
  if (!orgId) throw new Error("orgId requerido para query keys (tenant-first).");
  return ["org", orgId];
}

export const qk = {
  bookingsList: (orgId, filters = {}) => [...orgScope(orgId), "bookings", "list", stableObject(filters)],
  bookingById: (orgId, bookingId) => [...orgScope(orgId), "bookings", "byId", bookingId],
  resourcesList: (orgId, filters = {}) => [...orgScope(orgId), "resources", "list", stableObject(filters)],
  orgProfile: (orgId) => [...orgScope(orgId), "org", "profile"],
};
