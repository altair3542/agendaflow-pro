# AgendaFlow Pro (JS)

Plataforma **multi-tenant** de reservas con **realtime**, **roles** (admin/manager/staff), **detección de conflictos**, **auditoría** y UX "product-grade".

## No negociables
1) Multi-tenant estricto: sin lecturas/escrituras cross-tenant.  
2) DB como árbitro: reglas críticas deben vivir en DB (RLS/constraints).  
3) Server state != UI state: caching/invalidation; UI state mínimo.  
4) A11y product-grade como “Done”.  
5) Realtime robusto: dedupe + reconciliación + estrategia de conflictos.  
6) Calidad verificable: testing plan + observabilidad + CI gates + documentación.

## Setup
```bash
npm create vite@latest agendaflow-pro -- --template react
cd agendaflow-pro
npm install
npm install tailwindcss @tailwindcss/vite
npm install @tanstack/react-query @tanstack/react-query-devtools react-router-dom @supabase/supabase-js zod
npm run dev
```

## Estructura (boundaries)
- `src/domain/`: reglas/invariantes puras (NO importa infra).
- `src/infra/`: adaptadores a proveedores (Supabase).
- `src/features/`: módulos por feature (API pública mínima).
- `src/app/`: composición (router/providers).
- `src/shared/`: primitives (env, tenant, etc.).
