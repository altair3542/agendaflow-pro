import { supabase } from "../../../infra/supabase/client";
import { normalizeError } from "../../../shared/errors";

/**
 * Data access (infra-facing) para bookings.
 * IMPORTANTE: en un entorno real, DB enforza tenancy con RLS.
 *
 * Convención:
 * - todas las funciones aceptan orgId explícito (no lo "adivinan").
 * - si se añade idempotencia, se envía request_id (unique en DB en sesiones posteriores).
 */

export async function listBookings({ orgId, dateFrom, dateTo, resourceId, status }) {
  try {
    let q = supabase
      .from("bookings")
      .select("*")
      .eq("org_id", orgId)
      .order("start_at", { ascending: true });

    if (dateFrom) q = q.gte("start_at", dateFrom);
    if (dateTo) q = q.lte("end_at", dateTo);
    if (resourceId) q = q.eq("resource_id", resourceId);
    if (status) q = q.eq("status", status);

    const { data, error } = await q;
    if (error) throw error;
    return data ?? [];
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function createBooking({ orgId, payload, requestId }) {
  try {
    const row = {
      ...payload,
      org_id: orgId,
      request_id: requestId ?? null,
    };

    const { data, error } = await supabase.from("bookings").insert(row).select("*").single();
    if (error) throw error;
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function updateBooking({ orgId, bookingId, patch, requestId }) {
  try {
    const row = {
      ...patch,
      request_id: requestId ?? null,
    };

    const { data, error } = await supabase
      .from("bookings")
      .update(row)
      .eq("org_id", orgId)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}

export async function cancelBooking({ orgId, bookingId, requestId }) {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .update({ status: "cancelled", request_id: requestId ?? null })
      .eq("org_id", orgId)
      .eq("id", bookingId)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    throw normalizeError(err);
  }
}
