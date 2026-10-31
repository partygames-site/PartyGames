/* =========================================================
   L'INTRUSO / ODD ONE OUT
   Una domanda e 10 carte coperte: 9 rispettano il tratto descritto,
   una no. A turno ogni squadra gira una carta: verde = salva, rossa =
   intruso. Chi trova l'intruso perde il round, le altre prendono +1.
   Le carte usano emoji o avatar con iniziali generati in CSS.
   Contenuti: assets/data/intruso.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createViews, mountScoreboard, shuffle, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);
const YEAR = new Date().getFullYear();

const els = {
  modes: $("[data-modes]"), counter: $("[data-counter]"), tag: $("[data-tag]"), question: $("[data-question]"),
  turn: $("[data-turn]"), cards: $("[data-cards]"), showAll: $("[data-show-all]"), next: $("[data-next]"),
  skip: $("[data-skip]"), ranking: $("[data-ranking]"), resultLine: $("[data-result-line]")
};

const nf = (v) => v.toLocaleString(data.locale, { maximumFractionDigits: 2 });
const isLogic = (q) => q.items.every((s) => /^[01]$/.test(s.split("|")[1]));
const teams = () => PG.teams.list();
// Se nel pannello cambia il numero di squadre a metà domanda, il turno resta valido
const teamAt = (i) => teams()[i % teams().length];

/* ---------- Domanda: dalle stringhe alle carte, con l'intruso calcolato ---------- */
function build(src) {
  const cards = src.items.map((s) => {
    const [name, raw, info, emoji] = s.split("|");
    const age = raw.startsWith("y");
    const value = age ? YEAR - parseInt(raw.slice(1), 10) : parseFloat(raw);
    const label = info || (age ? t("years", { n: value }) : `${nf(value)} ${src.unit}`.trim());
    return { name, value, label, emoji };
  });
  const odd = cards.reduce((x, y) => ((src.t === "max" ? y.value > x.value : y.value < x.value) ? y : x));
  cards.forEach((c) => { c.intruder = c === odd; });
  return { ...src, cards: shuffle(cards) };
}

/* ---------- Avatar: emoji, oppure iniziali su gradiente calcolato dal nome ---------- */
function avatar(card) {
  const el = document.createElement("span");
  el.className = "in-avatar";
  el.setAttribute("aria-hidden", "true");
  if (card.emoji) { el.textContent = card.emoji; return el; }
  const words = card.name.replace(/[()]/g, "").split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w));
  el.textContent = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : card.name.slice(0, 2)).toUpperCase();
  let h = 0;
  for (const ch of card.name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  el.classList.add("is-initials");
  el.style.setProperty("--av", `linear-gradient(140deg, hsl(${h} 70% 52%), hsl(${(h + 40) % 360} 70% 38%))`);
  return el;
}

/* ---------- Stato ---------- */
let mode = "all";
const pool = () => data.questions.filter((q) => mode === "all" || (mode === "logic") === isLogic(q));
let queue = shuffle(pool());
let qPos = 0;
const state = { count: 0, starter: -1, turn: 0, question: null, phase: "play", loser: -1, safe: 0 };

function renderModes() {
  els.modes.innerHTML = "";
  for (const key of ["all", "numbers", "logic"]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (mode === key ? " is-active" : "");
    b.setAttribute("aria-pressed", String(mode === key));
    b.textContent = data.ui.modes[key];
    b.addEventListener("click", () => {
      if (mode === key) return;
      mode = key;
      queue = shuffle(pool());
      qPos = 0;
      renderModes();
      nextQuestion();
    });
    els.modes.append(b);
  }
}

function setTurn(text, kind) {
  els.turn.textContent = text;
  els.turn.className = "gk-turn" + (kind ? ` is-${kind}` : "");
}

const scoreboard = mountScoreboard($("[data-scoreboard]"), { highlight: (i) => state.phase === "play" && i === state.turn });

function nextQuestion() {
  if (qPos >= queue.length) { queue = shuffle(pool()); qPos = 0; }
  const n = teams().length;
  state.question = build(queue[qPos++]);
  state.count++;
  state.starter = (state.starter + 1) % n;
  state.turn = state.starter;
  state.phase = "play";
  state.loser = -1;
  state.safe = 0;
  els.counter.textContent = t("counter", { n: state.count });
  els.tag.textContent = `${state.question.icon} ${isLogic(state.question) ? t("typeLogic") : t("typeNumbers")}`;
  els.question.textContent = state.question.q;
  els.question.classList.remove("is-enter"); void els.question.offsetWidth; els.question.classList.add("is-enter");
  renderCards();
  setTurn(t("turn", { name: teamAt(state.turn).name }));
  scoreboard.redraw();
  els.showAll.hidden = true;
  els.next.hidden = true;
  els.skip.hidden = false;
}

