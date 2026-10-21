import { getEnvironment } from "@/lib/env";
import { withRoute } from "@/lib/http/route";

// Add time-bounded critical dependency probes when the product gains those dependencies.
export const GET = withRoute("health.ready", () => {
  getEnvironment();
  return Response.json({ status: "ready", checks: { configuration: "ok" } });
});
