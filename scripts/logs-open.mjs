import { spawn } from "node:child_process";
import nextEnvironment from "@next/env";
const { loadEnvConfig } = nextEnvironment;
import { root } from "./project.mjs";
loadEnvConfig(root, true);
const url = new URL(process.env.LOG_DASHBOARD_URL || "https://app.axiom.co/");
if (url.protocol !== "https:")
  throw new Error("Use an HTTPS log dashboard URL.");
const command = process.platform === "darwin" ? "open" : "xdg-open";
const child = spawn(command, [url.href], { stdio: "ignore" });
child.on("error", () => {
  console.log("Open your configured log dashboard in a browser.");
});
