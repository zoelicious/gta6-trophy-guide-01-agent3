// Dev server for LEONIDA GETAWAY: serves app/ at http://localhost:8080.
// Static files only, standard library. Run: node serve.ts
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const root = join(new URL('.', import.meta.url).pathname, 'app');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const filePath = join(root, urlPath === '/' ? 'index.html' : urlPath);
  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('not found: ' + urlPath);
    return;
  }
  res.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
});

server.listen(8080, () => {
  console.log('LEONIDA GETAWAY at http://localhost:8080');
});
