import { readFileSync } from "node:fs";
import path from "node:path";
import { root, filesUnder } from "./project.mjs";

const instructions = readFileSync(path.join(root, "AGENTS.md"), "utf8");
const words = instructions.trim().split(/\s+/).length;
const skills = filesUnder(path.join(root, ".agents/skills")).filter((file) =>
  file.endsWith("/SKILL.md"),
);
if (words > 650)
  throw new Error(
    "AGENTS.md exceeds the 650-word budget. Move task-specific detail into a skill.",
  );
for (const file of skills) {
  const source = readFileSync(file, "utf8");
  if (!/^---\nname: [a-z0-9-]+\ndescription: .+\n---\n/m.test(source))
    throw new Error("Invalid skill metadata: " + file);
  if (source.includes("[TODO")) throw new Error("Unfinished skill: " + file);
}
console.log(
  "Always-loaded project policy: " +
    words +
    " words (~" +
    Math.ceil(instructions.length / 4) +
    " tokens, heuristic only).",
);
console.log(
  skills.length +
    " project skills available on demand; their bodies are not preloaded by this repository.",
);
