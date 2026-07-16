import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/circle/")({
  beforeLoad: () => {
    throw redirect({ to: "/circle/activities" });
  },
});
