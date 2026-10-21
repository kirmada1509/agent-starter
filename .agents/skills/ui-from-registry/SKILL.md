---
name: ui-from-registry
description: Select, install, and wire official shadcn components or blocks for a product screen while preserving this starter's no-custom-UI policy.
---

Read docs/UI.md and the product's UI plan. Reuse installed components first; search the official registry for a whole block/example before composing a screen.

Install through pnpm ui:add <name>. This uses the pinned CLI and records provenance. Do not write a visual primitive, alter vendor styling, introduce custom CSS, or edit hashes to bypass the guard.

Framework pages may compose installed components, pass real data/handlers, and use the permitted semantic layout. Spend reasoning on actions, states, copy, labels, keyboard/focus, and mobile behavior. Keep shipped visual defaults.

Run pnpm ui:check. For a product journey, verify that all displayed actions have real behavior and remove upstream demo affordances that do not belong. If the required interaction is unavailable, identify a suitable open-source source before changing the adoption policy.
