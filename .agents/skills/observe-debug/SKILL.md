---
name: observe-debug
description: Diagnose local startup, API failures, log delivery, and optional tracing in this starter using its managed scripts and correlation IDs.
---

Start with pnpm dev:status, pnpm dev:logs, and pnpm setup:check as relevant. Read the matching section of docs/OPERATIONS.md rather than loading every operations document.

Use the response's x-request-id to find related request events. Distinguish application failures from observability export failures. Check configuration names and provider status without printing credentials, complete environment files, or payloads.

For cloud delivery, use pnpm observe:smoke only when the user has configured ingestion. It sends one diagnostic event. Inspect the marker in Axiom. Do not create accounts/resources or rotate credentials as an inferred troubleshooting step.

Reproduce the fault and verify the correction. Managed stop scripts operate on this repository's supervisor; never terminate an arbitrary process merely because it uses the desired port.