function renderCards() {
  els.cards.innerHTML = "";
  state.question.cards.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "in-flip";
    btn.dataset.i = i;
    btn.setAttribute("aria-label", c.name);
    const inner = document.createElement("span");
    inner.className = "in-flip__inner";
    const front = document.createElement("span");
    front.className = "in-face in-face--front";
    front.append(avatar(c), Object.assign(document.createElement("span"), { className: "in-name", textContent: c.name }),
      Object.assign(document.createElement("span"), { className: "in-tap", textContent: t("tap") }));
    const back = document.createElement("span");
    back.className = "in-face in-face--back";
    back.append(avatar(c), Object.assign(document.createElement("span"), { className: "in-name", textContent: c.name }),
      Object.assign(document.createElement("span"), { className: "in-value", textContent: c.label }),
      Object.assign(document.createElement("span"), { className: "in-badge" }),
      Object.assign(document.createElement("span"), { className: "in-by" }));
    inner.append(front, back);
    btn.append(inner);
    els.cards.append(btn);
  });
}

function reveal(i, by) {
  const c = state.question.cards[i];
  const el = els.cards.querySelector(`[data-i="${i}"]`);
  if (!el || c.revealed) return;
  c.revealed = true;
  el.classList.add("is-revealed", c.intruder ? "is-intruder" : "is-safe");
  el.disabled = true;
  el.querySelector(".in-badge").textContent = c.intruder ? t("intruder") : t("safe");
  el.setAttribute("aria-label", `${c.name}: ${c.label} — ${c.intruder ? t("intruder") : t("safe")}`);
  if (by != null) el.querySelector(".in-by").textContent = t("by", { name: teamAt(by).name });
  else el.classList.add("is-late");
}

els.cards.addEventListener("click", (e) => {
  const el = e.target.closest(".in-flip");
  if (!el || el.disabled || state.phase !== "play") return;
  const i = Number(el.dataset.i);
  const c = state.question.cards[i];
  const who = state.turn;
  reveal(i, who);
  if (c.intruder) { el.classList.add("is-boom"); lose(who, false); return; }
  beep(660, 0.12); setTimeout(() => beep(880, 0.16), 110);
  state.safe++;
  state.turn = (state.turn + 1) % teams().length;
  if (state.safe === state.question.cards.length - 1) {
    // resta solo l'intruso: la squadra di turno è costretta a prenderlo
    state.phase = "forced";
    setTurn(t("forced", { name: teamAt(state.turn).name }));
    scoreboard.redraw();
    const last = state.question.cards.findIndex((x) => !x.revealed);
    setTimeout(() => {
      reveal(last, state.turn);
      els.cards.querySelector(`[data-i="${last}"]`).classList.add("is-boom");
      lose(state.turn, true);
    }, 800);
    return;
  }
  setTurn(t("safeNext", { name: teamAt(state.turn).name }), "ok");
  scoreboard.redraw();
});

function lose(loser, forced) {
  state.phase = "over";
  state.loser = loser;
  beep(220, 0.25, "sawtooth"); setTimeout(() => beep(140, 0.45, "sawtooth"), 180);
  const list = teams();
  const winners = list.map((tm, i) => ({ tm, i })).filter((x) => x.i !== loser);
  winners.forEach(({ i }) => PG.teams.addScore(i, 1));
  const names = winners.map((x) => x.tm.name).join(t("joiner"));
  setTurn(t(forced ? "forcedFound" : "found", { name: list[loser].name, winners: names }), "ko");
  celebrate(1500);
  els.showAll.hidden = !state.question.cards.some((c) => !c.revealed);
  els.next.hidden = false;
  els.skip.hidden = true;
}

els.showAll.addEventListener("click", () => {
  state.question.cards.forEach((c, i) => { if (!c.revealed) setTimeout(() => reveal(i, null), i * 90); });
  els.showAll.hidden = true;
});
els.next.addEventListener("click", nextQuestion);
els.skip.addEventListener("click", () => {
  if (state.phase !== "play") return;
  state.question.cards.forEach((c, i) => { if (!c.revealed) setTimeout(() => reveal(i, null), i * 70); });
  state.phase = "over";
  scoreboard.redraw();
  setTurn(t("skipped"));
  els.next.hidden = false;
  els.skip.hidden = true;
});

$("[data-end]").addEventListener("click", () => {
  els.ranking.innerHTML = "";
  teams().slice().sort((a, b) => b.score - a.score).forEach((tm) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", tm.color);
    li.append(Object.assign(document.createElement("span"), { textContent: tm.name }), Object.assign(document.createElement("strong"), { textContent: tm.score }));
    els.ranking.append(li);
  });
  els.resultLine.textContent = t("resultLine", { n: state.count });
  views.show("result");
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  state.count = 0;
  views.show("play", { focus: false });
  nextQuestion();
});

renderModes();
nextQuestion();
