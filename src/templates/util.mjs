/* Funzioni di supporto condivise dai template */

import { SITE } from "../config.mjs";

/** Escape per testo e attributi HTML */
export function esc(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Percorso interno (aggiunge l'eventuale basePath del sito) */
export function href(path) {
  return `${SITE.basePath}${path}`;
}

/** URL assoluto, per canonical, Open Graph, sitemap */
export function absUrl(path) {
  return `${SITE.url}${SITE.basePath}${path}`;
}

/** Sostituisce i segnaposto {{chiave.annidata}} in un testo */
export function fill(text, vars) {
  return text.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, key) => {
    const value = key.split(".").reduce((obj, k) => (obj == null ? undefined : obj[k]), vars);
    if (value === undefined) throw new Error(`Segnaposto sconosciuto: ${match}`);
    return value;
  });
}

/** JSON sicuro da inserire dentro <script> */
export function jsonScript(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/* ---------------------------------------------------------
   SLOT PUBBLICITARI
   Ogni slot riserva il proprio spazio via CSS (min-height),
   così il layout non "salta" quando l'annuncio arriva.
   ads.js inserisce il tag <ins class="adsbygoogle"> dentro
   .ad-slot__inner solo dopo la scelta sui cookie.
   --------------------------------------------------------- */
const AD_SIZES = {
  top: "728×90 / 320×100 responsive",
  rail: "160×600 / 300×600",
  bottom: "responsive 336×280",
  results: "responsive 336×280"
};

/* Spazi pubblicitari presenti nella pagina solo se AdSense è attivo o se
   sono richiesti i segnaposto: altrimenti nessun riquadro vuoto */
export const ADS_ON = SITE.adsense.enabled || SITE.adsense.showPlaceholders;
export const ADSENSE_CLIENT_OK = /^ca-pub-\d{16}$/.test(SITE.adsense.client);

export function adSlot(key, t, { hidden = false } = {}) {
  if (!ADS_ON) return `
<!-- GOOGLE ADSENSE CODE HERE — slot "${key}" (${AD_SIZES[key]}): disattivato in src/config.mjs → adsense -->`;
  return `
<!-- GOOGLE ADSENSE CODE HERE — slot "${key}" (${AD_SIZES[key]}). Configurare l'ID in src/config.mjs → adsense.slots.${key} -->
<div class="ad-slot ad-slot--${key}" data-ad-key="${key}"${hidden ? " hidden" : ""}>
  <span class="ad-slot__label">${esc(t.ui.adLabel)}</span>
  <div class="ad-slot__inner" data-size="${esc(AD_SIZES[key])}"></div>
</div>`;
}

/* ---------------------------------------------------------
   ICONE SVG (disegnate a mano, nessuna libreria esterna)
   --------------------------------------------------------- */
const ICONS = {
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5"/><circle cx="17" cy="9" r="2.6"/><path d="M16.5 13.6c2.8.3 5 2.7 5 5.6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  dice: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><circle cx="8.5" cy="8.5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1.2" fill="currentColor"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
  shield: '<path d="M12 3l7.5 3v5.5c0 4.6-3.1 8.4-7.5 9.5-4.4-1.1-7.5-4.9-7.5-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  zap: '<path d="M13 2.5L4.5 13.5H12L11 21.5l8.5-11H12z"/>',
  tv: '<rect x="2.5" y="4.5" width="19" height="13" rx="2.5"/><path d="M8 21h8M12 17.5V21"/>',
  heart: '<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/>',
  gift: '<rect x="3.5" y="8.5" width="17" height="4" rx="1"/><path d="M5 12.5v8h14v-8M12 8.5v12M12 8.5c-1.5-3.5-5.5-4-5.5-1.5S10 8.5 12 8.5zm0 0c1.5-3.5 5.5-4 5.5-1.5S14 8.5 12 8.5z"/>'
};

export function icon(name, cls = "icon") {
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}

/** Logo del sito: dado stilizzato su tessera sfumata (SVG originale) */
export function logo(id = "lg") {
  return `<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
  <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4dd9ff"/><stop offset=".55" stop-color="#b06aff"/><stop offset="1" stop-color="#ff2d55"/></linearGradient></defs>
  <rect x="4" y="4" width="56" height="56" rx="17" fill="url(#${id})"/>
  <g transform="rotate(-12 32 33)"><rect x="17" y="18" width="30" height="30" rx="8.5" fill="#0a0e1a"/><circle cx="25" cy="26" r="3.3" fill="#fff"/><circle cx="32" cy="33" r="3.3" fill="#ffd600"/><circle cx="39" cy="40" r="3.3" fill="#fff"/></g>
  <circle cx="52.5" cy="11.5" r="2.6" fill="#ffd600"/><rect x="8" y="49" width="6" height="2.6" rx="1.3" fill="#fff" transform="rotate(-35 11 50)"/>
</svg>`;
}
