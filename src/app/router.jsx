import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "./shells/AppShell";
import DiagnosticsPage from "../features/diagnostics/DiagnosticsPage";
import BookingsDemoPage from "../features/bookings/ui/BookingsDemoPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DiagnosticsPage /> },
      { path: "bookings", element: <BookingsDemoPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
