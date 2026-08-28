// Serveur statique de prévisualisation/test (dist/client).
// `astro preview` n'est pas supporté par l'adaptateur @astrojs/vercel,
// donc on sert le build statique nous-mêmes. La redirection '/' → langue
// reproduit src/middleware.ts ; les routes on-demand (/api) arriveront
// avec l'incrément 5 (tests ciblés sur Vercel en CI).
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = normalize(join(process.cwd(), 'dist', 'client'));
const port = Number(process.env.PORT ?? 4321);

/** @type {Record<string, string>} */
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  // '/' → langue détectée (cookie mémorisé, puis Accept-Language, défaut fr).
  if (pathname === '/') {
    const cookie = req.headers.cookie ?? '';
    const cookieLang = /optima_lang=(fr|pl)/.exec(cookie)?.[1];
    const first = (req.headers['accept-language'] ?? '').split(',')[0]?.trim().toLowerCase() ?? '';
    const locale = cookieLang ?? (first.startsWith('pl') ? 'pl' : 'fr');
    res.writeHead(302, { Location: `/${locale}/` });
    res.end();
    return;
  }

  let filePath = normalize(join(root, pathname));
  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (pathname.endsWith('/')) {
    filePath = join(filePath, 'index.html');
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] ?? 'application/octet-stream' });
    res.end(data);
  } catch {
    // /fr (sans slash) → 302 vers /fr/
    if (pathname !== '/' && !pathname.endsWith('/') && extname(pathname) === '') {
      res.writeHead(302, { Location: `${pathname}/${url.search}` });
      res.end();
      return;
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
  }
});

server.listen(port, () => {
  console.log(`[static-server] http://localhost:${port} (root: ${root})`);
});
