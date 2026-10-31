/* =========================================================
   SQUADRE GLOBALI — nomi, colori e punteggi condivisi da
   tutti i giochi a squadre (salvati solo in localStorage).

   API pubblica (window.PG.teams):
     list()                 → [{ name, color, score }] squadre attive
     addScore(index, delta) modifica il punteggio di una squadra
     resetScores()          azzera tutti i punteggi
     setCount(n)            imposta il numero di squadre (2–6)
     setName(index, name)   rinomina una squadra
     count()                numero di squadre attive
     onChange(fn)           fn(list) a ogni modifica

   Se nella pagina c'è un elemento [data-teams-panel] viene
   disegnato il pannello di gestione (vedi homepage).
   ========================================================= */
(function () {
  "use strict";

  var PG = (window.PG = window.PG || {});
  var ui = PG.ui;
  var KEY = "partyGamesTeams";
  var MIN = 2;
  var MAX = 6;
  var COLORS = ["#22d3ee", "#ec4899", "#ffc247", "#7cff6b", "#b06aff", "#ff6f4d"];
  var listeners = [];

  function defaults() {
    return { count: 2, teams: [blank(0), blank(1)] };
  }
  function blank(i) {
    return { name: "", color: COLORS[i % COLORS.length], score: 0 };
  }

  function load() {
    var data = ui.storage.get(KEY, null);
    if (!data || !Array.isArray(data.teams) || data.teams.length < MIN) return defaults();
    data.count = Math.min(MAX, Math.max(MIN, data.count | 0));
    while (data.teams.length < data.count) data.teams.push(blank(data.teams.length));
    return data;
  }

  var state = load();

  function save() {
    ui.storage.set(KEY, state);
    var snapshot = list();
    listeners.forEach(function (fn) { fn(snapshot); });
  }

  function displayName(team, i) {
    return team.name && team.name.trim() ? team.name.trim() : ui.t("teamDefault", { n: i + 1 });
  }

  function list() {
    return state.teams.slice(0, state.count).map(function (team, i) {
      return { name: displayName(team, i), color: team.color, score: team.score };
    });
  }

  function setCount(n) {
    n = Math.min(MAX, Math.max(MIN, n | 0));
    while (state.teams.length < n) state.teams.push(blank(state.teams.length));
    state.count = n;
    save();
  }

  function addScore(index, delta) {
    var team = state.teams[index];
    if (!team) return;
    team.score = Math.max(0, team.score + delta);
    save();
  }

  function resetScores() {
    state.teams.forEach(function (team) { team.score = 0; });
    save();
  }

  // Sincronizza più schede aperte contemporaneamente
  window.addEventListener("storage", function (event) {
    if (event.key !== KEY) return;
    state = load();
    var snapshot = list();
    listeners.forEach(function (fn) { fn(snapshot); });
  });

  PG.teams = {
    list: list,
    setCount: setCount,
    addScore: addScore,
    resetScores: resetScores,
    count: function () { return state.count; },
    onChange: function (fn) { listeners.push(fn); },
    setName: function (i, name) {
      while (state.teams.length <= i) state.teams.push(blank(state.teams.length));
      state.teams[i].name = String(name).slice(0, 20);
      save();
    },
    _setColor: function (i, color) { state.teams[i].color = color; save(); }
  };

  /* ---------------- Pannello di gestione ---------------- */
  function renderPanel(panel) {
    var countRow = panel.querySelector("[data-teams-count]");
    var grid = panel.querySelector("[data-teams-grid]");

    function drawCount() {
      countRow.innerHTML = "";
      for (var n = MIN; n <= MAX; n++) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "chip" + (state.count === n ? " is-active" : "");
        btn.setAttribute("aria-pressed", String(state.count === n));
        btn.textContent = ui.t("teamsCount", { n: n });
        btn.dataset.count = n;
        countRow.appendChild(btn);
      }
    }

    function drawGrid() {
      grid.innerHTML = "";
      state.teams.slice(0, state.count).forEach(function (team, i) {
        var name = displayName(team, i);
        var card = document.createElement("div");
        card.className = "team-card";
        card.style.setProperty("--team-color", team.color);

        var nameRow = document.createElement("div");
        nameRow.className = "team-card__name";
        var color = document.createElement("input");
        color.type = "color";
        color.value = team.color;
        color.dataset.i = i;
        color.setAttribute("aria-label", ui.t("teamColor") + " " + (i + 1));
        var text = document.createElement("input");
        text.type = "text";
        text.maxLength = 20;
        text.value = team.name;
        text.placeholder = ui.t("teamDefault", { n: i + 1 });
        text.dataset.i = i;
        text.setAttribute("aria-label", ui.t("teamName") + " " + (i + 1));
        nameRow.append(color, text);

        var scoreRow = document.createElement("div");
        scoreRow.className = "team-card__score";
        var out = document.createElement("output");
        out.textContent = team.score + " " + ui.t("points");
        var btns = document.createElement("div");
        [["−", -1, "teamMinus"], ["+", 1, "teamPlus"]].forEach(function (b) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.textContent = b[0];
          btn.dataset.i = i;
          btn.dataset.delta = b[1];
          btn.setAttribute("aria-label", ui.t(b[2], { name: name }));
          btns.appendChild(btn);
        });
        scoreRow.append(out, btns);

        card.append(nameRow, scoreRow);
        grid.appendChild(card);
      });
    }

    countRow.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-count]");
      if (!btn) return;
      setCount(+btn.dataset.count);
      drawCount();
      drawGrid();
    });

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-delta]");
      if (!btn) return;
      addScore(+btn.dataset.i, +btn.dataset.delta);
      drawGrid();
      var again = grid.querySelector('[data-i="' + btn.dataset.i + '"][data-delta="' + btn.dataset.delta + '"]');
      if (again) again.focus();
    });

    grid.addEventListener("input", function (e) {
      var i = +e.target.dataset.i;
      if (e.target.type === "text") PG.teams.setName(i, e.target.value);
      if (e.target.type === "color") {
        PG.teams._setColor(i, e.target.value);
        e.target.closest(".team-card").style.setProperty("--team-color", e.target.value);
      }
    });

    var reset = panel.querySelector("[data-teams-reset]");
    if (reset) reset.addEventListener("click", function () {
      if (window.confirm(ui.t("resetConfirm"))) { resetScores(); drawGrid(); }
    });

    // Ridisegna se le squadre cambiano altrove (tabellone di un gioco, altra scheda),
    // ma non mentre l'utente sta scrivendo dentro il pannello
    PG.teams.onChange(function () {
      if (panel.contains(document.activeElement) && document.activeElement.tagName === "INPUT") return;
      drawCount();
      drawGrid();
    });

    drawCount();
    drawGrid();
  }

  function init() {
    document.querySelectorAll("[data-teams-panel]").forEach(renderPanel);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
