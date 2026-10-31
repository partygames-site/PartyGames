/* =========================================================
   GOOGLE ANALYTICS 4 — caricato solo se:
   1) è configurato un ID (src/config.mjs → analytics.gaId)
   2) l'utente ha dato il consenso alle statistiche
   ========================================================= */
(function () {
  "use strict";

  var PG = window.PG || {};
  var gaId = PG.analytics && PG.analytics.gaId;
  var loaded = false;

  if (!gaId || !/^G-[A-Z0-9]+$/.test(gaId)) return;

  function load() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(gaId);
    document.head.appendChild(s);
    window.gtag("js", new Date());
    window.gtag("config", gaId);
  }

  PG.consent.onChange(function (state) {
    if (state.analytics) load();
  });
})();
