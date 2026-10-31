/* =========================================================
   TEMPLATE DELLE PAGINE
   Ogni funzione restituisce l'HTML completo di una pagina
   usando renderPage() del layout comune.
   ========================================================= */

import { SITE } from "../config.mjs";
import { GAMES, gamePath } from "../games/registry.mjs";
import { renderPage } from "./layout.mjs";
import { esc, href, absUrl, adSlot, icon } from "./util.mjs";

/** Percorsi di una pagina "di route" in tutte le lingue */
function routePaths(dicts, routeKey) {
  return Object.fromEntries(SITE.languages.map((code) => [code, dicts[code].routes[routeKey]]));
}

/* ---------------------------------------------------------
   HOMEPAGE
   --------------------------------------------------------- */
export function homePage(t, dicts) {
  const h = t.home;
  const categoryKeys = Object.keys(t.categories);
  const liveGames = GAMES.filter((g) => g.status === "live");

  const filters = categoryKeys.map((key, i) =>
    `<button type="button" class="chip${i === 0 ? " is-active" : ""}" data-filter="${key}" aria-pressed="${i === 0}">${esc(t.categories[key])}</button>`
  ).join("");

  const cards = GAMES.map((g) => gameCard(g, t)).join("\n");

  const content = `
<section class="hero">
  <p class="hero__eyebrow">${esc(h.eyebrow)}</p>
  <h1 class="hero__title">${esc(h.h1)}</h1>
  <p class="hero__lead">${esc(h.lead)}</p>
  <div class="hero__actions">
    <a class="btn btn--primary btn--lg" href="#games">${esc(h.ctaPrimary)} ${icon("arrow")}</a>
    <button type="button" class="btn btn--ghost btn--lg" data-random-game>${icon("dice")} ${esc(h.ctaRandom)}</button>
  </div>
  <ul class="hero__stats">
    ${h.stats.map((s) => `<li><strong>${esc(s.value)}</strong><span>${esc(s.label)}</span></li>`).join("")}
  </ul>
</section>

${teamsPanel(t)}

<section class="section" id="games" aria-labelledby="games-title">
  <div class="section__head">
    <h2 id="games-title">${esc(h.gamesH2)}</h2>
    <p>${esc(h.gamesIntro)}</p>
  </div>
  <div class="filters" role="group" aria-label="${esc(h.filtersLabel)}">${filters}</div>
  <div class="game-grid" data-game-grid>
${cards}
  </div>
  <p class="toast" data-toast role="status" aria-live="polite" hidden></p>
</section>

<section class="section" aria-labelledby="why-title">
  <div class="section__head"><h2 id="why-title">${esc(h.whyH2)}</h2></div>
  <div class="feature-grid">
    ${h.why.map((f, i) => `<article class="feature">
      <span class="feature__icon">${icon(["zap", "tv", "heart", "gift"][i % 4])}</span>
      <h3>${esc(f.h3)}</h3>
      <p>${esc(f.p)}</p>
    </article>`).join("")}
  </div>
</section>

<section class="section" id="how-to-play" aria-labelledby="how-title">
  <div class="section__head"><h2 id="how-title">${esc(h.howH2)}</h2></div>
  <ol class="steps">
    ${h.how.map((s) => `<li class="step"><h3>${esc(s.h3)}</h3><p>${esc(s.p)}</p></li>`).join("")}
  </ol>
</section>

<section class="section" aria-labelledby="faq-title">
  <div class="section__head"><h2 id="faq-title">${esc(h.faqH2)}</h2></div>
  <div class="faq">
    ${h.faq.map((f) => `<details class="faq__item"><summary><h3>${esc(f.q)}</h3></summary><p>${esc(f.a)}</p></details>`).join("")}
  </div>
</section>`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: absUrl(t.routes.home),
      inLanguage: t.code,
      description: t.seo.siteDescription
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: h.faq.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a }
      }))
    }
  ];
  if (liveGames.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: h.gamesH2,
      itemListElement: liveGames.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: g.i18n[t.code].title,
        url: absUrl(gamePath(g, t))
      }))
    });
  }

  return renderPage({
    t, dicts,
    paths: routePaths(dicts, "home"),
    title: h.title,
    description: h.description,
    keywords: h.keywords,
    ogTitle: h.ogTitle,
    ogImage: `/assets/img/og/home-${t.code}.png`,
    jsonLd,
    content,
    bodyClass: "page-home",
    scripts: ["/assets/js/core/teams.js", "/assets/js/core/home.js"]
  });
}

