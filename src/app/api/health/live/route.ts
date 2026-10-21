import { withRoute } from "@/lib/http/route";

export const GET = withRoute("health.live", () =>
  Response.json({ status: "ok" }),
);
