import { describe, expect, it } from "vitest";
import { redact } from "@/lib/observability/redact";

describe("operational log redaction", () => {
  it("redacts nested credentials and personal fields but keeps useful context", () => {
    const fields = {
      requestId: "r1",
      status: 200,
      nested: [{ apiKey: "private", email: "a@example.test", count: 2 }],
    };
    const output = JSON.stringify(redact(fields));
    expect(output).not.toContain("private");
    expect(output).not.toContain("a@example.test");
    expect(output).toContain("r1");
    expect(output).toContain('"count":2');
    expect(fields.nested[0]?.apiKey).toBe("private");
  });
  it("does not leak arbitrary error messages or stacks", () => {
    expect(
      JSON.stringify(redact(new Error("password in message"))),
    ).not.toContain("password in message");
  });
  it("bounds cyclic input instead of throwing", () => {
    const cyclic: Record<string, unknown> = {};
    cyclic.self = cyclic;
    expect(redact(cyclic)).toEqual({ self: "[CIRCULAR]" });
  });
});
