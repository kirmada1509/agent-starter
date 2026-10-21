import { randomUUID } from "node:crypto";
import { AxiomWithoutBatching } from "@axiomhq/js";
import nextEnvironment from "@next/env";
const { loadEnvConfig } = nextEnvironment;
import { root } from "./project.mjs";

loadEnvConfig(root, true);
if (!process.env.AXIOM_TOKEN || !process.env.AXIOM_DATASET)
  throw new Error(
    "Set AXIOM_TOKEN and AXIOM_DATASET first, locally or through Doppler.",
  );
let failed = false;
const client = new AxiomWithoutBatching({
  token: process.env.AXIOM_TOKEN,
  edge: process.env.AXIOM_EDGE || "us-east-1.aws.edge.axiom.co",
  onError: () => {
    failed = true;
  },
});
const marker = randomUUID();
const result = await client.ingest(process.env.AXIOM_DATASET, [
  {
    _time: new Date().toISOString(),
    level: "info",
    message: "starter.cloud_smoke",
    fields: { marker, service: process.env.APP_NAME || "agent-starter" },
  },
]);
if (failed || !result || result.ingested < 1 || result.failed > 0)
  throw new Error(
    "Cloud ingestion failed. Check dataset, token permissions, and region. No credentials were printed.",
  );
console.log(
  "Ingestion accepted. Find marker " + marker + " in your Axiom dataset.",
);
