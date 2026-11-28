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
import { GUIDES } from "../src/guides/registry.mjs";

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
.brand i{font-style:normal;font-weight:700;color:#aab3d6}
.label{margin-top:auto;display:inline-block;align-self:flex-start;font-weight:700;font-size:24px;color:${accent};
  border:2px solid ${accent};border-radius:999px;padding:8px 22px;background:rgba(0,0,0,.25)}
h1{font-family:Poppins;font-weight:900;font-size:${title.length > 60 ? 54 : title.length > 34 ? 64 : 78}px;line-height:1.05;margin:22px 0 0;max-width:900px;letter-spacing:-1px}
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
  <div class="brand">${LOGO(64)}<span>Party<b>Games</b> <i>Club</i></span></div>
  <span class="label">${esc(label)}</span>
  <h1>${esc(title)}</h1>
  <p>${esc(subtitle)}</p>
</div></body></html>`;
}

/* ---------------- Pin Pinterest 1000×1500 (node tools/render-images.mjs --pins) ----------------
   Immagini verticali per i social, salvate in marketing/pinterest/ (fuori dal sito e da git). */
const OUT_PINS = path.join(ROOT, "marketing/pinterest");

function pinHtml({ title, kicker, accent, icon, cta }) {
  const size = title.length > 70 ? 68 : title.length > 45 ? 78 : 92;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
html,body{margin:0;width:1000px;height:1500px;overflow:hidden}
body{background:#0a0e1a;color:#f2f4ff;font-family:Inter,sans-serif;position:relative}
.blob{position:absolute;border-radius:50%;filter:blur(110px)}
.b1{width:700px;height:700px;background:#ff2d55;top:-260px;left:-240px;opacity:.35}
.b2{width:760px;height:760px;background:${accent};bottom:-300px;right:-260px;opacity:.55}
.b3{width:420px;height:420px;background:#4dd9ff;top:520px;left:520px;opacity:.18}
.wrap{position:absolute;inset:0;padding:90px 80px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font-family:Poppins;font-weight:900;font-size:44px}
.brand b{background:linear-gradient(90deg,#4dd9ff,#b06aff 55%,#ff2d55);-webkit-background-clip:text;color:transparent}
.brand i{font-style:normal;font-weight:700;color:#aab3d6}
.icon{margin-top:110px;font-size:150px;line-height:1;width:230px;height:230px;display:grid;place-items:center;border-radius:56px;
  background:color-mix(in srgb, ${accent} 18%, transparent);border:3px solid color-mix(in srgb, ${accent} 55%, transparent)}
.kicker{margin-top:70px;font-family:Poppins;font-weight:800;font-size:34px;letter-spacing:3px;text-transform:uppercase;color:${accent}}
h1{font-family:Poppins;font-weight:900;font-size:${size}px;line-height:1.08;margin:24px 0 0;letter-spacing:-1px}
.cta{margin-top:auto;display:flex;align-items:center;justify-content:space-between;gap:20px;
  padding:34px 44px;border-radius:36px;background:${accent};color:#0a0e1a;font-family:Poppins;font-weight:800;font-size:40px}
.cta span{font-family:Inter;font-weight:700;font-size:30px;opacity:.85}
</style></head><body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
<div class="wrap">
  <div class="brand">${LOGO(72)}<span>Party<b>Games</b> <i>Club</i></span></div>
  <div class="icon">${icon}</div>
  <div class="kicker">${esc(kicker)}</div>
  <h1>${esc(title)}</h1>
  <div class="cta">${esc(cta)}<span>partygamesclub.com</span></div>
</div></body></html>`;
}

const PIN_TEXT = {
  en: { guide: "Free guide", game: "Free party game", readCta: "Read the guide →", playCta: "Play free →" },
  it: { guide: "Guida gratuita", game: "Gioco di gruppo gratis", readCta: "Leggi la guida →", playCta: "Gioca gratis →" }
};
// Giochi più adatti a Pinterest (feste, serate, famiglia)
const PIN_GAMES = ["top10", "canzoni-emoji", "most-likely", "coppie", "dilemmi", "skill-test"];

async function renderPins() {
  await fs.mkdir(OUT_PINS, { recursive: true });
  let count = 0;
  for (const code of SITE.languages) {
    const txt = PIN_TEXT[code];
    for (const g of GUIDES) {
      await capture(pinHtml({ title: g.i18n[code].title, kicker: txt.guide, accent: g.color, icon: g.icon, cta: txt.readCta }),
        1000, 1500, path.join(OUT_PINS, `${code}-guide-${g.id}.png`));
      count++;
    }
    for (const id of PIN_GAMES) {
      const g = GAMES.find((x) => x.id === id);
      const m = g.i18n[code];
      await capture(pinHtml({ title: `${m.title}: ${m.tagline}`, kicker: txt.game, accent: g.color, icon: g.icon, cta: txt.playCta }),
        1000, 1500, path.join(OUT_PINS, `${code}-game-${g.id}.png`));
      count++;
    }
  }
  console.log(`✔ ${count} pin in marketing/pinterest/`);
  await fs.rm(TMP, { recursive: true, force: true });
}

