#!/usr/bin/env node
/* =========================================================
   BUILD — genera il sito statico in dist/
   Uso:  node tools/build.mjs
   Nessuna dipendenza esterna (solo Node.js ≥ 18).
   ========================================================= */

import { promises as fs, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import { SITE } from "../src/config.mjs";
import { GAMES, gamePath } from "../src/games/registry.mjs";
import { homePage, contentPage, notFoundPage, gamePage } from "../src/templates/pages.mjs";
import { fill, href, absUrl } from "../src/templates/util.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "src");
const PUBLIC = path.join(ROOT, "public");
const DIST = path.join(ROOT, "dist");

const CONTENT_PAGES = [
  // [chiave route, chiave testi in i18n.pages, file in src/content/<lingua>/]
  ["privacy", "privacy", "privacy.html"],
  ["cookies", "cookies", "cookies.html"],
  ["about", "about", "about.html"],
  ["contact", "contact", "contact.html"]
];

const written = [];

async function main() {
  const started = Date.now();
  await fs.rm(DIST, { recursive: true, force: true });
  await fs.cp(PUBLIC, DIST, { recursive: true });

  const dicts = await loadDictionaries();
  validateRegistry(dicts);

  for (const code of SITE.languages) {
    const t = dicts[code];
    await writePage(t.routes.home, homePage(t, dicts));

    for (const [routeKey, pageKey, file] of CONTENT_PAGES) {
      const body = await readContent(code, file, t);
      await writePage(t.routes[routeKey], contentPage(t, dicts, routeKey, pageKey, body));
    }

    for (const game of GAMES.filter((g) => g.status === "live")) {
      await writePage(gamePath(game, t), gamePage(t, dicts, game, await loadGameFiles(game, code, t)));
    }
  }

  await writeFile("404.html", notFoundPage(dicts));
  await writeFile("sitemap.xml", sitemap(dicts));
  await writeFile("robots.txt", robots());
  await writeFile("ads.txt", adsTxt());
  await writeFile("manifest.webmanifest", manifest(dicts));
  await writeFile(".nojekyll", "");

  console.log(`✔ Build completata in ${Date.now() - started} ms — ${written.length} file generati in dist/`);
}

async function loadDictionaries() {
  const dicts = {};
  for (const code of SITE.languages) {
    const file = path.join(SRC, "i18n", `${code}.mjs`);
    dicts[code] = (await import(pathToFileURL(file).href)).default;
  }
  return dicts;
}

/** Controlli di coerenza: slug unici, traduzioni presenti, categorie valide */
function validateRegistry(dicts) {
  const errors = [];
  const ids = new Set();
  for (const game of GAMES) {
    if (ids.has(game.id)) errors.push(`id duplicato: ${game.id}`);
    ids.add(game.id);
    for (const code of SITE.languages) {
      const m = game.i18n[code];
      if (!m) { errors.push(`${game.id}: manca la lingua "${code}"`); continue; }
      for (const field of ["slug", "title", "tagline", "desc", "keywords"]) {
        if (!m[field]) errors.push(`${game.id}.${code}: campo "${field}" mancante`);
      }
      for (const c of game.categories) {
        if (!dicts[code].categories[c]) errors.push(`${game.id}: categoria "${c}" non tradotta in ${code}`);
      }
    }
  }
  for (const code of SITE.languages) {
    const slugs = GAMES.map((g) => g.i18n[code]?.slug);
    const dup = slugs.filter((s, i) => slugs.indexOf(s) !== i);
    if (dup.length) errors.push(`slug duplicati in ${code}: ${dup.join(", ")}`);
  }
  if (errors.length) throw new Error(`Registro giochi non valido:\n  - ${errors.join("\n  - ")}`);
}

/** Legge un frammento HTML di contenuto, toglie i commenti interni e riempie i segnaposto */
async function readContent(code, file, t) {
  const raw = await fs.readFile(path.join(SRC, "content", code, file), "utf8");
  return fill(stripComments(raw), templateVars(t));
}

function templateVars(t) {
  return {
    site: { name: SITE.name, url: SITE.url },
    controller: SITE.controller,
    link: Object.fromEntries(Object.entries(t.routes).map(([k, v]) => [k, href(v)]))
  };
}

function stripComments(html) {
  return html.replace(/<!--(?![\s\S]*?GOOGLE ADSENSE)[\s\S]*?-->\s*/g, "");
}

/** File di un gioco "live" (contratto descritto in src/templates/pages.mjs → gamePage) */
async function loadGameFiles(game, code, t) {
  const stagePath = path.join(SRC, "games", game.id, "stage.html");
  const articlePath = path.join(SRC, "games", game.id, `${code}.content.html`);
  const dataRel = `/assets/data/${game.id}.${code}.mjs`;
  const dataPath = path.join(PUBLIC, dataRel);
  const logicPath = path.join(PUBLIC, `/assets/js/games/${game.id}.js`);
  for (const p of [stagePath, articlePath, dataPath, logicPath]) {
    if (!existsSync(p)) throw new Error(`Gioco "${game.id}" è live ma manca ${path.relative(ROOT, p)}`);
  }
  const data = (await import(pathToFileURL(dataPath).href)).default;
  if (!data.ui) throw new Error(`${path.relative(ROOT, dataPath)}: manca l'oggetto "ui"`);

  const vars = { ...templateVars(t), ui: data.ui };
  const articleHtml = fill(stripComments(await fs.readFile(articlePath, "utf8")), vars);
  return {
    stageHtml: fill(stripComments(await fs.readFile(stagePath, "utf8")), vars),
    articleHtml,
    dataSrc: href(dataRel),
    faq: extractFaq(articleHtml),
    usesTeams: !!game.teams
  };
}

/** FAQ dell'articolo → dati strutturati FAQPage.
    Formato: <details class="faq__item"><summary><h3>Domanda</h3></summary><p>Risposta</p></details> */
function extractFaq(html) {
  const text = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return [...html.matchAll(/<details class="faq__item">\s*<summary>\s*<h3>([\s\S]*?)<\/h3>\s*<\/summary>([\s\S]*?)<\/details>/g)]
    .map((m) => ({ q: text(m[1]), a: text(m[2]) }));
}

/* ---------------- file generati ---------------- */

async function writePage(route, html) {
  const rel = route.replace(/^\//, "") + "index.html";
  await writeFile(rel, html);
}

async function writeFile(rel, content) {
  const out = path.join(DIST, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, content, "utf8");
  written.push(rel);
}

function sitemap(dicts) {
  const today = new Date().toISOString().slice(0, 10);
  // Ogni voce = una pagina nelle varie lingue → una <url> per lingua con gli alternates
  const groups = [
    { paths: routeGroup(dicts, "home"), priority: "1.0", changefreq: "weekly" },
    ...GAMES.filter((g) => g.status === "live").map((g) => ({
      paths: Object.fromEntries(SITE.languages.map((c) => [c, gamePath(g, dicts[c])])),
      priority: "0.9",
      changefreq: "monthly"
    })),
    { paths: routeGroup(dicts, "about"), priority: "0.4", changefreq: "yearly" },
    { paths: routeGroup(dicts, "contact"), priority: "0.3", changefreq: "yearly" },
    { paths: routeGroup(dicts, "privacy"), priority: "0.2", changefreq: "yearly" },
    { paths: routeGroup(dicts, "cookies"), priority: "0.2", changefreq: "yearly" }
  ];

  const urls = groups.flatMap((group) =>
    Object.entries(group.paths).map(([, p]) => {
      const alternates = Object.entries(group.paths)
        .map(([code, alt]) => `    <xhtml:link rel="alternate" hreflang="${code}" href="${absUrl(alt)}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${absUrl(group.paths[SITE.defaultLanguage])}"/>`)
        .join("\n");
      return `  <url>
    <loc>${absUrl(p)}</loc>
${alternates}
    <lastmod>${today}</lastmod>
    <changefreq>${group.changefreq}</changefreq>
    <priority>${group.priority}</priority>
  </url>`;
    })
  );

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join("\n")}
</urlset>
`;
}

function routeGroup(dicts, key) {
  return Object.fromEntries(SITE.languages.map((c) => [c, dicts[c].routes[key]]));
}

function robots() {
  return `# robots.txt — ${SITE.name}
User-agent: *
Allow: /

# Il crawler di AdSense deve poter leggere tutte le pagine
User-agent: Mediapartners-Google
Allow: /

Sitemap: ${absUrl("/sitemap.xml")}
`;
}

function adsTxt() {
  const client = SITE.adsense.client;
  const configured = /^ca-pub-\d{16}$/.test(client);
  const line = `google.com, ${client.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0`;
  return configured
    ? `${line}\n`
    : `# ads.txt — impostare adsense.client in src/config.mjs e rilanciare la build.\n# ${line}\n`;
}

function manifest(dicts) {
  const t = dicts[SITE.defaultLanguage];
  return JSON.stringify({
    name: `${SITE.name} — ${t.home.ogTitle.split("—").pop().trim()}`,
    short_name: SITE.name,
    description: t.seo.siteDescription,
    lang: t.code,
    start_url: href("/"),
    scope: href("/"),
    display: "standalone",
    background_color: SITE.themeColor,
    theme_color: SITE.themeColor,
    icons: [
      { src: href("/assets/img/icons/icon-192.png"), sizes: "192x192", type: "image/png" },
      { src: href("/assets/img/icons/icon-512.png"), sizes: "512x512", type: "image/png" },
      { src: href("/assets/img/icons/icon-maskable-512.png"), sizes: "512x512", type: "image/png", purpose: "maskable" }
    ]
  }, null, 2);
}

main().catch((err) => {
  console.error(`✖ ${err.message}`);
  process.exit(1);
});
