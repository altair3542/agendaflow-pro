import React from "react";
import { NavLink, Outlet } from "react-router-dom";

function NavItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `rounded-md border px-3 py-2 text-sm ${isActive ? "bg-neutral-100" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}

export default function AppShell() {
  return (
    <main className="min-h-dvh p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">AgendaFlow Pro</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Sesión 2 (JS): server state avanzado (caching/invalidation/concurrencia).
        </p>

        <nav className="mt-4 flex gap-2" aria-label="Navegación principal">
          <NavItem to="/">Diagnóstico</NavItem>
          <NavItem to="/bookings">Bookings demo</NavItem>
        </nav>
      </header>

      <Outlet />
    </main>
  );
}
