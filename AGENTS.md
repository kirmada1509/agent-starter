# Project rules

Read docs/PRODUCT.md for product scope and docs/WORK.md for the current task. Use pnpm and the committed lockfile. Start a fresh clone with pnpm bootstrap.

## Working defaults

- Deliver the requested behavior and relevant verification. Keep unrelated setup and speculative abstractions out of product tasks.
- Keep routes thin; business behavior belongs in src/features/<feature>, shared infrastructure in src/lib. Validate inputs/configuration. Read docs/ENGINEERING.md for substantial implementation work.
- Use withRoute for API request IDs, safe errors, status/duration logs, and flushing. Use fixed event names and safe structured fields. Read docs/OPERATIONS.md when diagnosing startup or telemetry.
- UI comes from the official registry: pnpm ui:add <name>. Compose installed components and wire data/actions; do not write visual primitives, custom CSS, or edit vendor hashes. Read docs/UI.md for UI work.
- Keep secrets server-side and out of source, prompts, returned data, and logs. Use ignored .env.local or optional Doppler injection. Axiom is the optional browser log viewer.
- Run pnpm check before handing off code. Build when application/runtime behavior changes; exercise the actual changed journey. For documentation-only edits, verify relevant content and formatting.
- Preserve unrelated user changes. Inspect errors before retrying; do not bypass hooks/checks to report success. State material unverified behavior.

## Load guidance only when relevant

Repository skills are in .agents/skills. Select the matching workflow; do not read every skill or document at startup.

| Work                          | Skill            |
| ----------------------------- | ---------------- |
| New product or scope          | product-plan     |
| Product implementation        | ship-feature     |
| Screen/component selection    | ui-from-registry |
| Startup/logging diagnosis     | observe-debug    |
| Review and final verification | verify-change    |

Optional role briefs are in .agents/roles. Roles describe task boundaries; they do not require an agent team. Use one agent for ordinary work and parallel agents only when requested or justified by the human's authorized workflow. Keep instructions and handoffs compact; save only current decisions in docs/WORK.md.

## Code Review Rules

Flag unvalidated boundaries, missing authorization when the feature needs it, duplicate external side effects, leaked credentials/data, broken UI actions, and failures to preserve request correlation. Formatting and import style belong to automated checks.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
