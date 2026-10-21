const sensitiveKey =
  /authorization|cookie|password|passwd|secret|token|api[-_]?key|credential|email|phone|address|prompt|body|query|searchparams/i;

/** Redacts named fields, not secrets embedded inside arbitrary strings. */
export function redact(
  value: unknown,
  seen = new WeakSet<object>(),
  depth = 0,
): unknown {
  if (depth > 8) return "[TRUNCATED]";
  if (typeof value === "bigint") return value.toString();
  if (value instanceof Error) {
    // Error messages and stacks can contain user input, URLs, and credentials.
    return { name: value.name, code: "UNEXPECTED_ERROR" };
  }
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return "[CIRCULAR]";
  seen.add(value);
  if (Array.isArray(value)) {
    return value.slice(0, 50).map((item) => redact(item, seen, depth + 1));
  }
  return Object.fromEntries(
    Object.entries(value)
      .slice(0, 100)
      .map(([key, item]) => [
        key,
        sensitiveKey.test(key) ? "[REDACTED]" : redact(item, seen, depth + 1),
      ]),
  );
}
