/* =========================================================
   IL PICCO / THE PEAK
   Un attore, regista o artista: il gruppo prova a indovinare il suo
   film con il voto IMDb più alto o la sua canzone più ascoltata.
   Ogni tentativo valido mostra il punteggio reale; chi trova il
   picco (la squadra di turno) guadagna +1. Poi compare la Top 5.
   Contenuti: assets/data/il-picco.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  filters: $("[data-filters]"), counter: $("[data-counter]"), turn: $("[data-turn]"), avatar: $("[data-avatar]"),
  name: $("[data-name]"), challenge: $("[data-challenge]"), top5: $("[data-top5]"), top5Title: $("[data-top5-title]"),
  top5List: $("[data-top5-list]"), form: $("[data-form]"), guess: $("[data-guess]"), attempts: $("[data-attempts]"),
  reveal: $("[data-reveal]"), ranking: $("[data-ranking]"), resultLine: $("[data-result-line]")
};

/* ---------- Confronto tollerante dei titoli ---------- */
const norm = (s) => String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s]/g, "").replace(/\s+/g, " ").trim();
function lev(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  }
  return dp[a.length][b.length];
}
function fuzzy(input, candidate) {
  const a = norm(input), b = norm(candidate);
  if (!a || !b) return false;
  if (a === b) return true;
  if (Math.min(a.length, b.length) >= 5 && (a.includes(b) || b.includes(a))) return true;
  return lev(a, b) <= Math.min(3, Math.max(1, Math.round(Math.max(a.length, b.length) * 0.18)));
}

const parse = (raw) => { const [title, score, ...aliases] = raw.split("|"); return { title, score: Number(score), aliases }; };

/* ---------- Avatar con iniziali (nessuna foto) ---------- */
function avatar(name) {
  const el = document.createElement("span");
  el.className = "in-avatar is-initials";
  el.setAttribute("aria-hidden", "true");
  const words = name.split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w));
  el.textContent = (words.length > 1 ? words[0][0] + words[words.length - 1][0] : name.slice(0, 2)).toUpperCase();
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  el.style.setProperty("--av", `linear-gradient(140deg, hsl(${h} 70% 52%), hsl(${(h + 40) % 360} 70% 38%))`);
  return el;
}

/* ---------- Stato ---------- */
let filter = "all";
const pool = () => data.subjects.filter((s) => filter === "all" || s.type === filter);
const deck = createDeck(pool());
let subject = null, items = [], solved = false, round = 0, turn = -1;
const teams = () => PG.teams.list();
const teamAt = (i) => teams()[i % teams().length];
const score = (it) => subject.type === "imdb"
  ? `${it.score.toLocaleString(data.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${t("imdbUnit")}`
  : `${it.score.toLocaleString(data.locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ${t("spotifyUnit")}`;

const scoreboard = mountScoreboard($("[data-scoreboard]"), { highlight: (i) => !solved && i === turn % teams().length });

function renderFilters() {
  els.filters.innerHTML = "";
  for (const key of ["all", "imdb", "spotify"]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (filter === key ? " is-active" : "");
    b.setAttribute("aria-pressed", String(filter === key));
    b.textContent = data.ui.filters[key];
    b.addEventListener("click", () => { if (filter === key) return; filter = key; deck.reset(pool()); renderFilters(); load(deck.current); });
    els.filters.append(b);
  }
}

function load(s) {
  subject = s;
  items = s.items.map(parse);
  solved = false;
  round++;
  turn = (turn + 1) % teams().length;
  els.counter.textContent = t("counter", { n: round });
  els.turn.textContent = `🎯 ${t("turn", { name: teamAt(turn).name })}`;
  els.avatar.replaceChildren(avatar(s.name));
  els.name.textContent = s.name;
  els.challenge.textContent = t(s.type);
  els.top5.hidden = true;
  els.attempts.innerHTML = "";
  els.attempts.append(Object.assign(document.createElement("p"), { className: "gk-hint", textContent: t("empty") }));
  els.guess.value = "";
  els.guess.disabled = false;
  els.reveal.disabled = false;
  scoreboard.redraw();
  els.guess.focus({ preventScroll: true });
}

function addAttempt(text, match, kind) {
  const empty = els.attempts.querySelector(".gk-hint");
  if (empty) empty.remove();
  const row = document.createElement("div");
  row.className = `pk-attempt is-${kind}`;
  const label = match ? `“${text}” → ${match.title}` : `“${text}”`;
  const result = kind === "peak" ? `${t("peak")} · ${score(match)}` : kind === "good" ? `${t("good")} · ${score(match)}` : t("unknown");
  row.append(Object.assign(document.createElement("span"), { textContent: label }), Object.assign(document.createElement("span"), { className: "pk-attempt__result", textContent: result }));
  els.attempts.prepend(row);
}

function showTop5(mode) {
  els.top5Title.textContent = mode === "solved" ? t("solved", { name: teamAt(turn).name }) : t("revealed");
  els.top5List.innerHTML = "";
  items.slice().sort((a, b) => b.score - a.score).slice(0, 5).forEach((it, i) => {
    const li = document.createElement("li");
    li.append(Object.assign(document.createElement("span"), { textContent: ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"][i] }),
      Object.assign(document.createElement("span"), { textContent: it.title }),
      Object.assign(document.createElement("b"), { textContent: score(it) }));
    els.top5List.append(li);
  });
  els.top5.hidden = false;
  els.guess.disabled = true;
  els.reveal.disabled = true;
}

els.form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (solved) return;
  const raw = els.guess.value.trim();
  if (!raw) return;
  // prima la corrispondenza esatta (es. "Iron Man" non deve diventare "Iron Man 3"), poi quella tollerante
  const names = (it) => [it.title, ...it.aliases];
  const match = items.find((it) => names(it).some((c) => norm(c) === norm(raw)))
    || items.find((it) => names(it).some((c) => fuzzy(raw, c)));
  const peak = items.reduce((x, y) => (y.score > x.score ? y : x));
  if (match && match.score === peak.score) {
    solved = true;
    addAttempt(raw, match, "peak");
    PG.teams.addScore(turn % teams().length, 1);
    showTop5("solved");
    beep(880, 0.25); setTimeout(() => beep(1175, 0.35), 180);
    celebrate();
    return;
  }
  addAttempt(raw, match, match ? "good" : "unknown");
  beep(match ? 600 : 220, 0.15);
  els.guess.value = "";
  els.guess.focus();
});

els.reveal.addEventListener("click", () => { if (solved) return; solved = true; showTop5("revealed"); scoreboard.redraw(); });
$("[data-next]").addEventListener("click", () => load(deck.next()));

$("[data-end]").addEventListener("click", () => {
  els.ranking.innerHTML = "";
  teams().slice().sort((a, b) => b.score - a.score).forEach((tm) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", tm.color);
    li.append(Object.assign(document.createElement("span"), { textContent: tm.name }), Object.assign(document.createElement("strong"), { textContent: tm.score }));
    els.ranking.append(li);
  });
  els.resultLine.textContent = t("resultLine", { n: round });
  views.show("result");
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => { round = 0; views.show("play", { focus: false }); load(deck.next()); });

renderFilters();
load(deck.current);
