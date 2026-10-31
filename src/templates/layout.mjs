/* =========================================================
   LAYOUT COMUNE A TUTTE LE PAGINE
   head SEO · header · banner alto · sidebar · footer ·
   cookie banner. Le pagine passano solo il proprio contenuto.
   ========================================================= */

import { SITE } from "../config.mjs";
import { esc, href, absUrl, jsonScript, adSlot, icon, logo } from "./util.mjs";

/**
 * @param {object} p
 * @param {object} p.t            dizionario della lingua
 * @param {object} p.dicts        tutti i dizionari { it, en, ... }
 * @param {object} p.paths        percorso della pagina per lingua { it: "/", en: "/en/" }
 * @param {string} p.title
 * @param {string} p.description
 * @param {string} [p.keywords]
 * @param {string} [p.ogTitle]
 * @param {string} [p.ogImage]    percorso dell'immagine Open Graph (1200×630)
 * @param {string} [p.ogImageAlt]
 * @param {string} [p.ogType]
 * @param {boolean} [p.noindex]
 * @param {object[]} [p.jsonLd]
 * @param {Array<{name:string,path:string}>} [p.breadcrumb]
 * @param {string} p.content      HTML del <main>
 * @param {Array<string|{src:string,module:true}>} [p.scripts]  script aggiuntivi (classici con defer, o moduli ES)
 * @param {string[]} [p.styles]   fogli di stile aggiuntivi
 * @param {string[]} [p.preload]  moduli ES da precaricare in parallelo (modulepreload)
 * @param {string} [p.bodyClass]
 * @param {boolean} [p.rails]     mostra le sidebar pubblicitarie (default true)
 */
