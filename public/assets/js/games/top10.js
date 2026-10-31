/* =========================================================
   INDOVINA LA TOP 10 / GUESS THE TOP 10
   Una classifica nascosta di 10 posizioni: a turno ogni squadra dice
   una risposta, il conduttore la scrive. Risposta in classifica = la
   casella si gira e vale 11 - posizione punti; sbagliata = turno alla
   squadra successiva. A fine partita chi ha più punti guadagna +1
   nella classifica generale.
   Contenuti: assets/data/top10.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  counter: $("[data-counter]"), title: $("[data-title]"), turn: $("[data-turn]"), local: $("[data-local]"), board: $("[data-board]"),
  form: $("[data-form]"), answer: $("[data-answer]"), feedback: $("[data-feedback]"), resultTitle: $("[data-result-title]"), ranking: $("[data-ranking]")
};

/* ---------- Riconoscimento tollerante ---------- */
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
function lev(a, b) {
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
const maxDist = (len) => (len <= 3 ? 0 : len <= 5 ? 1 : len <= 9 ? 2 : 3);
function similar(input, target) {
  const a = norm(input), b = norm(target);
  if (!a || !b) return false;
  if (a === b) return true;
  const aw = a.split(" "), bw = b.split(" ");
  if (aw.length > 1 || bw.length > 1) {
    const [short, long] = aw.length <= bw.length ? [aw, bw] : [bw, aw];
    if (short.join("").length >= 4 && short.every((w) => long.includes(w))) return true;
  }
  return lev(a, b) <= maxDist(b.length);
}
function score(input, item) {
  const a = norm(input);
  if (a === norm(item.name)) return 3;
  if (item.alt.some((c) => a === norm(c))) return 2;
  if (similar(input, item.name)) return 1;
  if (item.alt.some((c) => similar(input, c))) return 0.5;
  return 0;
}
function findItem(input, items, revealed) {
  let best = -1, bestScore = 0;
  items.forEach((it, i) => {
    const s = score(input, it);
    if (s > bestScore || (s && s === bestScore && revealed[best] && !revealed[i])) { best = i; bestScore = s; }
  });
  return best;
}

/* ---------- Stato ---------- */
const deck = createDeck(data.categories);
const parse = (raw) => { const [name, ...alt] = raw.split("|"); return { name, alt }; };
const state = { round: 0, turn: 0, items: [], revealed: [], done: false, points: [] };
const teams = () => PG.teams.list();
const teamAt = (i) => teams()[i % teams().length];

const flash = document.createElement("div");
flash.className = "gk-flash-wrong";
flash.setAttribute("aria-hidden", "true");
document.body.append(flash);

function renderLocal() {
  els.local.innerHTML = "";
  teams().forEach((tm, i) => {
    const card = document.createElement("div");
    card.className = "gk-score" + (!state.done && i === state.turn % teams().length ? " is-active" : "");
    card.style.setProperty("--team-color", tm.color);
    card.append(Object.assign(document.createElement("span"), { className: "gk-score__name", textContent: tm.name }),
      Object.assign(document.createElement("output"), { className: "gk-score__value", textContent: state.points[i] || 0 }));
    els.local.append(card);
  });
  els.turn.textContent = state.done ? "" : t("turn", { name: teamAt(state.turn).name });
}

function feedback(kind, text) {
  els.feedback.className = `tt-feedback is-${kind}`;
  els.feedback.textContent = text;
}

function load(cat) {
  state.round++;
  state.items = cat.items.map(parse);
  state.revealed = state.items.map(() => null);
  state.done = false;
  els.counter.textContent = t("counter", { n: state.round });
  els.title.textContent = cat.title;
  els.title.classList.remove("is-enter"); void els.title.offsetWidth; els.title.classList.add("is-enter");
  els.board.innerHTML = "";
  state.items.forEach((it, i) => {
    const box = document.createElement("div");
    box.className = "tt-box";
    box.innerHTML = `<div class="tt-box__inner"><div class="tt-face tt-face--front"></div><div class="tt-face tt-face--back"><span></span><b></b></div></div>`;
    box.querySelector(".tt-face--front").textContent = i + 1;
    box.querySelector(".tt-face--back span").textContent = `${i + 1}. ${it.name}`;
    box.querySelector(".tt-face--back b").textContent = t("points", { n: 10 - i });
    els.board.append(box);
  });
  els.answer.disabled = false;
  els.answer.value = "";
  feedback("", "");
  renderLocal();
  els.answer.focus({ preventScroll: true });
}

function flip(i, scored) {
  const box = els.board.children[i];
  box.classList.add("is-flipped");
  if (!scored) box.classList.add("is-shown");
}

function next() { state.turn = (state.turn + 1) % teams().length; }

function wrong() {
  if (state.done) return;
  flash.classList.remove("is-on"); void flash.offsetWidth; flash.classList.add("is-on");
  beep(160, 0.4, "sawtooth");
  feedback("wrong", t("miss"));
  els.answer.value = "";
  next();
  renderLocal();
  els.answer.focus({ preventScroll: true });
}

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (state.done) return;
  const raw = els.answer.value;
  if (!norm(raw)) { wrong(); return; }
  const idx = findItem(raw, state.items, state.revealed);
  if (idx < 0) { wrong(); return; }
  if (state.revealed[idx]) {
    feedback("dup", t("duplicate", { name: state.items[idx].name }));
    els.answer.value = "";
    return;
  }
  const k = state.turn % teams().length;
  const pts = 10 - idx;
  state.revealed[idx] = "scored";
  state.points[k] = (state.points[k] || 0) + pts;
  flip(idx, true);
  beep(880, 0.15); setTimeout(() => beep(1175, 0.2), 120);
  feedback("correct", t("correct", { n: pts, name: teamAt(k).name }));
  els.answer.value = "";
  next();
  if (state.revealed.every(Boolean)) { state.done = true; els.answer.disabled = true; feedback("correct", t("complete")); celebrate(1500); }
  renderLocal();
});

