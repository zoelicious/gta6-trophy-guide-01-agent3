// LEONIDA GETAWAY — entrypoint for the make.fun bounty gta6-trophy-guide-01.
//
// Copies app/ and screenshots/ from this repository to the output directory
// (/output, or $MAKEFUN_OUTPUT_DIR outside the grader) and writes
// /output/dossier.json with buildDossier from vendor/makefun-frontend.ts.
// Node 22, standard library only, no build step, no network.
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function handIn() {
  mkdirSync(outDir, { recursive: true });
  for (const name of ["app", "screenshots", "dossier.json"]) {
    rmSync(join(outDir, name), { recursive: true, force: true });
  }
  cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });
  cpSync(join(repoRoot, "screenshots"), join(outDir, "screenshots"), { recursive: true });
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
    app_path_max_bytes: 1000,
  });
  writeFileSync(join(outDir, "dossier.json"), dossier);
  console.log("LEONIDA GETAWAY handed in to " + outDir);
}

handIn();
