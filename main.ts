// LEONIDA GETAWAY — entrypoint for the make.fun bounty gta6-trophy-guide-01.
//
// Copies app/ and screenshots/ from this repository into the output
// directory, then writes dossier.json with buildDossier from the kit's
// vendored frontend library. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output. Node 22, standard library only.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const root = new URL('.', import.meta.url).pathname;

if (!existsSync(join(root, 'app')) || !existsSync(join(root, 'screenshots'))) {
  throw new Error('app/ or screenshots/ is missing from the repository root');
}

mkdirSync(outDir, { recursive: true });
rmSync(join(outDir, 'app'), { recursive: true, force: true });
rmSync(join(outDir, 'screenshots'), { recursive: true, force: true });
cpSync(join(root, 'app'), join(outDir, 'app'), { recursive: true });
cpSync(join(root, 'screenshots'), join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648
});
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('wrote ' + join(outDir, 'dossier.json') + ' (' + dossier.length + ' bytes)');
