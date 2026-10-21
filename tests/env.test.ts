import { describe, expect, it } from "vitest";
import { parseEnvironment } from "@/lib/env";

describe("environment configuration", () => {
  it("boots without cloud credentials and follows production mode", () => {
    expect(parseEnvironment({ NODE_ENV: "production" }).APP_ENV).toBe(
      "production",
    );
  });
  it("rejects partial cloud configuration without revealing the supplied token", () => {
    const secret = "private-test-value";
    try {
      parseEnvironment({ AXIOM_TOKEN: secret });
      throw new Error("Expected validation failure");
    } catch (error) {
      expect(String(error)).toContain("AXIOM_TOKEN");
      expect(String(error)).not.toContain(secret);
    }
  });
  it("rejects invalid collector endpoints", () => {
    expect(() =>
      parseEnvironment({ OTEL_EXPORTER_OTLP_ENDPOINT: "invalid" }),
    ).toThrow();
  });
});