function gameCard(g, t) {
  const m = g.i18n[t.code];
  const live = g.status === "live";
  const titleHtml = live
    ? `<a class="game-card__link" href="${href(gamePath(g, t))}">${esc(m.title)}</a>`
    : esc(m.title);
  const badges = g.categories.map((c) => `<span class="badge">${esc(t.categories[c])}</span>`).join("");
  return `    <article class="game-card${live ? "" : " is-soon"}" data-categories="${g.categories.join(" ")}" data-live="${live}" data-title="${esc(m.title)}" style="--card:${g.color}">
      <div class="game-card__top"><span class="game-card__icon" aria-hidden="true">${g.icon}</span><div class="game-card__badges">${badges}</div></div>
      <h3 class="game-card__title">${titleHtml}</h3>
      <p class="game-card__tagline">${esc(m.tagline)}</p>
      <p class="game-card__desc">${esc(m.desc)}</p>
      <ul class="game-card__meta">
        <li>${icon("users")}<span class="visually-hidden">${esc(t.ui.players)}:</span> ${esc(g.players)}</li>
        <li>${icon("clock")} ~${g.minutes} min</li>
      </ul>
      <span class="game-card__cta">${live ? `${esc(t.ui.play)} ${icon("arrow")}` : esc(t.ui.comingSoon)}</span>
    </article>`;
}

/* ---------------------------------------------------------
   PAGINE DI CONTENUTO (privacy, cookie, chi siamo, contatti)
   Il testo vive in src/content/<lingua>/<pagina>.html
   --------------------------------------------------------- */
export function contentPage(t, dicts, routeKey, pageKey, bodyHtml) {
  const meta = t.pages[pageKey];
  const isLegal = routeKey === "privacy" || routeKey === "cookies";
  const content = `
<article class="prose">
  <header class="prose__head">
    <h1>${esc(meta.h1)}</h1>
    ${isLegal ? `<p class="prose__updated">${esc(t.ui.lastUpdated)}: <time datetime="${SITE.legalUpdated}">${formatDate(SITE.legalUpdated, t.code)}</time></p>` : ""}
  </header>
${bodyHtml}
</article>`;

  return renderPage({
    t, dicts,
    paths: routePaths(dicts, routeKey),
    title: meta.title,
    description: meta.description,
    ogImage: `/assets/img/og/home-${t.code}.png`,
    breadcrumb: [
      { name: t.ui.navHome, path: t.routes.home },
      { name: meta.breadcrumb, path: t.routes[routeKey] }
    ],
    content,
    bodyClass: `page-${routeKey}`
  });
}

/** "3+" → {minValue:3} · "2–8" → {minValue:2,maxValue:8} · "2" → {value:2} */
function playersValue(text) {
  const [min, max] = text.split(/[–-]/).map((n) => parseInt(n, 10));
  if (text.endsWith("+")) return { "@type": "QuantitativeValue", minValue: min };
  if (max) return { "@type": "QuantitativeValue", minValue: min, maxValue: max };
  return { "@type": "QuantitativeValue", value: min };
}

