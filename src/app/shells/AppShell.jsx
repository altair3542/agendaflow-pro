import React from "react";
import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <main className="min-h-dvh p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">AgendaFlow Pro</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Sesión 1 (JS): baseline + boundaries + docs.
        </p>
      </header>

      <Outlet />
    </main>
  );
}
