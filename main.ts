import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Absolute directory of this file, whatever the caller's working directory is.
// Every filesystem path below is built from BOT_DIR — never from process.cwd().
const BOT_DIR = fileURLToPath(new URL('.', import.meta.url));
const APP_DIR = join(BOT_DIR, 'app');
const SHOTS_DIR = join(BOT_DIR, 'screenshots');
const VENDOR_FILE = join(BOT_DIR, 'vendor', 'makefun-frontend.ts');

// Output: $MAKEFUN_OUTPUT_DIR when set (resolved against BOT_DIR when relative),
// otherwise an "out" directory next to this file. Never the caller's cwd.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR
  ? resolve(BOT_DIR, process.env.MAKEFUN_OUTPUT_DIR)
  : join(BOT_DIR, 'out');

// Safety: never wipe the filesystem root or the repository itself.
if (OUT_DIR === '/' || OUT_DIR === BOT_DIR) {
  throw new Error('Refusing unsafe MAKEFUN_OUTPUT_DIR: ' + OUT_DIR);
}

// Fail fast with a clear message when the entry is incomplete.
if (!existsSync(APP_DIR)) throw new Error('Missing app directory: ' + APP_DIR);
if (!existsSync(SHOTS_DIR)) throw new Error('Missing screenshots directory: ' + SHOTS_DIR);

// Rebuild the output directory from scratch so stale files never survive.
rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

// Copy the entry (app + screenshots) into the output directory.
cpSync(APP_DIR, join(OUT_DIR, 'app'), { recursive: true });
cpSync(SHOTS_DIR, join(OUT_DIR, 'screenshots'), { recursive: true });

// Load the dossier builder from the vendored kit file by absolute file URL.
const { buildDossier } = await import(pathToFileURL(VENDOR_FILE).href);

// Write the dossier exactly as the scorer's copy of buildDossier computes it.
const dossier = buildDossier(OUT_DIR, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
  app_path_max_bytes: 1000,
});
writeFileSync(join(OUT_DIR, 'dossier.json'), dossier);

console.log('Built entry in ' + OUT_DIR);
console.log('dossier.json: ' + dossier.length + ' bytes');