function formatDate(iso, lang) {
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00Z`));
}

/* ---------------------------------------------------------
   404 — GitHub Pages / Cloudflare Pages servono /404.html per
   ogni URL inesistente: la pagina contiene tutte le lingue e
   mostra quella giusta in base al percorso richiesto.
   --------------------------------------------------------- */
export function notFoundPage(dicts) {
  const t = dicts[SITE.defaultLanguage];
  const blocks = SITE.languages.map((code) => {
    const d = dicts[code];
    return `<section class="not-found" lang="${code}" data-lang-block="${code}"${code === t.code ? "" : " hidden"}>
  <p class="not-found__code" aria-hidden="true">404</p>
  <h1>${esc(d.pages.notFound.h1)}</h1>
  <p>${esc(d.pages.notFound.lead)}</p>
  <a class="btn btn--primary btn--lg" href="${href(d.routes.home)}">${esc(d.pages.notFound.back)}</a>
</section>`;
  }).join("\n");

  const content = `${blocks}
<script>
  /* Mostra il blocco nella lingua del percorso richiesto (es. /en/...) */
  (function () {
    var base = ${JSON.stringify(SITE.basePath)};
    var path = location.pathname.slice(base.length);
    var match = path.match(/^\\/([a-z]{2})(\\/|$)/);
    var block = match && document.querySelector('[data-lang-block="' + match[1] + '"]');
    if (!block) return;
    document.querySelectorAll("[data-lang-block]").forEach(function (el) { el.hidden = el !== block; });
    document.documentElement.lang = match[1];
  })();
</script>`;

  return renderPage({
    t, dicts,
    paths: { [t.code]: "/404.html" },
    title: t.pages.notFound.title,
    description: t.pages.notFound.lead,
    noindex: true,
    content,
    rails: false,
    bodyClass: "page-404"
  });
}

/* ---------------------------------------------------------
   PANNELLO SQUADRE (homepage e giochi a squadre)
   Il contenuto viene disegnato da assets/js/core/teams.js
   --------------------------------------------------------- */
export function teamsPanel(t, { collapsible = false } = {}) {
  const h = t.home;
  const body = `
  <div class="teams-count" data-teams-count></div>
  <div class="teams-grid" data-teams-grid></div>
  <div class="teams-actions">
    <button type="button" class="btn btn--danger btn--sm" data-teams-reset>${icon("reset")} ${esc(h.resetScores)}</button>
  </div>`;
  if (collapsible) {
    return `<details class="teams-panel teams-panel--compact" data-teams-panel>
  <summary><span>${icon("users")} ${esc(h.teamsH2)}</span><small>${esc(h.teamsIntro)}</small></summary>${body}
</details>`;
  }
  return `<section class="section teams-panel" id="teams" aria-labelledby="teams-title" data-teams-panel>
  <div class="section__head">
    <h2 id="teams-title">${esc(h.teamsH2)}</h2>
    <p>${esc(h.teamsIntro)}</p>
  </div>${body}
</section>`;
}

/* ---------------------------------------------------------
   PAGINA DI UN GIOCO (generata quando status === "live")
   Contratto di ogni gioco (vedi README):
     src/games/<id>/stage.html             markup dell'area di gioco,
                                           con segnaposto {{ui.chiave}}
     src/games/<id>/<lingua>.content.html  articolo SEO: regole, consigli, FAQ
     public/assets/data/<id>.<lingua>.mjs  testi dell'interfaccia (ui) e contenuti
     public/assets/js/games/<id>.js        logica del gioco (modulo ES)
   La logica chiama PG.ads.reveal("results") quando mostra la
   schermata finale, per attivare lo slot pubblicitario dei risultati.
   --------------------------------------------------------- */
export function gamePage(t, dicts, game, { stageHtml, articleHtml, dataSrc, faq, usesTeams }) {
  const m = game.i18n[t.code];
  const paths = Object.fromEntries(
    SITE.languages.filter((code) => game.i18n[code]).map((code) => [code, gamePath(game, dicts[code])])
  );
  const related = GAMES
    .filter((g) => g.id !== game.id && g.status === "live")
    .sort((a, b) => sharedCategories(b, game) - sharedCategories(a, game))
    .slice(0, 3);

  const content = `
<article class="game-page" style="--card:${game.color}" data-game="${game.id}">
  <header class="game-page__head">
    <span class="game-page__icon" aria-hidden="true">${game.icon}</span>
    <div>
      <h1>${esc(m.title)}</h1>
      <p class="game-page__tagline">${esc(m.tagline)}</p>
      <ul class="game-card__meta">
        <li>${icon("users")}<span class="visually-hidden">${esc(t.ui.players)}:</span> ${esc(game.players)}</li>
        <li>${icon("clock")} ~${game.minutes} min</li>
        <li><a href="#rules">${esc(t.ui.rulesLink)}</a></li>
      </ul>
    </div>
  </header>

  ${usesTeams ? teamsPanel(t, { collapsible: true }) : ""}

  <section class="game-stage" id="game-stage" aria-label="${esc(m.title)}" data-game-data="${dataSrc}">
${stageHtml}
  </section>

  <!-- Slot risultati: nascosto durante la partita, mostrato da PG.ads.reveal("results") -->
  ${adSlot("results", t, { hidden: true })}

  <div class="prose game-page__article" id="rules">
${articleHtml}
  </div>
</article>
${related.length ? `<section class="section" aria-labelledby="related-title">
  <div class="section__head"><h2 id="related-title">${esc(t.ui.relatedGames)}</h2></div>
  <div class="game-grid">${related.map((g) => gameCard(g, t)).join("\n")}</div>
</section>` : ""}`;

  const jsonLd = [{
    "@context": "https://schema.org",
    "@type": "Game",
    name: m.title,
    description: m.desc,
    url: absUrl(gamePath(game, t)),
    image: absUrl(`/assets/img/og/game-${game.id}-${t.code}.png`),
    inLanguage: t.code,
    numberOfPlayers: playersValue(game.players),
    isAccessibleForFree: true
  }];
  if (faq.length) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } }))
    });
  }

  return renderPage({
    t, dicts, paths,
    title: `${m.title}: ${m.tagline} | ${SITE.name}`,
    description: m.desc,
    keywords: m.keywords,
    ogTitle: `${m.title} — ${m.tagline}`,
    ogImage: `/assets/img/og/game-${game.id}-${t.code}.png`,
    breadcrumb: [
      { name: t.ui.navHome, path: t.routes.home },
      { name: t.ui.navGames, path: `${t.routes.home}#games` },
      { name: m.title, path: gamePath(game, t) }
    ],
    jsonLd,
    content,
    bodyClass: `page-game game-${game.id}`,
    styles: ["/assets/css/game.css"],
    scripts: [
      ...(usesTeams ? ["/assets/js/core/teams.js"] : []),
      { src: `/assets/js/games/${game.id}.js`, module: true }
    ]
  });
}

function sharedCategories(a, b) {
  return a.categories.filter((c) => b.categories.includes(c)).length;
}
