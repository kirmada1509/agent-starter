# Engineering guidelines

## Boundaries

Keep framework route files thin. Put product behavior in src/features/<feature>/ with its validation, operations, and tests. Use src/lib for small capabilities shared by multiple features, not as a miscellaneous folder.

Parse untrusted input at the boundary with Zod. Use readJson for bounded JSON requests. Keep business operations callable without rendering UI or constructing HTTP requests. Add a repository/service interface when it isolates a real external dependency; do not create layers for hypothetical future products.

Use the installed, version-matched Next.js documentation for framework work. Prefer server components and server-side secrets. A browser interaction or browser-only dependency is a reason to add a client boundary; general habit is not.

## Code

Strict TypeScript and indexed-access checks are enabled. Prefer inferred types where clear and explicit types at public boundaries. Narrow unknown values. Handle absent data intentionally. Keep operations small enough to name and test directly.

Use explicit AppError codes for expected API failures and a safe public message. withRoute supplies request IDs, timing, consistent responses, and log flushing. Unexpected failures return a generic message. Preserve framework redirect/notFound behavior.

Await external side effects, set timeouts, and define retry limits. Add retries only for operations that can be retried safely. Store money in integer minor units and require idempotency for payment or job execution when the product adds them.

Validate configuration through src/lib/env.ts. Mark server-only modules appropriately. Do not expose server credentials through NEXT_PUBLIC variables, props, returned JSON, or logs.

## UI

Follow docs/UI.md. Install standard UI rather than inventing visual primitives. Page composition and business action/data binding are product work; component styling remains registry-owned.

## Evidence

Test observable behavior and important failures: validation, permission boundaries, side effects, state changes, and integration behavior. Use injected dependencies or mock transports for network tests. A function-name assertion or a snapshot of source text is weak evidence.

Run pnpm check before handoff and pnpm build when application/runtime/build behavior changes. Add end-to-end tests around real product journeys when those journeys exist. The starter's HTTP smoke is infrastructure coverage.

## Changes

Keep dependency additions tied to a concrete need. Prefer the smallest maintained package that fits. Lockfile changes belong with the dependency change. Treat vendored UI as upstream code with recorded provenance.

Record a non-obvious architectural choice in the active task or decision notes. Comments explain constraints and reasoning. At handoff, state the behavior changed, verification performed, and any unresolved limitation.
