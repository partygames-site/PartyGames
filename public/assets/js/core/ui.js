/* =========================================================
   UTILITÀ DI INTERFACCIA CONDIVISE (window.PG.ui)
     t(key, vars)        testo tradotto con segnaposto {nome}
     toast(el, text)     messaggio temporaneo in un elemento
     storage             localStorage protetto da try/catch
   ========================================================= */
(function () {
  "use strict";

  var PG = (window.PG = window.PG || {});
  var strings = PG.strings || {};

  function t(key, vars) {
    var text = strings[key] != null ? String(strings[key]) : key;
    if (vars) {
      Object.keys(vars).forEach(function (k) {
        text = text.split("{" + k + "}").join(vars[k]);
      });
    }
    return text;
  }

  var toastTimers = new WeakMap();
  function toast(el, text, ms) {
    if (!el) return;
    el.textContent = text;
    el.hidden = false;
    clearTimeout(toastTimers.get(el));
    toastTimers.set(el, setTimeout(function () { el.hidden = true; }, ms || 3500));
  }

  /* Tutti i dati dei giochi vanno salvati con prefisso "pg_"
     (documentato nella Cookie Policy). */
  var storage = {
    get: function (key, fallback) {
      try {
        var raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch (e) { return false; }
    },
    remove: function (key) {
      try { localStorage.removeItem(key); } catch (e) { /* ignorato */ }
    }
  };

  PG.ui = { t: t, toast: toast, storage: storage };
})();
