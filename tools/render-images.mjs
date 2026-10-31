#!/usr/bin/env node
/* =========================================================
   GENERATORE DI ICONE E IMMAGINI OPEN GRAPH
   Disegna le immagini da SVG/HTML originali (nessuna risorsa
   di terzi) e le fotografa con Chrome o Edge in modalità
   headless. I PNG risultanti vanno in public/assets/img/ e
   vanno ricommittati quando cambiano titoli o giochi.

   Uso:  node tools/render-images.mjs
   Browser: autodetect, oppure  BROWSER="C:\...\chrome.exe"
   ========================================================= */

import { promises as fs, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { SITE } from "../src/config.mjs";
import { GAMES } from "../src/games/registry.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_ICONS = path.join(ROOT, "public/assets/img/icons");
const OUT_OG = path.join(ROOT, "public/assets/img/og");
const FONTS = pathToFileURL(path.join(ROOT, "public/assets/fonts")).href;
const TMP = await fs.mkdtemp(path.join(os.tmpdir(), "pg-render-"));

const BROWSER = process.env.BROWSER || [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser"
].find((p) => existsSync(p));

if (!BROWSER) {
  console.error("✖ Nessun browser Chrome/Edge trovato: impostare la variabile BROWSER.");
  process.exit(1);
}

const LOGO = (size, id = "g") => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4dd9ff"/><stop offset=".55" stop-color="#b06aff"/><stop offset="1" stop-color="#ff2d55"/></linearGradient></defs>
  <rect x="4" y="4" width="56" height="56" rx="17" fill="url(#${id})"/>
  <g transform="rotate(-12 32 33)"><rect x="17" y="18" width="30" height="30" rx="8.5" fill="#0a0e1a"/><circle cx="25" cy="26" r="3.3" fill="#fff"/><circle cx="32" cy="33" r="3.3" fill="#ffd600"/><circle cx="39" cy="40" r="3.3" fill="#fff"/></g>
  <circle cx="52.5" cy="11.5" r="2.6" fill="#ffd600"/><rect x="8" y="49" width="6" height="2.6" rx="1.3" fill="#fff" transform="rotate(-35 11 50)"/>
</svg>`;

const FONT_CSS = `
@font-face{font-family:Poppins;font-weight:800;src:url("${FONTS}/poppins-latin-800.woff2")}
@font-face{font-family:Poppins;font-weight:900;src:url("${FONTS}/poppins-latin-900.woff2")}
@font-face{font-family:Inter;font-weight:500;src:url("${FONTS}/inter-latin-500.woff2")}
@font-face{font-family:Inter;font-weight:700;src:url("${FONTS}/inter-latin-700.woff2")}`;

function capture(html, width, height, out) {
  const file = path.join(TMP, `${path.basename(out, ".png")}.html`);
  return fs.writeFile(file, html).then(() => {
    execFileSync(BROWSER, [
      "--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run",
      "--force-device-scale-factor=1", "--default-background-color=00000000",
      `--window-size=${width},${height}`, `--screenshot=${out}`, pathToFileURL(file).href
    ], { stdio: "ignore" });
    if (!existsSync(out)) throw new Error(`Screenshot non creato: ${out}`);
  });
}

/* ---------------- Icone ---------------- */
function iconHtml(size, maskable) {
  const inner = maskable ? Math.round(size * 0.72) : size;
  return `<!doctype html><html><head><style>
html,body{margin:0;width:${size}px;height:${size}px;overflow:hidden;background:${maskable ? "#0a0e1a" : "transparent"}}
body{display:grid;place-items:center}</style></head><body>${LOGO(inner)}</body></html>`;
}

/* ---------------- Open Graph 1200×630 ---------------- */
function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }

function ogHtml({ title, subtitle, accent, label }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
html,body{margin:0;width:1200px;height:630px;overflow:hidden}
body{background:#0a0e1a;color:#f2f4ff;font-family:Inter,sans-serif;position:relative}
.blob{position:absolute;border-radius:50%;filter:blur(90px);opacity:.55}
.b1{width:520px;height:520px;background:#ff2d55;top:-200px;left:-160px;opacity:.35}
.b2{width:560px;height:560px;background:${accent};bottom:-260px;right:-140px}
.b3{width:340px;height:340px;background:#4dd9ff;top:120px;left:640px;opacity:.22}
.wrap{position:absolute;inset:0;padding:72px 80px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font-family:Poppins;font-weight:900;font-size:40px}
.brand b{background:linear-gradient(90deg,#4dd9ff,#b06aff 55%,#ff2d55);-webkit-background-clip:text;color:transparent}
.label{margin-top:auto;display:inline-block;align-self:flex-start;font-weight:700;font-size:24px;color:${accent};
  border:2px solid ${accent};border-radius:999px;padding:8px 22px;background:rgba(0,0,0,.25)}
h1{font-family:Poppins;font-weight:900;font-size:${title.length > 34 ? 64 : 78}px;line-height:1.05;margin:22px 0 0;max-width:900px;letter-spacing:-1px}
p{font-size:30px;font-weight:500;color:#c3cae3;margin:20px 0 0;max-width:860px}
.dice{position:absolute;right:90px;top:70px;transform:rotate(14deg)}
.conf{position:absolute;border-radius:6px}
</style></head><body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
<svg class="dice" width="170" height="170" viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="15" fill="none" stroke="${accent}" stroke-width="3"/>
<circle cx="18" cy="18" r="5" fill="${accent}"/><circle cx="46" cy="18" r="5" fill="#fff"/><circle cx="32" cy="32" r="5" fill="#ffd600"/><circle cx="18" cy="46" r="5" fill="#fff"/><circle cx="46" cy="46" r="5" fill="${accent}"/></svg>
<div class="conf" style="width:18px;height:18px;background:#ffd600;right:330px;top:110px;transform:rotate(25deg)"></div>
<div class="conf" style="width:30px;height:10px;background:#4dd9ff;right:120px;top:300px;transform:rotate(-30deg)"></div>
<div class="conf" style="width:14px;height:14px;border-radius:50%;background:#ff2d55;right:280px;top:270px"></div>
<div class="wrap">
  <div class="brand">${LOGO(64)}<span>Party<b>Games</b></span></div>
  <span class="label">${esc(label)}</span>
  <h1>${esc(title)}</h1>
  <p>${esc(subtitle)}</p>
</div></body></html>`;
}

