import { describe, expect, it } from "vitest";
import { z } from "zod";
import { readJson } from "@/lib/http/read-json";

const schema = z.object({ title: z.string().min(1) }).strict();
const request = (body: string, contentType = "application/json") =>
  new Request("http://localhost/api", {
    method: "POST",
    body,
    headers: { "content-type": contentType },
  });

describe("request validation", () => {
  it("returns typed input", async () => {
    await expect(
      readJson(request('{"title":"hello"}'), schema),
    ).resolves.toEqual({ title: "hello" });
  });
  it("rejects unexpected fields and malformed JSON", async () => {
    await expect(
      readJson(request('{"title":"hello","admin":true}'), schema),
    ).rejects.toMatchObject({ status: 400 });
    await expect(readJson(request("{"), schema)).rejects.toMatchObject({
      code: "INVALID_JSON",
    });
  });
  it("enforces the byte limit independently of Content-Length", async () => {
    await expect(
      readJson(request('{"title":"too long"}'), schema, 8),
    ).rejects.toMatchObject({ status: 413 });
  });
  it("rejects unsupported content types", async () => {
    await expect(
      readJson(request("plain", "text/plain"), schema),
    ).rejects.toMatchObject({ status: 415 });
  });
});
