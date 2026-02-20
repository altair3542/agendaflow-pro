import { useQuery } from "@tanstack/react-query";
import { qk } from "../../../shared/queryKeys";
import { requireActiveOrgId } from "../../../shared/tenant/activeOrg";
import { listBookings } from "../api/bookingsApi";

/**
 * Hook de lectura (server state).
 * - orgId se deriva del tenant activo (placeholder Sesión 1).
 * - filters deben ser serializables y estables (queryKeys los normaliza).
 */
export function useBookingsQuery(filters) {
  const orgId = requireActiveOrgId();

  return useQuery({
    queryKey: qk.bookingsList(orgId, filters),
    queryFn: () => listBookings({ orgId, ...filters }),
    // caching: per-view se ajusta luego; baseline aquí:
    staleTime: 15_000,
  });
}
