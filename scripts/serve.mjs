import { spawn } from "node:child_process";
import path from "node:path";
import nextEnvironment from "@next/env";
const { loadEnvConfig } = nextEnvironment;
import { root } from "./project.mjs";

const mode = process.argv[2] || "dev";
loadEnvConfig(root, mode === "dev");
const port = process.argv[3] || process.env.PORT || "3000";
const child = spawn(
  process.execPath,
  [
    path.join(root, "node_modules/next/dist/bin/next"),
    mode,
    "--hostname",
    "127.0.0.1",
    "--port",
    port,
  ],
  { cwd: root, stdio: "inherit", env: process.env },
);
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    child.kill(signal);
  });
}
child.on("error", () => {
  console.error("Server could not start.");
  process.exitCode = 1;
});
child.on("exit", (code) => {
  process.exitCode = code ?? 0;
});