export function renderPage(p) {
  const { t, dicts } = p;
  const path = p.paths[t.code];
  const canonical = absUrl(path);
  const ogImage = absUrl(p.ogImage || `/assets/img/og/home-${t.code}.png`);
  const rails = p.rails !== false;
  const year = new Date().getFullYear();

  const alternates = SITE.languages
    .filter((code) => p.paths[code])
    .map((code) => `<link rel="alternate" hreflang="${code}" href="${absUrl(p.paths[code])}">`)
    .join("\n");
  const xDefault = p.paths[SITE.defaultLanguage]
    ? `<link rel="alternate" hreflang="x-default" href="${absUrl(p.paths[SITE.defaultLanguage])}">`
    : "";
  const ogAlternates = SITE.languages
    .filter((code) => code !== t.code && p.paths[code])
    .map((code) => `<meta property="og:locale:alternate" content="${dicts[code].locale}">`)
    .join("\n");

  // Configurazione esposta al JavaScript del browser
  const clientConfig = {
    lang: t.code,
    basePath: SITE.basePath,
    strings: t.js,
    consent: { version: SITE.consentVersion, maxAgeDays: SITE.consentMaxAgeDays },
    adsense: {
      enabled: SITE.adsense.enabled,
      client: SITE.adsense.client,
      slots: SITE.adsense.slots,
      showPlaceholders: SITE.adsense.showPlaceholders
    },
    analytics: { gaId: SITE.analytics.gaId }
  };

  const breadcrumbLd = p.breadcrumb
    ? [{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: p.breadcrumb.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absUrl(item.path)
        }))
      }]
    : [];
  const jsonLd = [...(p.jsonLd || []), ...breadcrumbLd]
    .map((data) => `<script type="application/ld+json">${jsonScript(data)}</script>`)
    .join("\n");

  const scripts = [
    "/assets/js/core/ui.js",
    "/assets/js/core/ads.js",
    "/assets/js/core/analytics.js",
    ...(p.scripts || [])
  ].map((s) => typeof s === "string"
    ? `<script src="${href(s)}" defer></script>`
    : `<script type="module" src="${href(s.src)}"></script>`
  ).join("\n");

  return `<!DOCTYPE html>
<html lang="${t.code}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
${p.keywords ? `<meta name="keywords" content="${esc(p.keywords)}">` : ""}
<meta name="robots" content="${p.noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
${p.noindex ? "" : `<link rel="canonical" href="${canonical}">`}
${p.noindex ? "" : alternates}
${p.noindex ? "" : xDefault}

<!-- Open Graph / social -->
<meta property="og:type" content="${p.ogType || "website"}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(p.ogTitle || p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(p.ogImageAlt || p.ogTitle || p.title)}">
<meta property="og:locale" content="${t.locale}">
${ogAlternates}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(p.ogTitle || p.title)}">
<meta name="twitter:description" content="${esc(p.description)}">
<meta name="twitter:image" content="${ogImage}">

<!-- Icone e PWA -->
<link rel="icon" href="${href("/assets/img/icons/favicon.svg")}" type="image/svg+xml">
<link rel="icon" href="${href("/assets/img/icons/icon-32.png")}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${href("/assets/img/icons/apple-touch-icon.png")}">
<link rel="manifest" href="${href("/manifest.webmanifest")}">
<meta name="theme-color" content="${SITE.themeColor}">
<meta name="color-scheme" content="dark">

<!-- Font ospitati localmente (SIL OFL 1.1): nessuna richiesta a server terzi -->
<link rel="preload" href="${href("/assets/fonts/poppins-latin-800.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${href("/assets/fonts/inter-latin-400.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${href("/assets/css/base.css")}">
${(p.styles || []).map((css) => `<link rel="stylesheet" href="${href(css)}">`).join("\n")}

<!-- Config + Consent Mode v2: consent.js è il primo script differito, quindi imposta
     i default "denied" prima che ads.js o analytics.js possano caricare tag Google -->
<script>window.PG=${jsonScript(clientConfig)};</script>
<script src="${href("/assets/js/core/consent.js")}" defer></script>
${(p.preload || []).map((src) => `<link rel="modulepreload" href="${href(src)}">`).join("\n")}
${scripts}
${jsonLd}
</head>
<body class="${p.bodyClass || ""}">
<a class="skip-link" href="#main">${esc(t.ui.skipToContent)}</a>
<div class="bg-blobs" aria-hidden="true"><span></span><span></span><span></span></div>

${renderHeader(t, dicts, p.paths)}

<div class="ad-band">${adSlot("top", t)}
</div>

<div class="page-shell${rails ? " page-shell--rails" : ""}">
${rails ? `<aside class="ad-rail ad-rail--left" aria-label="${esc(t.ui.adLabel)}">${adSlot("rail", t)}
</aside>` : ""}
<main id="main" class="page-main" tabindex="-1">
${p.breadcrumb ? renderBreadcrumb(t, p.breadcrumb) : ""}
${p.content}
</main>
${rails ? `<aside class="ad-rail ad-rail--right" aria-label="${esc(t.ui.adLabel)}">${adSlot("rail", t)}
</aside>` : ""}
</div>

<div class="ad-band ad-band--bottom">${adSlot("bottom", t)}
</div>

${renderFooter(t, year)}
${renderConsentBanner(t)}
</body>
</html>
`;
}

function renderHeader(t, dicts, paths) {
  const langLinks = SITE.languages
    .filter((code) => code !== t.code)
    .map((code) => {
      const target = paths[code] || dicts[code].routes.home;
      return `<a class="lang-switch" href="${href(target)}" hreflang="${code}" lang="${code}" title="${esc(t.ui.switchTo)} ${esc(dicts[code].name)}">${icon("globe")}<span>${code.toUpperCase()}</span></a>`;
    })
    .join("");

  return `<header class="site-header">
  <div class="site-header__inner">
    <a class="brand" href="${href(t.routes.home)}" aria-label="${esc(SITE.name)} — ${esc(t.ui.navHome)}">
      ${logo("lg-h")}
      <span class="brand__name">Party<span>Games</span> <em class="brand__club">Club</em></span>
    </a>
    <nav class="main-nav" aria-label="${esc(t.ui.mainNavLabel)}">
      <a href="${href(t.routes.home)}#games">${esc(t.ui.navGames)}</a>
      <a class="main-nav__optional" href="${href(t.routes.home)}#how-to-play">${esc(t.ui.navHowTo)}</a>
      <a href="${href(t.routes.about)}">${esc(t.ui.navAbout)}</a>
      ${langLinks}
    </nav>
  </div>
</header>`;
}

