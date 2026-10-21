import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readdirSync } from "node:fs";
import path from "node:path";

export const root = fileURLToPath(new URL("../", import.meta.url));
export function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    ...options,
  });
  if (result.error)
    throw new Error(command + " could not run: " + result.error.message);
  if (result.status !== 0)
    throw new Error(command + " exited with status " + result.status);
}
export function filesUnder(directory) {
  try {
    return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory() ? filesUnder(target) : [target];
    });
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}
