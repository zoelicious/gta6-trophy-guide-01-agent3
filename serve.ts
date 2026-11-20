// Serves app/ on http://localhost:8080 for local testing. Node 22 only.
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { join, normalize } from 'node:path';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const root = new URL('./app/', import.meta.url).pathname;
const server = createServer(async (req, res) => {
  const path = normalize(join(root, decodeURIComponent(req.url?.split('?')[0] ?? '/')));
  if (!path.startsWith(root)) { res.writeHead(403); res.end(); return; }
  const file = path.endsWith('/') ? join(path, 'index.html') : path;
  try {
    const st = await stat(file);
    if (!st.isFile()) throw new Error('not a file');
    const ext = file.slice(file.lastIndexOf('.'));
    res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('not found');
  }
});
server.listen(8080, () => console.log('LEONIDA GETAWAY at http://localhost:8080'));
