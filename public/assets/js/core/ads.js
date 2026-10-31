/* =========================================================
   GESTIONE SLOT PUBBLICITARI (Google AdSense)
   - Nessuno script Google viene caricato prima che l'utente
     abbia fatto una scelta nel cookie banner.
   - Senza consenso "ads" gli annunci sono richiesti come
     NON personalizzati (Consent Mode + requestNonPersonalizedAds).
   - Gli slot nascosti (es. sidebar su mobile, slot risultati
     prima della fine del gioco) non vengono riempiti.

   API pubblica (window.PG.ads):
     reveal(key)  mostra e riempie uno slot nascosto (es. "results")
     refresh()    riempie gli slot visibili non ancora riempiti
   ========================================================= */
(function () {
  "use strict";

  var PG = (window.PG = window.PG || {});
  var cfg = PG.adsense || {};
  var CLIENT_RE = /^ca-pub-\d{16}$/;
  var active = !!cfg.enabled && CLIENT_RE.test(cfg.client || "");
  var scriptRequested = false;
  var consentReady = false;

  function slots() {
    return Array.prototype.slice.call(document.querySelectorAll(".ad-slot[data-ad-key]"));
  }

  function isVisible(el) {
    return !el.hidden && el.offsetParent !== null;
  }

  function loadScript() {
    if (scriptRequested) return;
    scriptRequested = true;
    var s = document.createElement("script");
    s.async = true;
    s.crossOrigin = "anonymous";
    s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=" + encodeURIComponent(cfg.client);
    document.head.appendChild(s);
  }

  function fill(slot) {
    if (slot.dataset.adFilled || !isVisible(slot)) return;
    var key = slot.getAttribute("data-ad-key");
    var slotId = cfg.slots && cfg.slots[key];
    if (!slotId) return;
    slot.dataset.adFilled = "1";

    var ins = document.createElement("ins");
    ins.className = "adsbygoogle";
    ins.setAttribute("data-ad-client", cfg.client);
    ins.setAttribute("data-ad-slot", slotId);
    if (key === "rail") {
      ins.style.display = "inline-block";
      ins.style.width = slot.offsetWidth >= 300 ? "300px" : "160px";
      ins.style.height = "600px";
    } else {
      ins.style.display = "block";
      ins.setAttribute("data-ad-format", key === "top" ? "horizontal" : "auto");
      ins.setAttribute("data-full-width-responsive", "true");
    }
    slot.querySelector(".ad-slot__inner").appendChild(ins);
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { console.warn(e); }

    // Se AdSense non trova annunci, chiude lo slot per non lasciare uno spazio vuoto
    new MutationObserver(function (changes, observer) {
      var status = ins.getAttribute("data-ad-status");
      if (status === "unfilled") slot.classList.add("is-unfilled");
      if (status) observer.disconnect();
    }).observe(ins, { attributes: true, attributeFilter: ["data-ad-status"] });
  }

  function refresh() {
    if (!active || !consentReady) return;
    loadScript();
    slots().forEach(fill);
  }

  function markPlaceholders() {
    if (active || !cfg.showPlaceholders) return;
    slots().forEach(function (slot) { slot.classList.add("is-placeholder"); });
  }

  PG.ads = {
    reveal: function (key) {
      slots().forEach(function (slot) {
        if (slot.getAttribute("data-ad-key") === key) slot.hidden = false;
      });
      refresh();
    },
    refresh: refresh
  };

  function init() {
    markPlaceholders();
    if (!active) return;
    PG.consent.onChange(function (state) {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.requestNonPersonalizedAds = state.ads ? 0 : 1;
      consentReady = true;
      refresh();
    });
    // Le sidebar compaiono allargando la finestra: riempirle quando diventano visibili
    var timer;
    window.addEventListener("resize", function () {
      clearTimeout(timer);
      timer = setTimeout(refresh, 400);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
