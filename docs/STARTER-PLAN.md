# Starter plan and decisions

Prepared October 21, 2026.

## Goal

Clone a repository, write a product brief, and begin product work without repeatedly installing skills or restating engineering and UI preferences.

## Scope

| Area               | Included by default                                                                                                                                 | Verification                                                 |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Application        | Official Next.js App Router scaffold, React, strict TypeScript, pnpm lockfile                                                                       | Type checks and production build                             |
| Agents             | Short AGENTS.md; shared Claude/Cursor/Copilot entry points; repository-local skills; optional role briefs                                           | Instruction budget and skill validation                      |
| Engineering        | Thin routes, feature-owned business logic, validated boundaries, explicit errors, dependency discipline                                             | Lint, types, meaningful tests, review skill                  |
| UI                 | Official shadcn registry components/examples; no authored design system; provenance manifest                                                        | Vendor hashes and structural UI checks                       |
| Observability      | Structured server logs, recursive field redaction, request IDs, API duration/status, request error capture, health/readiness, optional OTLP tracing | Unit tests, HTTP smoke tests, mocked ingest                  |
| Secrets            | Local ignored environment file; optional Doppler injection                                                                                          | Environment validation and doctor command                    |
| Browser log viewer | Optional Axiom ingestion plus documented query/dashboard setup                                                                                      | Credential-free mock test; authenticated cloud smoke command |
| Developer loop     | Bootstrap, foreground dev, managed background start/stop/status/logs, project creation                                                              | Lifecycle and generated-project checks                       |
| Quality gates      | Husky + lint-staged, secret-pattern check, formatting, lint, type checks, tests, build, GitHub CI                                                   | Positive and negative gate checks                            |
| Handoff            | Product brief, active task/handoff template, architecture and operations notes                                                                      | Fresh-clone rehearsal                                        |

## Decisions

1. Assemble a focused starter from the official generators rather than inherit an unrelated product's database, authentication, demo business logic, or agent framework.
2. Use the lockfile-pinned Node.js runtime and TypeScript throughout the application. Add a separate service only when a product requires it.
3. Keep the always-loaded policy below a small word budget. Load one relevant skill and supporting document when needed; do not preload a collection of generic prompts.
4. Agent roles are optional task boundaries, not an always-running team. A normal feature does not require five agents or repeated role setup.
5. Install UI through the shadcn CLI. The initial page reuses an upstream example. Product pages may bind data and actions to installed components; reusable visual primitives and styling must come from the registry.
6. Doppler is a secrets manager. Application logs go to stdout locally and optionally Axiom for browser exploration. No external account, paid resource, or token is needed for local use.
7. Logs omit request bodies, cookies, query strings, tokens, and free-form user input by default. Document that key-based redaction cannot remove a secret embedded in arbitrary text.
8. Tracing is opt-in through standard OTLP settings. No local collector stack is required just to start a product.
9. Run fast staged-file checks on commit and the full verification suite before handoff/CI. Tests should cover behavior and failure paths rather than mirror implementation.
10. Keep account activation explicit. Do not invent credentials or claim browser ingestion is live before an authenticated smoke test passes.

## Alternatives inspected

- [Agentic Next Starter](https://github.com/Next-AI-Labs-Inc/agentic-next-starter): useful agent-oriented Next.js baseline; additional work remains for this repository's UI policy, operations, and observability.
- [Agentic React + shadcn](https://github.com/jasonakatiff/agentic-react-nextjs-shadcn): useful agent testing patterns; includes database/auth choices that should remain product decisions here.
- [Official shadcn CLI](https://ui.shadcn.com/docs/cli): selected as the UI source instead of generating a component system with a model.

## Execution order

1. Generate the framework and install standard UI assets.
2. Add runtime configuration, observability, API boundaries, and health checks.
3. Add deterministic scripts and quality gates.
4. Add concise shared agent rules, skills, roles, and product handoff documents.
5. Run behavioral checks, production build, HTTP/lifecycle smoke tests, and a new-project rehearsal.

## Acceptance criteria

A new project can be created without copying credentials or running processes; boots without cloud credentials; exposes correlated and redacted operational logs; fails useful quality checks; contains registry-sourced UI; and gives the next coding agent one clear entry point and a product brief to complete.