async function main() {
  await fs.mkdir(OUT_ICONS, { recursive: true });
  await fs.mkdir(OUT_OG, { recursive: true });

  const icons = [
    ["icon-32.png", 32, false],
    ["apple-touch-icon.png", 180, true],
    ["icon-192.png", 192, false],
    ["icon-512.png", 512, false],
    ["icon-maskable-512.png", 512, true]
  ];
  for (const [name, size, maskable] of icons) {
    await capture(iconHtml(size, maskable), size, size, path.join(OUT_ICONS, name));
  }
  console.log(`✔ ${icons.length} icone`);

  let count = 0;
  for (const code of SITE.languages) {
    const t = (await import(pathToFileURL(path.join(ROOT, "src/i18n", `${code}.mjs`)).href)).default;
    await capture(ogHtml({
      title: t.home.h1,
      subtitle: t.home.eyebrow,
      accent: "#b06aff",
      label: t.home.stats.map((s) => `${s.value} ${s.label}`).join(" · ")
    }), 1200, 630, path.join(OUT_OG, `home-${code}.png`));
    count++;

    for (const g of GAMES) {
      const m = g.i18n[code];
      await capture(ogHtml({
        title: m.title,
        subtitle: m.tagline,
        accent: g.color,
        label: `${t.ui.players}: ${g.players} · ~${g.minutes} min`
      }), 1200, 630, path.join(OUT_OG, `game-${g.id}-${code}.png`));
      count++;
    }
  }
  console.log(`✔ ${count} immagini Open Graph`);
  await fs.rm(TMP, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});
