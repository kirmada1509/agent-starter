import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { root } from "./project.mjs";

const checks = [
  ["Node.js 22+", Number(process.versions.node.split(".")[0]) >= 22],
  [
    "Dependencies installed",
    existsSync(path.join(root, "node_modules/next/package.json")),
  ],
  ["Local configuration file", existsSync(path.join(root, ".env.local"))],
  ["Git hooks installed", existsSync(path.join(root, ".husky/_/pre-commit"))],
  ["Shared agent rules", existsSync(path.join(root, "AGENTS.md"))],
];
for (const [name, ok] of checks)
  console.log((ok ? "OK  " : "MISS") + " " + name);
const doppler = spawnSync("doppler", ["--version"], { stdio: "ignore" });
console.log(
  doppler.status === 0
    ? "OPTIONAL Doppler CLI available"
    : "OPTIONAL Doppler CLI absent; .env.local works.",
);
console.log("Cloud credentials are intentionally not printed or required.");
if (checks.some(([, ok]) => !ok)) process.exitCode = 1;
