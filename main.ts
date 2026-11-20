// LEONIDA GETAWAY — entry program.
// Copies app/ and screenshots/ to the output directory and writes
// dossier.json with the kit's buildDossier. Node 22 standard library only.

import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { buildDossier } from './vendor/makefun-frontend.ts';

const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(out, { recursive: true });
// Clear stale output first, so a second run can never carry files from an
// earlier build and both runs write the same bytes.
rmSync(out + '/app', { recursive: true, force: true });
rmSync(out + '/screenshots', { recursive: true, force: true });
rmSync(out + '/dossier.json', { force: true });
cpSync('app', out + '/app', { recursive: true });
cpSync('screenshots', out + '/screenshots', { recursive: true });
writeFileSync(
  out + '/dossier.json',
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  }),
);
console.log('wrote ' + out + '/dossier.json');