els.answer.addEventListener("keydown", (e) => { if (e.key === "Escape") { e.preventDefault(); wrong(); } });
$("[data-wrong]").addEventListener("click", wrong);

$("[data-show-all]").addEventListener("click", () => {
  if (state.done) return;
  state.items.forEach((_, i) => { if (!state.revealed[i]) { state.revealed[i] = "shown"; flip(i, false); } });
  state.done = true;
  els.answer.disabled = true;
  feedback("dup", t("shown"));
  renderLocal();
});

$("[data-next]").addEventListener("click", () => load(deck.next()));

/* ---------- Fine partita: +1 in classifica generale al vincitore ---------- */
$("[data-end]").addEventListener("click", () => {
  if (!window.confirm(t("endConfirm"))) return;
  const list = teams().map((tm, i) => ({ tm, i, pts: state.points[i] || 0 })).sort((a, b) => b.pts - a.pts);
  const top = list[0].pts;
  const winners = list.filter((x) => x.pts === top && top > 0);
  winners.forEach((w) => PG.teams.addScore(w.i, 1));
  els.resultTitle.textContent = winners.length > 1
    ? t("resultTie", { names: winners.map((w) => w.tm.name).join(t("joiner")) })
    : t("resultTitle", { name: (winners[0] || list[0]).tm.name });
  els.ranking.innerHTML = "";
  list.forEach(({ tm, pts }) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", tm.color);
    li.append(Object.assign(document.createElement("span"), { textContent: tm.name }), Object.assign(document.createElement("strong"), { textContent: t("points", { n: pts }) }));
    els.ranking.append(li);
  });
  views.show("result");
  if (winners.length) celebrate();
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  state.round = 0;
  state.turn = 0;
  state.points = [];
  views.show("play", { focus: false });
  load(deck.next());
});

mountScoreboard($("[data-scoreboard]"));
PG.teams.onChange(renderLocal);
load(deck.current);
