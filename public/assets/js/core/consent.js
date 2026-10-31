/* =========================================================
   CONSENSO COOKIE + GOOGLE CONSENT MODE v2
   Caricato in <head> SENZA defer: imposta subito i default
   "denied" prima che qualsiasi tag Google possa partire.

   API pubblica (window.PG.consent):
     get()              → { analytics, ads, decided }
     open()             → riapre il pannello delle preferenze
     onChange(fn)       → fn(state) a ogni scelta (e subito se già decisa)

   NOTA PRODUZIONE: per servire annunci personalizzati a utenti
   di SEE, Regno Unito e Svizzera Google richiede una CMP
   certificata IAB TCF v2.2 (es. "Privacy e messaggi" nel pannello
   AdSense). Questo banner gestisce Consent Mode v2 ed è pensato
   come soluzione leggera; vedi README.
   ========================================================= */
(function () {
  "use strict";

  var PG = (window.PG = window.PG || {});
  var cfg = PG.consent || { version: 1, maxAgeDays: 180 };
  var STORAGE_KEY = "pg_consent";
  var listeners = [];

  // --- Consent Mode v2: default tutto negato -------------------------
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    functionality_storage: "granted",
    security_storage: "granted",
    wait_for_update: 500
  });
  window.gtag("set", "ads_data_redaction", true);

  // --- Stato salvato ------------------------------------------------
  function read() {
    try {
      var data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      var maxAge = cfg.maxAgeDays * 24 * 60 * 60 * 1000;
      if (data && data.v === cfg.version && Date.now() - data.ts < maxAge) return data;
    } catch (e) { /* storage non disponibile o dati corrotti */ }
    return null;
  }

  function write(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        v: cfg.version, ts: Date.now(), analytics: !!state.analytics, ads: !!state.ads
      }));
    } catch (e) { /* in navigazione privata la scelta vale solo per questa pagina */ }
  }

  var current = read();

  function publicState() {
    return {
      decided: !!current,
      analytics: !!(current && current.analytics),
      ads: !!(current && current.ads)
    };
  }

  function applyToGoogle(state) {
    window.gtag("consent", "update", {
      ad_storage: state.ads ? "granted" : "denied",
      ad_user_data: state.ads ? "granted" : "denied",
      ad_personalization: state.ads ? "granted" : "denied",
      analytics_storage: state.analytics ? "granted" : "denied"
    });
  }

  if (current) applyToGoogle(current);

  function decide(state) {
    current = { analytics: !!state.analytics, ads: !!state.ads };
    write(current);
    applyToGoogle(current);
    var snapshot = publicState();
    listeners.forEach(function (fn) { try { fn(snapshot); } catch (e) { console.error(e); } });
  }

  PG.consent = {
    get: publicState,
    onChange: function (fn) {
      listeners.push(fn);
      if (current) fn(publicState());
    },
    open: function () { showBanner(true); }
  };

  // --- Banner -------------------------------------------------------
  var banner, summaryView, prefsView, form, lastFocus;

  function setView(prefs) {
    summaryView.hidden = prefs;
    prefsView.hidden = !prefs;
    banner.querySelector('[data-consent="customize"]').hidden = prefs;
    banner.querySelector('[data-consent="save"]').hidden = !prefs;
    if (prefs) {
      var s = publicState();
      form.elements.analytics.checked = s.analytics;
      form.elements.ads.checked = s.ads;
    }
  }

  function showBanner(prefs) {
    if (!banner) return;
    lastFocus = document.activeElement;
    setView(!!prefs);
    banner.hidden = false;
    var first = banner.querySelector(prefs ? ".switch" : '[data-consent="accept"]');
    if (first && prefs !== undefined) first.focus({ preventScroll: true });
  }

  function hideBanner() {
    banner.hidden = true;
    if (lastFocus && lastFocus !== document.body && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  }

  function init() {
    banner = document.getElementById("consent");
    if (!banner) return;
    summaryView = banner.querySelector('[data-consent-view="summary"]');
    prefsView = banner.querySelector('[data-consent-view="prefs"]');
    form = prefsView;

    banner.addEventListener("click", function (event) {
      var btn = event.target.closest("[data-consent]");
      if (!btn) return;
      switch (btn.getAttribute("data-consent")) {
        case "accept": decide({ analytics: true, ads: true }); hideBanner(); break;
        case "reject": decide({ analytics: false, ads: false }); hideBanner(); break;
        case "customize": setView(true); form.querySelector(".switch").focus(); break;
        case "save":
          decide({ analytics: form.elements.analytics.checked, ads: form.elements.ads.checked });
          hideBanner();
          break;
      }
    });
    form.addEventListener("submit", function (e) { e.preventDefault(); });

    banner.addEventListener("keydown", function (event) {
      // Esc chiude solo se una scelta esiste già (altrimenti serve una decisione esplicita)
      if (event.key === "Escape" && current) hideBanner();
    });

    document.addEventListener("click", function (event) {
      if (event.target.closest("[data-consent-open]")) {
        event.preventDefault();
        showBanner(true);
      }
    });

    if (!current) showBanner();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
