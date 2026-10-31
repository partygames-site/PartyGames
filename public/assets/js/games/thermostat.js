/* =========================================================
   NUMERO ESATTO / EXACT NUMBER
   Due sfidanti a turno indovinano un numero segreto con
   indizi "più alto / più basso"; il termometro restringe il
   range possibile. Punti salvati nelle prime due squadre.
   Contenuti: assets/data/thermostat.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  players: [$('[data-player="0"]'), $('[data-player="1"]')],
  rangeLabel: $("[data-range-label]"),
  round: $("[data-round]"),
  turn: $("[data-turn]"),
  question: $("[data-question]"),
  scaleLow: $("[data-scale-low]"),
  scaleHigh: $("[data-scale-high]"),
  maskLeft: $("[data-mask-left]"),
  maskRight: $("[data-mask-right]"),
  marker: $("[data-marker]"),
  markerValue: $("[data-marker-value]"),
  low: $("[data-low]"),
  high: $("[data-high]"),
  form: $("[data-guess-form]"),
  guess: $("[data-guess]"),
  error: $("[data-error]"),
  history: $("[data-history]"),
  winTitle: $("[data-win-title]"),
  winLine: $("[data-win-line]"),
  winDetail: $("[data-win-detail]")
};

const deck = createDeck(data.topics);
const state = { round: 0, starter: 0, current: 0, topic: null, low: 0, high: 100, attempts: [0, 0], history: [[], []], active: false };

/* Flash a schermo intero "più alto / più basso" */
const flash = document.createElement("div");
flash.className = "gk-flash";
flash.setAttribute("aria-hidden", "true");
flash.innerHTML = '<span class="gk-flash__arrow"></span><span class="gk-flash__label"></span>';
document.body.appendChild(flash);

/* ---------- Setup ---------- */
root.querySelectorAll("[data-player-label]").forEach((el) => {
  el.textContent = t("player", { n: el.getAttribute("data-player-label") });
});

function fillSetup() {
  const teams = PG.teams.list();
  els.players.forEach((input, i) => { input.value = teams[i].name; });
}

const names = () => PG.teams.list().slice(0, 2).map((team) => team.name);

$("[data-start]").addEventListener("click", () => {
  els.players.forEach((input, i) => {
    const value = input.value.trim();
    if (value && value !== names()[i]) PG.teams.setName(i, value);
  });
  state.round = 0;
  state.starter = 0;
  views.show("play", { focus: false });
  newRound();
});

/* ---------- Tabelloni (solo i due sfidanti) ---------- */
mountScoreboard($("[data-scoreboard]"), { count: 2, highlight: (i) => state.active && i === state.current });
mountScoreboard($("[data-win-scoreboard]"), { count: 2 });

/* ---------- Round ---------- */
function newRound() {
  const topic = state.round === 0 ? deck.current : deck.next();
  state.round++;
  state.topic = topic;
  state.low = topic.min;
  state.high = topic.max;
  state.attempts = [0, 0];
  state.history = [[], []];
  state.current = state.starter;
  state.starter = (state.starter + 1) % 2;
  state.active = true;

  els.question.textContent = topic.q;
  els.question.classList.remove("is-enter"); void els.question.offsetWidth; els.question.classList.add("is-enter");
  els.rangeLabel.textContent = t("rangeLabel", { min: topic.min, max: topic.max });
  els.round.textContent = t("round", { n: state.round });
  els.scaleLow.textContent = topic.min;
  els.scaleHigh.textContent = topic.max;
  els.guess.min = topic.min;
  els.guess.max = topic.max;
  els.guess.placeholder = t("placeholder", { min: topic.min, max: topic.max });
  els.guess.value = "";
  els.guess.disabled = false;
  els.error.textContent = "";
  els.marker.classList.remove("is-shown");

  renderThermo();
  renderTurn();
  renderHistory();
  els.guess.focus({ preventScroll: true });
}

const pct = (v) => ((v - state.topic.min) / (state.topic.max - state.topic.min)) * 100;

function renderThermo() {
  els.maskLeft.style.width = `${pct(state.low)}%`;
  els.maskRight.style.width = `${100 - pct(state.high)}%`;
  els.low.textContent = state.low;
  els.high.textContent = state.high;
}

