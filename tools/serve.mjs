#!/usr/bin/env node
/* Server statico di sviluppo per dist/, con lo stesso comportamento
   di GitHub Pages: /cartella/ → /cartella/index.html, URL inesistenti
   → 404.html con stato 404.
   Uso:  node tools/serve.mjs [porta]   (default 8080) */

import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const PORT = Number(process.argv[2]) || 8080;
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json", ".webmanifest": "application/manifest+json", ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2"
};

async function resolveFile(urlPath) {
  const safe = path.normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  let file = path.join(DIST, safe);
  if (!file.startsWith(DIST)) return null;
  try {
    const stat = await fs.stat(file);
    if (stat.isDirectory()) file = path.join(file, "index.html");
    await fs.access(file);
    return file;
  } catch {
    return null;
  }
}

http.createServer(async (req, res) => {
  const urlPath = new URL(req.url, "http://localhost").pathname;
  // Come GitHub Pages: /cartella senza slash → redirect a /cartella/
  if (!path.extname(urlPath) && !urlPath.endsWith("/")) {
    const dir = await resolveFile(urlPath + "/");
    if (dir) { res.writeHead(301, { Location: urlPath + "/" }); return res.end(); }
  }
  const file = await resolveFile(urlPath);
  const status = file ? 200 : 404;
  const target = file || path.join(DIST, "404.html");
  res.writeHead(status, { "Content-Type": TYPES[path.extname(target)] || "application/octet-stream" });
  res.end(await fs.readFile(target));
  console.log(status, urlPath);
}).listen(PORT, () => console.log(`PartyGames Club su http://localhost:${PORT}`));
