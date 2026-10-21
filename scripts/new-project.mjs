import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { root } from "./project.mjs";

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]{0,62}$/.test(name))
  throw new Error("Usage: pnpm new my-product [destination-parent]");
const parent = path.resolve(process.argv[3] || path.join(root, ".."));
const destination = path.join(parent, name);
if (existsSync(destination))
  throw new Error("Destination already exists; nothing was overwritten.");
// Export committed template files only. No .git, secrets, dependencies, or running-process state.
let archive;
try {
  archive = execFileSync("git", ["archive", "--format=tar", "HEAD"], {
    cwd: root,
    maxBuffer: 64 * 1024 * 1024,
  });
} catch {
  throw new Error(
    "Commit the starter before creating projects; only committed files are exported.",
  );
}
mkdirSync(destination, { recursive: true });
execFileSync("tar", ["-xf", "-", "-C", destination], { input: archive });
const packagePath = path.join(destination, "package.json");
const manifest = JSON.parse(readFileSync(packagePath, "utf8"));
manifest.name = name;
writeFileSync(packagePath, JSON.stringify(manifest, null, 2) + "\n");
const environmentPath = path.join(destination, ".env.example");
writeFileSync(
  environmentPath,
  readFileSync(environmentPath, "utf8")
    .replace(/^APP_NAME=.*$/m, "APP_NAME=" + name)
    .replace(/^OTEL_SERVICE_NAME=.*$/m, "OTEL_SERVICE_NAME=" + name),
);
const productPath = path.join(destination, "docs/PRODUCT.md");
writeFileSync(
  productPath,
  readFileSync(productPath, "utf8").replace(
    "# Product brief",
    "# Product brief: " + name,
  ),
);
execFileSync("git", ["init", "-b", "main"], {
  cwd: destination,
  stdio: "ignore",
});
console.log("Created " + destination);
console.log("Next: cd " + destination + " && pnpm bootstrap");
