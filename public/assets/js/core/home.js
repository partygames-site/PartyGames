/* =========================================================
   HOMEPAGE — filtri per categoria e "Scegli a caso"
   Le card sono già nell'HTML (generate in build per la SEO):
   qui si aggiunge solo l'interattività.
   ========================================================= */
(function () {
  "use strict";

  var ui = window.PG.ui;

  function init() {
    var grid = document.querySelector("[data-game-grid]");
    if (!grid) return;
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".game-card"));
    var chips = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
    var toastEl = document.querySelector("[data-toast]");
    var shuffling = false;

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var filter = chip.getAttribute("data-filter");
        chips.forEach(function (c) {
          var on = c === chip;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", String(on));
        });
        cards.forEach(function (card) {
          var cats = card.getAttribute("data-categories").split(" ");
          card.classList.toggle("is-filtered", filter !== "all" && cats.indexOf(filter) === -1);
        });
      });
    });

    document.querySelectorAll("[data-random-game]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (shuffling) return;
        var pool = cards.filter(function (c) { return c.getAttribute("data-live") === "true"; });
        if (!pool.length) {
          ui.toast(toastEl, ui.t("randomNone"));
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        shuffle(pool, toastEl);
      });
    });

    /* Animazione: evidenzia card a caso per ~1,6 s, poi si ferma sulla scelta */
    function shuffle(pool, toastEl) {
      shuffling = true;
      cards.forEach(function (c) { c.classList.remove("is-filtered", "is-chosen"); });
      chips.forEach(function (c) { c.classList.toggle("is-active", c.getAttribute("data-filter") === "all"); });
      grid.scrollIntoView({ behavior: "smooth", block: "start" });

      var steps = 14;
      var i = 0;
      var prev = null;
      (function tick() {
        if (prev) prev.classList.remove("is-shuffling");
        var card = pool[Math.floor(Math.random() * pool.length)];
        if (i < steps) {
          card.classList.add("is-shuffling");
          prev = card;
          i++;
          setTimeout(tick, 60 + i * 12);
          return;
        }
        card.classList.add("is-chosen");
        card.scrollIntoView({ behavior: "smooth", block: "center" });
        ui.toast(toastEl, ui.t("randomPicked", { title: card.getAttribute("data-title") }));
        var link = card.querySelector("a");
        setTimeout(function () {
          shuffling = false;
          if (link) window.location.href = link.href;
        }, 1800);
      })();
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
