// LEONIDA GETAWAY — gta6-trophy-guide-01 entry (Node 22, standard library only).
// The guide is this directory's app/ folder: plain static files a browser opens at
// app/index.html (ES module, CSS, no build step), offline: it loads nothing over the
// network, and its trophy list and guides are app/data/trophies.json. This program
// hands it in: it copies app/ and screenshots/ from beside this file to /output and
// writes /output/dossier.json, the summary the judge reads, with the vendored
// make.fun library. Leave vendor/makefun-frontend.ts as it is: the scorer requires
// dossier.json to be byte for byte what its own copy writes.
//
// The output directory itself is never removed: in the grader /output is a mount
// point whose parent is read-only, so deleting it fails with EACCES. Instead the
// program creates it if needed and empties only its contents, entry by entry.
//
// Serve it locally with `node serve.ts`, then open http://localhost:8080.
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const BOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Empty a directory's contents without removing the directory itself. The grader
// runs with /output as a mount point whose parent is read-only, so rmSync on the
// directory itself fails with EACCES; removing each entry inside it never touches
// the parent. Nothing in this program ever calls rmSync on OUT_DIR.
function emptyDirContents(dir) {
  for (const entry of readdirSync(dir)) {
    rmSync(join(dir, entry), { recursive: true, force: true });
  }
}

// Create the output directory if it is missing, then empty only its contents.
mkdirSync(OUT_DIR, { recursive: true });
emptyDirContents(OUT_DIR);

cpSync(join(BOT_DIR, 'app'), join(OUT_DIR, 'app'), { recursive: true });
mkdirSync(join(OUT_DIR, 'screenshots'), { recursive: true });
if (existsSync(join(BOT_DIR, 'screenshots'))) {
  cpSync(join(BOT_DIR, 'screenshots'), join(OUT_DIR, 'screenshots'), { recursive: true });
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(OUT_DIR, 'dossier.json'),
  buildDossier(OUT_DIR, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);

const dossierBytes = statSync(join(OUT_DIR, 'dossier.json')).size;
console.log(`Built entry in ${OUT_DIR}`);
console.log(`dossier.json: ${dossierBytes} bytes`);
