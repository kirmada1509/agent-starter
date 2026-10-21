---
name: verify-change
description: Review and verify a completed starter or product change, focusing on observable correctness, standard UI, and operational evidence.
---

Read the task and changed files. Review the actual behavior and failure paths: input validation, authorization where required, duplicate side effects, configuration handling, request correlation, and UI action wiring.

Use pnpm check for code changes and pnpm build for application/runtime changes. Exercise the actual changed journey. The initial infrastructure journey also supports pnpm smoke against a running server.

Treat vendor hashes and secret-pattern checks as useful gates, not a complete security proof. Do not write tests that simply repeat the implementation. Report actionable findings with exact locations, or state which checks passed and what remains unverified.

For documentation-only changes, verify the relevant links/commands and formatting without rebuilding an unchanged application.