/* ---------------- Copertine social (node tools/render-images.mjs --covers) ----------------
   Facebook 1640×624 (contenuto nella fascia centrale, perché su mobile i lati vengono tagliati)
   e banner del profilo Reddit 1920×384. Salvate in marketing/covers/ (fuori da git). */
const OUT_COVERS = path.join(ROOT, "marketing/covers");
const COVER_TEXT = {
  en: { title: "Free party games for your TV", sub: "Quizzes, team challenges and family games · No app, no sign-up" },
  it: { title: "Giochi di gruppo gratis sulla TV", sub: "Quiz, sfide a squadre e giochi per famiglie · Niente app, niente registrazione" }
};
const COVER_GAMES = ["top10", "canzoni-emoji", "most-likely", "dilemmi", "skill-test", "coppie", "fire-down", "ordina"];

function coverHtml({ w, h, title, sub, banner }) {
  const games = COVER_GAMES.map((id) => GAMES.find((x) => x.id === id)).filter(Boolean);
  const tile = (g, size) => `<div class="tile" style="width:${size}px;height:${size}px;font-size:${Math.round(size * 0.55)}px;` +
    `background:color-mix(in srgb, ${g.color} 20%, transparent);border-color:color-mix(in srgb, ${g.color} 60%, transparent)">${g.icon}</div>`;
  const left = games.slice(0, 4), right = games.slice(4);
  const side = (list, pos) => banner
    ? `<div class="side ${pos}">${list.map((g) => tile(g, 96)).join("")}</div>`
    : "";
  const row = banner ? "" : `<div class="row">${games.map((g) => tile(g, 92)).join("")}</div>`;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONT_CSS}
html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}
body{background:#0a0e1a;color:#f2f4ff;font-family:Inter,sans-serif;position:relative}
.blob{position:absolute;border-radius:50%;filter:blur(110px)}
.b1{width:${h * 1.3}px;height:${h * 1.3}px;background:#ff2d55;top:-${h * 0.6}px;left:-${h * 0.3}px;opacity:.38}
.b2{width:${h * 1.4}px;height:${h * 1.4}px;background:#b06aff;bottom:-${h * 0.7}px;right:-${h * 0.2}px;opacity:.5}
.b3{width:${h * 0.9}px;height:${h * 0.9}px;background:#4dd9ff;top:${h * 0.2}px;left:${w * 0.45}px;opacity:.2}
.wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.brand{display:flex;align-items:center;gap:18px;font-family:Poppins;font-weight:900;font-size:${banner ? 44 : 50}px}
.brand b{background:linear-gradient(90deg,#4dd9ff,#b06aff 55%,#ff2d55);-webkit-background-clip:text;color:transparent}
.brand i{font-style:normal;font-weight:700;color:#aab3d6}
h1{font-family:Poppins;font-weight:900;font-size:${banner ? 58 : 72}px;line-height:1.05;margin:${banner ? 14 : 22}px 0 0;letter-spacing:-1px;word-spacing:8px}
p{font-size:${banner ? 24 : 28}px;font-weight:500;color:#c3cae3;margin:${banner ? 12 : 16}px 0 0}
.row{display:flex;gap:18px;margin-top:34px}
.tile{display:grid;place-items:center;border-radius:26px;border:3px solid;line-height:1}
.side{position:absolute;top:50%;transform:translateY(-50%);display:grid;grid-template-columns:repeat(2,96px);gap:18px}
.side.l{left:120px;transform:translateY(-50%) rotate(-6deg)}.side.r{right:120px;transform:translateY(-50%) rotate(6deg)}
.url{display:inline-block;margin-top:${banner ? 16 : 30}px;font-weight:700;font-size:${banner ? 22 : 26}px;color:#0a0e1a;background:#ffd600;border-radius:999px;padding:${banner ? "7px 22px" : "10px 28px"}}
</style></head><body>
<div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
${side(left, "l")}${side(right, "r")}
<div class="wrap">
  <div class="brand">${LOGO(banner ? 60 : 72)}<span>Party<b>Games</b> <i>Club</i></span></div>
  <h1>${esc(title)}</h1>
  <p>${esc(sub)}</p>
  ${row}
  ${banner ? "" : `<span class="url">partygamesclub.com</span>`}
</div></body></html>`;
}

async function renderCovers() {
  await fs.mkdir(OUT_COVERS, { recursive: true });
  for (const code of SITE.languages) {
    const c = COVER_TEXT[code];
    await capture(coverHtml({ w: 1640, h: 624, ...c }), 1640, 624, path.join(OUT_COVERS, `facebook-cover-${code}.png`));
  }
  const en = COVER_TEXT.en;
  await capture(coverHtml({ w: 1920, h: 384, ...en, banner: true }), 1920, 384, path.join(OUT_COVERS, "reddit-banner-en.png"));
  console.log("✔ 3 copertine in marketing/covers/");
  await fs.rm(TMP, { recursive: true, force: true });
}

async function main() {
  if (process.argv.includes("--pins")) return renderPins();
  if (process.argv.includes("--covers")) return renderCovers();
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

    for (const g of GUIDES) {
      await capture(ogHtml({
        title: g.i18n[code].title,
        subtitle: "",
        accent: g.color,
        label: `${g.icon} ${t.pages.guides.breadcrumb}`
      }), 1200, 630, path.join(OUT_OG, `guide-${g.id}-${code}.png`));
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
