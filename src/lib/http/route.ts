import "server-only";
import { randomUUID } from "node:crypto";
import { after } from "next/server";
import { unstable_rethrow } from "next/navigation";
import { AppError } from "./errors";
import { getLogger, type AppLogger } from "@/lib/observability/logger";

export interface RequestContext {
  requestId: string;
  log: AppLogger;
}

type Handler = (
  request: Request,
  context: RequestContext,
) => Response | Promise<Response>;

/** Wrap API routes so operational logs and public error responses stay consistent. */
export function withRoute(operation: string, handler: Handler) {
  return async (request: Request): Promise<Response> => {
    const requestId = randomUUID();
    const log = getLogger().with({
      operation,
      requestId,
      method: request.method,
    });
    const started = performance.now();
    let response: Response;
    try {
      response = await handler(request, { requestId, log });
    } catch (error) {
      // Preserve Next.js redirect/notFound control flow.
      unstable_rethrow(error);
      const known = error instanceof AppError;
      const status = known ? error.status : 500;
      const code = known ? error.code : "INTERNAL_ERROR";
      log[status >= 500 ? "error" : "warn"]("request.failed", { code, status });
      response = Response.json(
        {
          error: {
            code,
            message: known ? error.publicMessage : "Something went wrong.",
            requestId,
          },
        },
        { status },
      );
    } finally {
      after(async () => {
        await log.flush();
      });
    }
    // Rebuild headers so even immutable fetched responses can carry the correlation ID.
    const headers = new Headers(response.headers);
    headers.set("x-request-id", requestId);
    headers.set("cache-control", "no-store");
    const status = response.status;
    log[status >= 500 ? "error" : status >= 400 ? "warn" : "info"](
      "request.completed",
      {
        status,
        durationMs: Math.round((performance.now() - started) * 100) / 100,
      },
    );
    return new Response(response.body, {
      status,
      statusText: response.statusText,
      headers,
    });
  };
}
