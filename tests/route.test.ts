import { afterEach, describe, expect, it, vi } from "vitest";
const callbacks = vi.hoisted(() => [] as Array<() => Promise<void>>);
vi.mock("next/server", () => ({
  after: (callback: () => Promise<void>) => callbacks.push(callback),
}));
vi.mock("next/navigation", () => ({ unstable_rethrow: () => {} }));

import { withRoute } from "@/lib/http/route";
import { AppError } from "@/lib/http/errors";

afterEach(async () => {
  await Promise.all(callbacks.splice(0).map((callback) => callback()));
});

describe("API request boundary", () => {
  it("returns a new request ID and preserves successful responses", async () => {
    const handler = withRoute("test.ok", () => Response.json({ ok: true }));
    const first = await handler(new Request("http://localhost/?token=secret"));
    const second = await handler(new Request("http://localhost"));
    expect(first.status).toBe(200);
    expect(first.headers.get("x-request-id")).toMatch(/^[a-f0-9-]{36}$/);
    expect(first.headers.get("x-request-id")).not.toBe(
      second.headers.get("x-request-id"),
    );
    expect(first.headers.get("cache-control")).toBe("no-store");
  });
  it("returns safe known errors with the same correlation ID as the header", async () => {
    const handler = withRoute("test.invalid", () => {
      throw new AppError("INVALID_STATE", "Check the selection.", 409);
    });
    const response = await handler(new Request("http://localhost"));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({
      error: {
        code: "INVALID_STATE",
        message: "Check the selection.",
        requestId: response.headers.get("x-request-id"),
      },
    });
  });
  it("hides unexpected exception details", async () => {
    const handler = withRoute("test.error", () => {
      throw new Error("private database password");
    });
    const response = await handler(new Request("http://localhost"));
    expect(response.status).toBe(500);
    expect(await response.text()).not.toContain("private database password");
  });
});
