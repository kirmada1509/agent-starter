---
name: ship-feature
description: Implement a scoped product behavior in this starter using its existing boundaries, configuration, logging, and verification commands.
---

Read the relevant product brief and current task. Consult docs/ENGINEERING.md for a substantial implementation, or the relevant section for a narrow change.

Keep transport code in framework routes, business behavior in src/features/<feature>, and shared infrastructure in src/lib. Use withRoute for API correlation/errors and readJson plus a concrete schema for JSON input. Extend validated environment configuration for new secrets.

Use the request-scoped logger with fixed event names and safe fields. Await side effects and set provider timeouts. UI work follows the ui-from-registry skill.

Test behavior and consequential failures. Run the relevant tests during development and pnpm check before handoff; build when runtime/application configuration changes. Record verified state and the next action in docs/WORK.md when work spans sessions.
