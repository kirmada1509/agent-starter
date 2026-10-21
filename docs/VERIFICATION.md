# Starter verification record

Verified October 21, 2026 on macOS, using the pinned Node.js 22.23.2 runtime and pnpm 12.5.1.

## Passed

| Area                    | Evidence                                                                                                                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Full local checks       | pnpm verify passed formatting, lint, type checks, tests, UI guard, secret guard, instruction budget, and production build.                                                                       |
| Behavioral tests        | 20 passing tests across 6 files: configuration, nested redaction, API errors/correlation, bounded JSON validation, SDK delivery, export failure, staged secrets, symlink handling, and UI drift. |
| Registry workflow       | pnpm ui:add progress installed upstream code and updated provenance; the UI guard passed.                                                                                                        |
| Skills                  | All five SKILL.md files passed the skill-creator validator.                                                                                                                                      |
| Context size            | AGENTS.md is 449 words, approximately 815 tokens by a character-based heuristic; detailed skill bodies load on demand.                                                                           |
| Hooks                   | A real local commit ran staged secret checks, lint-staged, UI policy, and type checks successfully.                                                                                              |
| Dependencies            | No peer dependency issues reported.                                                                                                                                                              |
| Development runtime     | Managed start, HTTP smoke, status/log access, and owned-process stop passed.                                                                                                                     |
| Production runtime      | Production start and HTTP smoke passed against the built application.                                                                                                                            |
| Tracing                 | A production server exported nonempty OTLP trace batches to a temporary local collector; structured logs contained active trace IDs.                                                             |
| Process isolation       | Starting on an occupied port failed without terminating the unrelated temporary server.                                                                                                          |
| New project             | The new-project command exported into a fresh Git repository; bootstrap, all checks, development start, HTTP smoke, and stop passed there.                                                       |
| Configuration isolation | The generated package and local environment used the new product name, its logs used that service name, and the shared skill symlink remained valid.                                             |
| Export hygiene          | Committed exports exclude local environment files, process state/logs, dependencies, and Git history.                                                                                            |

Both managed application servers were stopped after verification.

## External activation still required

- **Axiom:** SDK ingestion was tested against a mocked endpoint. No live account token was configured or sent. Activate a real dataset/token and run pnpm observe:smoke, then find the marker in the browser.
- **Doppler:** the CLI/account was not configured. The local environment-file path was verified; follow docs/OPERATIONS.md for optional Doppler activation.
- **GitHub:** CI workflow files are included, but no repository was published and no remote Actions run occurred. The corresponding commands passed locally.
- **Cloud tracing:** local OTLP delivery was verified. A hosted collector and its credentials remain product configuration.

The included page is an upstream UI example, not a finished product. Product-specific UI journeys, authentication, external side effects, and dependency readiness checks need verification as those features are added.