function renderTurn() {
  els.turn.innerHTML = "";
  const name = names()[state.current];
  const [before, after] = t("turn", { name: "\u0000" }).split("\u0000");
  const span = document.createElement("span");
  span.textContent = name;
  els.turn.append(before, span, after);
  root.querySelectorAll("[data-scoreboard] .gk-score").forEach((card, i) => card.classList.toggle("is-active", state.active && i === state.current));
}

function renderHistory() {
  const n = names();
  els.history.innerHTML = "";
  [0, 1].forEach((i) => {
    const col = document.createElement("div");
    col.className = "gk-history__col";
    const h = document.createElement("h3");
    h.textContent = n[i];
    col.appendChild(h);
    if (!state.history[i].length) {
      const empty = document.createElement("p");
      empty.className = "gk-history__empty";
      empty.textContent = t("noAttempts");
      col.appendChild(empty);
    }
    state.history[i].forEach((entry) => {
      const chip = document.createElement("div");
      chip.className = "gk-history__chip" + (entry.dir === "correct" ? " is-correct" : "");
      const label = entry.dir === "correct" ? `🎯 ${t("correct")}` : entry.dir === "higher" ? `⬆ ${t("higher")}` : `⬇ ${t("lower")}`;
      chip.innerHTML = "<span></span><span></span>";
      chip.firstChild.textContent = entry.value;
      chip.lastChild.textContent = label;
      col.appendChild(chip);
    });
    els.history.appendChild(col);
  });
}

function showFlash(dir) {
  flash.className = `gk-flash is-${dir}`;
  flash.firstChild.textContent = dir === "higher" ? "⬆" : "⬇";
  flash.lastChild.textContent = dir === "higher" ? t("higher") : t("lower");
  void flash.offsetWidth;
  flash.classList.add("is-on");
}

els.form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!state.active) return;
  const raw = els.guess.value.trim();
  const num = Number(raw);
  const { min, max, answer } = state.topic;
  if (raw === "" || !Number.isInteger(num) || num < min || num > max) {
    els.error.textContent = `⚠️ ${t("error", { min, max })}`;
    els.guess.focus();
    return;
  }
  els.error.textContent = "";

  const player = state.current;
  state.attempts[player]++;
  els.marker.style.left = `${pct(num)}%`;
  els.markerValue.textContent = num;
  els.marker.classList.add("is-shown");

  if (num === answer) {
    state.history[player].push({ value: num, dir: "correct" });
    win(player);
    return;
  }

  const dir = num < answer ? "higher" : "lower";
  state.history[player].push({ value: num, dir });
  if (dir === "higher") state.low = Math.max(state.low, num + 1);
  else state.high = Math.min(state.high, num - 1);
  beep(dir === "higher" ? 660 : 330, 0.18);
  showFlash(dir);

  state.current = (player + 1) % 2;
  els.guess.value = "";
  renderThermo();
  renderTurn();
  renderHistory();
  els.guess.focus({ preventScroll: true });
});

/* ---------- Vittoria ---------- */
function win(player) {
  state.active = false;
  els.guess.disabled = true;
  PG.teams.addScore(player, 1);
  const n = names();
  const other = (player + 1) % 2;
  els.winTitle.textContent = `🏆 ${t("winTitle", { name: n[player] })}`;
  els.winLine.textContent = t("winLine", { n: state.topic.answer, k: state.attempts[player] });
  els.winDetail.textContent = t("winDetail", { name: n[other], k: state.attempts[other] });
  beep(880, 0.4);
  views.show("win");
  celebrate();
  PG.ads.reveal("results");
}

$("[data-reveal]").addEventListener("click", () => {
  if (!state.active) return;
  if (window.confirm(t("revealConfirm", { n: state.topic.answer }))) newRound();
});

$("[data-new-round]").addEventListener("click", () => {
  views.show("play", { focus: false });
  newRound();
});

$("[data-change]").addEventListener("click", () => {
  fillSetup();
  views.show("setup");
});

fillSetup();
views.show("setup", { focus: false });
