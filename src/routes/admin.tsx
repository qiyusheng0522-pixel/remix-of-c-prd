import { createFileRoute, redirect } from "@tanstack/react-router";
import { AdminLayout } from "@/admin/AdminLayout";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ location }) => {
    if (location.pathname === "/admin") {
      throw redirect({ to: "/admin/login" });
    }
  },
  component: AdminLayout,
});