function renderBreadcrumb(t, items) {
  const li = items.map((item, i) =>
    i === items.length - 1
      ? `<li aria-current="page">${esc(item.name)}</li>`
      : `<li><a href="${href(item.path)}">${esc(item.name)}</a></li>`
  ).join("");
  return `<nav class="breadcrumb" aria-label="${esc(t.ui.breadcrumbLabel)}"><ol>${li}</ol></nav>`;
}

function renderFooter(t, year) {
  return `<footer class="site-footer">
  <div class="site-footer__inner">
    <div class="site-footer__brand">
      <a class="brand" href="${href(t.routes.home)}" aria-label="${esc(SITE.name)} — ${esc(t.ui.navHome)}">${logo("lg-f")}<span class="brand__name">Party<span>Games</span> <em class="brand__club">Club</em></span></a>
      <p>${esc(t.ui.footerTagline)}</p>
    </div>
    <nav class="site-footer__col" aria-label="${esc(t.ui.footerGames)}">
      <h2>${esc(t.ui.footerGames)}</h2>
      <a href="${href(t.routes.home)}#games">${esc(t.categories.all)}</a>
      <a href="${href(t.routes.home)}#how-to-play">${esc(t.ui.navHowTo)}</a>
    </nav>
    <nav class="site-footer__col" aria-label="${esc(t.ui.footerInfo)}">
      <h2>${esc(t.ui.footerInfo)}</h2>
      <a href="${href(t.routes.about)}">${esc(t.ui.about)}</a>
      <a href="${href(t.routes.contact)}">${esc(t.ui.contact)}</a>
    </nav>
    <nav class="site-footer__col" aria-label="${esc(t.ui.footerLegal)}">
      <h2>${esc(t.ui.footerLegal)}</h2>
      <a href="${href(t.routes.privacy)}">${esc(t.ui.privacy)}</a>
      <a href="${href(t.routes.cookies)}">${esc(t.ui.cookies)}</a>
      <button type="button" class="link-button" data-consent-open>${esc(t.ui.manageCookies)}</button>
    </nav>
  </div>
  <p class="site-footer__copy">© ${year} ${esc(SITE.name)}. ${esc(t.ui.allRights)}</p>
</footer>`;
}

/* Cookie banner: non blocca la pagina, "Rifiuta" ha lo stesso peso
   visivo di "Accetta" e la X equivale a rifiutare (linee guida
   del Garante Privacy, 10 giugno 2021). */
function renderConsentBanner(t) {
  const c = t.consent;
  return `<section class="consent" id="consent" role="dialog" aria-modal="false" aria-labelledby="consent-title" hidden>
  <button type="button" class="consent__close" data-consent="reject" aria-label="${esc(c.close)}">${icon("close")}</button>
  <div class="consent__summary" data-consent-view="summary">
    <h2 id="consent-title" class="consent__title">${icon("shield")} ${esc(c.title)}</h2>
    <p class="consent__text">${esc(c.text)} <a href="${href(t.routes.cookies)}">${esc(c.more)}</a></p>
  </div>
  <form class="consent__prefs" data-consent-view="prefs" hidden>
    <h2 class="consent__title">${esc(c.prefsTitle)}</h2>
    <div class="consent__row">
      <div><h3>${esc(c.necessaryTitle)}</h3><p>${esc(c.necessaryText)}</p></div>
      <span class="consent__always">${esc(c.alwaysOn)}</span>
    </div>
    <label class="consent__row">
      <div><h3>${esc(c.analyticsTitle)}</h3><p>${esc(c.analyticsText)}</p></div>
      <input type="checkbox" class="switch" name="analytics">
    </label>
    <label class="consent__row">
      <div><h3>${esc(c.adsTitle)}</h3><p>${esc(c.adsText)}</p></div>
      <input type="checkbox" class="switch" name="ads">
    </label>
  </form>
  <div class="consent__actions">
    <button type="button" class="btn btn--primary" data-consent="reject">${esc(c.reject)}</button>
    <button type="button" class="btn btn--ghost" data-consent="customize">${esc(c.customize)}</button>
    <button type="button" class="btn btn--ghost" data-consent="save" hidden>${esc(c.save)}</button>
    <button type="button" class="btn btn--primary" data-consent="accept">${esc(c.accept)}</button>
  </div>
</section>`;
}
