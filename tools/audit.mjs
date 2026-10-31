#!/usr/bin/env node
/* =========================================================
   AUDIT DI PUBBLICAZIONE
   Controlla src/, public/ e dist/ alla ricerca di:
   1. riferimenti personali o al progetto di origine
   2. domini esterni non ammessi (immagini/audio/script di terzi)
   3. file multimediali non generati dal progetto
   4. riferimenti all'alcol (norme AdSense)
   Uso:  node tools/audit.mjs   → exit code 1 se trova problemi
   ========================================================= */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SITE } from "../src/config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SCAN_DIRS = ["src", "public", "dist", "tools", "README.md"];
const SKIP = new Set(["audit.mjs"]); // questo file contiene le parole cercate

// 1. Termini vietati (parole intere, senza distinzione maiuscole)
const FORBIDDEN = [
  "petta", "petta95", "mari", "marika", "homegames", "home games", "modena", "ghirlandina",
  "sarabanda", "family feud", "l'eredità", "ghigliottina"
];
// 4. Alcol
const ALCOHOL = [
  "beve", "bevi", "bere", "bevuta", "shot", "shottino", "cocktail", "birra", "vino", "alcol", "alcolici",
  "ubriaco", "drink", "drinking", "beer", "wine", "alcohol", "drunk"
];
// 2. Domini ammessi negli URL
const ALLOWED_HOSTS = [
  "www.example.com", "schema.org", "www.w3.org", "www.sitemaps.org",
  "pagead2.googlesyndication.com", "www.googletagmanager.com",
  "policies.google.com", "adssettings.google.com", "business.safety.google",
  "www.youronlinechoices.eu", "www.garanteprivacy.it",
  "support.google.com", "support.mozilla.org", "support.apple.com", "support.microsoft.com",
  "github.com", "scripts.sil.org", // licenze OFL dei font
  "localhost", // server di sviluppo
  new URL(SITE.url).hostname // dominio del sito (SITE_URL in fase di deploy)
];
// 3. Unici file multimediali ammessi (generati da tools/render-images.mjs)
const MEDIA_RE = /\.(png|jpe?g|gif|webp|avif|mp3|wav|ogg|m4a|mp4|webm)$/i;
const MEDIA_OK = /assets[\\/]img[\\/](icons|og)[\\/][\w.-]+\.png$/;

const problems = [];

async function walk(target) {
  const full = path.join(ROOT, target);
  let stat;
  try { stat = await fs.stat(full); } catch { return; }
  if (stat.isFile()) return checkFile(full);
  for (const entry of await fs.readdir(full, { withFileTypes: true })) {
    await walk(path.join(target, entry.name));
  }
}

function wordRegex(words) {
  return new RegExp(`(^|[^\\p{L}])(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?=[^\\p{L}]|$)`, "giu");
}
const FORBIDDEN_RE = wordRegex(FORBIDDEN);
const ALCOHOL_RE = wordRegex(ALCOHOL);

async function checkFile(file) {
  const rel = path.relative(ROOT, file);
  if (SKIP.has(path.basename(file))) return;
  if (MEDIA_RE.test(file)) {
    if (!MEDIA_OK.test(rel)) problems.push(`[media]  ${rel}: file multimediale non generato dal progetto`);
    return;
  }
  if (/\.(woff2|ico)$/i.test(file)) return;
  const text = await fs.readFile(file, "utf8");
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const where = `${rel}:${i + 1}`;
    for (const m of line.matchAll(FORBIDDEN_RE)) problems.push(`[nome]   ${where}: "${m[2]}"`);
    for (const m of line.matchAll(ALCOHOL_RE)) problems.push(`[alcol]  ${where}: "${m[2]}"`);
    for (const m of line.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
      if (!ALLOWED_HOSTS.includes(m[1].toLowerCase())) problems.push(`[url]    ${where}: dominio non ammesso "${m[1]}"`);
    }
  });
}

for (const dir of SCAN_DIRS) await walk(dir);

if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n✖ ${problems.length} problemi trovati`);
  process.exit(1);
}
console.log("✔ Audit superato: nessun riferimento personale, dominio esterno, media di terzi o alcol.");
