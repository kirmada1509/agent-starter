import { Axiom } from "@axiomhq/js";
import { AxiomJSTransport, type Transport } from "@axiomhq/logging";
import { afterEach, describe, expect, it, vi } from "vitest";
import { parseEnvironment } from "@/lib/env";
import { createLogger } from "@/lib/observability/logger";

afterEach(() => vi.unstubAllGlobals());

describe("log delivery", () => {
  it("redacts before either transport and preserves bound request context", async () => {
    const events: unknown[] = [];
    const transport: Transport = {
      log: (batch: unknown[]) => {
        events.push(...batch);
      },
      flush: vi.fn(),
    };
    const root = createLogger(parseEnvironment({}), [transport]);
    const log = root.with({ requestId: "r-123" });
    log.info("test.completed", {
      password: "never-send",
      nested: { token: "hidden" },
      status: 200,
    });
    await log.flush();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      message: "test.completed",
      fields: { requestId: "r-123", status: 200 },
    });
    expect(JSON.stringify(events)).not.toContain("never-send");
    expect(JSON.stringify(events)).not.toContain("hidden");
  });
  it("sends redacted records through the real Axiom SDK to a mocked ingest endpoint", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            ingested: 1,
            failed: 0,
            processedBytes: 100,
            blocksCreated: 1,
            walLength: 0,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const transport = new AxiomJSTransport({
      axiom: new Axiom({
        token: "test-ingest-token",
        edgeUrl: "http://localhost:9999",
      }),
      dataset: "test-logs",
    });
    const log = createLogger(parseEnvironment({}), [transport]);
    log.info("test.cloud", { apiKey: "never-upload", status: 200 });
    await log.flush();
    expect(fetchMock).toHaveBeenCalled();
    const call = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(String(call[0])).toContain("/v1/ingest/test-logs");
    let body = call[1].body;
    if (new Headers(call[1].headers).get("content-encoding") === "gzip") {
      const { gunzipSync } = await import("node:zlib");
      body = gunzipSync(Buffer.from(body as Uint8Array)).toString();
    }
    const serialized =
      typeof body === "string"
        ? body
        : Buffer.from(body as Uint8Array).toString();
    expect(serialized).toContain("test.cloud");
    expect(serialized).toContain("[REDACTED]");
    expect(serialized).not.toContain("never-upload");
  });
  it("keeps the app alive when a transport cannot flush", async () => {
    const warning = vi.spyOn(process.stderr, "write").mockReturnValue(true);
    const log = createLogger(parseEnvironment({}), [
      {
        log: () => {},
        flush: async () => {
          throw new Error("provider secret detail");
        },
      },
    ]);
    await expect(log.flush()).resolves.toBeUndefined();
    expect(String(warning.mock.calls[0]?.[0])).toContain(
      "observability.export_failed",
    );
    expect(String(warning.mock.calls[0]?.[0])).not.toContain(
      "provider secret detail",
    );
  });
});
