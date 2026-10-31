/* =========================================================
   CHI SI CONOSCE MEGLIO / WHO KNOWS WHO BEST
   Ogni squadra globale è una coppia. Domande classiche e round
   "Chi dei due…" mescolati; punteggi su PG.teams.
   Contenuti: assets/data/coppie.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  modes: $("[data-modes]"),
  reset: $("[data-reset]"),
  modePill: $("[data-mode-pill]"),
  counter: $("[data-counter]"),
  eyebrow: $("[data-eyebrow]"),
  question: $("[data-question]"),
  ranking: $("[data-ranking]"),
  resultLine: $("[data-result-line]")
};

let mode = data.modes[0];
const deck = createDeck([]);

/* ---------- Setup: scelta modalità ---------- */
data.modes.forEach((m, i) => {
  const label = document.createElement("label");
  label.className = "gk-mode";
  label.innerHTML = `<input type="radio" name="coppie-mode" value="${m.id}"${i === 0 ? " checked" : ""}>
    <span class="gk-mode__icon" aria-hidden="true">${m.icon}</span>
    <span class="gk-mode__title"></span><span class="gk-mode__desc"></span>`;
  label.querySelector(".gk-mode__title").textContent = m.label;
  label.querySelector(".gk-mode__desc").textContent = m.desc;
  label.querySelector("input").addEventListener("change", () => { mode = m; });
  els.modes.appendChild(label);
});

function buildDeck() {
  const classic = [...data.questions, ...mode.extra].map((text) => ({ text, who: false }));
  const who = data.whoOfUs.map((text) => ({ text, who: true }));
  return [...classic, ...who];
}

/* ---------- Partita ---------- */
mountScoreboard($("[data-scoreboard]"));

function showQuestion() {
  const q = deck.current;
  els.question.textContent = q.text;
  els.question.classList.remove("is-enter"); void els.question.offsetWidth; els.question.classList.add("is-enter");
  els.eyebrow.textContent = q.who ? t("whoEyebrow") : t("classicEyebrow");
  els.counter.textContent = t("counter", { n: deck.position, total: deck.total });
}

function start() {
  if (els.reset.checked) PG.teams.resetScores();
  deck.reset(buildDeck());
  els.modePill.textContent = `${mode.icon} ${mode.label}`;
  views.show("play");
  showQuestion();
}

$("[data-start]").addEventListener("click", start);
$("[data-next]").addEventListener("click", () => { deck.next(); showQuestion(); });

/* ---------- Classifica finale ---------- */
$("[data-end]").addEventListener("click", () => {
  const teams = PG.teams.list().slice().sort((a, b) => b.score - a.score);
  els.ranking.innerHTML = "";
  teams.forEach((team) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", team.color);
    const name = document.createElement("span");
    name.textContent = team.name;
    const score = document.createElement("strong");
    score.textContent = team.score;
    li.append(name, score);
    els.ranking.appendChild(li);
  });
  const tie = teams.length > 1 && teams[0].score === teams[1].score;
  els.resultLine.textContent = tie ? t("resultTie") : t("resultLine", { name: teams[0].name });
  views.show("result");
  if (!tie) celebrate();
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", start);
$("[data-back]").addEventListener("click", () => views.show("setup"));

views.show("setup", { focus: false });
