import "server-only";
import { Axiom } from "@axiomhq/js";
import { AxiomJSTransport, Logger, type Transport } from "@axiomhq/logging";
import { isSpanContextValid, trace } from "@opentelemetry/api";
import { getEnvironment, type parseEnvironment } from "@/lib/env";
import { redact } from "./redact";

type Environment = ReturnType<typeof parseEnvironment>;
type Fields = Record<string, unknown>;
type Level = "debug" | "info" | "warn" | "error";

function exportFailure() {
  process.stderr.write(
    JSON.stringify({
      _time: new Date().toISOString(),
      level: "warn",
      message: "observability.export_failed",
    }) + "\n",
  );
}

export function createLogger(
  environment: Environment,
  customTransports?: [Transport, ...Transport[]],
) {
  const transports: [Transport, ...Transport[]] = customTransports ?? [
    {
      log: (events: unknown[]) => {
        for (const event of events)
          process.stdout.write(JSON.stringify(event) + "\n");
      },
      flush: () => {},
    },
  ];

  if (
    !customTransports &&
    environment.AXIOM_TOKEN &&
    environment.AXIOM_DATASET
  ) {
    transports.push(
      new AxiomJSTransport({
        axiom: new Axiom({
          token: environment.AXIOM_TOKEN,
          edge: environment.AXIOM_EDGE,
          onError: exportFailure,
        }),
        dataset: environment.AXIOM_DATASET,
      }),
    );
  }

  const guardTransport = (transport: Transport): Transport => ({
    log: async (events: unknown[]) => {
      try {
        await transport.log(events);
      } catch {
        exportFailure();
      }
    },
    flush: async () => {
      try {
        await transport.flush();
      } catch {
        exportFailure();
      }
    },
  });
  const [firstTransport, ...otherTransports] = transports;
  const guarded: [Transport, ...Transport[]] = [
    guardTransport(firstTransport),
    ...otherTransports.map(guardTransport),
  ];
  const core = new Logger({
    transports: guarded,
    logLevel: environment.LOG_LEVEL,
  });
  const bind = (context: Fields) => {
    const write = (level: Level, event: string, fields: Fields = {}) => {
      const span = trace.getActiveSpan()?.spanContext();
      const identifiers =
        span && isSpanContextValid(span)
          ? { traceId: span.traceId, spanId: span.spanId }
          : {};
      const safe = redact({
        service: environment.APP_NAME,
        environment: environment.APP_ENV,
        ...context,
        ...fields,
        ...identifiers,
      }) as Fields;
      // Event names are fixed identifiers; user-supplied prose belongs in no log by default.
      core[level](
        /^[a-z][a-z0-9_.-]{1,100}$/.test(event)
          ? event
          : "logging.invalid_event",
        safe,
      );
    };
    return {
      debug: (event: string, fields?: Fields) => write("debug", event, fields),
      info: (event: string, fields?: Fields) => write("info", event, fields),
      warn: (event: string, fields?: Fields) => write("warn", event, fields),
      error: (event: string, fields?: Fields) => write("error", event, fields),
      with: (fields: Fields) => bind({ ...context, ...fields }),
      flush: async () => {
        try {
          await core.flush();
        } catch {
          exportFailure();
        }
      },
    };
  };
  return bind({});
}

export type AppLogger = ReturnType<typeof createLogger>;
let instance: AppLogger | undefined;
export function getLogger(): AppLogger {
  instance ??= createLogger(getEnvironment());
  return instance;
}
