import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "./shells/AppShell";
import DiagnosticsPage from "../features/diagnostics/DiagnosticsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [{ index: true, element: <DiagnosticsPage /> }],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
