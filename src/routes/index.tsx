import { createFileRoute } from "@tanstack/react-router";
import { SpatialShell } from "@/components/spatial-shell";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return <SpatialShell />;
}
