import { copyFileSync, existsSync, chmodSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { root, run } from "./project.mjs";

if (Number(process.versions.node.split(".")[0]) < 22)
  throw new Error("Use Node.js 22 or newer.");
let repository;
try {
  repository = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: root,
    stdio: ["ignore", "pipe", "ignore"],
    encoding: "utf8",
  }).trim();
} catch {}
if (repository !== root.replace(/\/$/, "")) run("git", ["init", "-b", "main"]);
const environmentFile = path.join(root, ".env.local");
if (!existsSync(environmentFile)) {
  copyFileSync(path.join(root, ".env.example"), environmentFile);
  chmodSync(environmentFile, 0o600);
}
run("pnpm", ["install", "--frozen-lockfile"]);
run("pnpm", ["exec", "husky"]);
run("pnpm", ["setup:check"]);
console.log("Ready. Complete docs/PRODUCT.md, then run pnpm dev.");
