import React, { useMemo, useState } from "react";
import { setActiveOrgId, getActiveOrgId } from "../../shared/tenant/activeOrg";

export default function DiagnosticsPage() {
  const [orgInput, setOrgInput] = useState(getActiveOrgId() ?? "");
  const normalized = useMemo(() => orgInput.trim() || null, [orgInput]);

  return (
    <section className="rounded-xl border p-4">
      <h2 className="text-base font-medium">Checklist rápido</h2>

      <ul className="mt-2 list-disc pl-5 text-sm text-neutral-700">
        <li>Tailwind: si ves borde/padding, OK</li>
        <li>TanStack Query: Devtools disponible</li>
        <li>Env: si faltan VITE_SUPABASE_*, debe fallar rápido</li>
        <li>Tenant-first: org_id debe existir antes de queries reales</li>
      </ul>

      <div className="mt-5 grid gap-2">
        <label className="text-sm font-medium" htmlFor="org">
          org_id activo (placeholder)
        </label>
        <input
          id="org"
          className="h-10 rounded-md border px-3 text-sm"
          value={orgInput}
          onChange={(e) => setOrgInput(e.target.value)}
          placeholder="ej: org_demo_123"
        />
        <div className="flex gap-2">
          <button
            className="rounded-md border px-3 py-2 text-sm"
            onClick={() => setActiveOrgId(normalized)}
            type="button"
          >
            Guardar org_id
          </button>
          <span className="self-center text-sm text-neutral-600">
            Actual: <code>{getActiveOrgId() ?? "(none)"}</code>
          </span>
        </div>
      </div>
    </section>
  );
}
