/* =========================================================
   NOMI COSE CITTÀ SPEED / NAME PLACE ANIMAL SPEED
   Si estrae una lettera; per ogni lettera si giocano fino a
   maxTopics argomenti. Vince chi guadagna winScore punti in
   questa partita (i punti si sommano alle squadre globali).
   Contenuti: assets/data/nomi-cose-citta.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const LETTERS = data.letters.split("");
const MAX = data.maxTopics || 5;
const WIN = data.winScore || 25;

const els = {
  goal: $("[data-goal]"),
  topicCounter: $("[data-topic-counter]"),
  letter: $("[data-letter]"),
  draw: $("[data-draw]"),
  topic: $("[data-topic]"),
  next: $("[data-next]"),
  winTitle: $("[data-win-title]"),
  winLine: $("[data-win-line]"),
  ranking: $("[data-ranking]")
};

const deck = createDeck(data.topics);
let letter = null;
let topicNo = 0;
let baseline = [];
let finished = false;

els.goal.textContent = `🎯 ${t("goal", { n: WIN })}`;
mountScoreboard($("[data-scoreboard]"));

function gained(i) {
  const team = PG.teams.list()[i];
  return team ? team.score - (baseline[i] || 0) : 0;
}

function renderCounter() {
  els.topicCounter.textContent = topicNo
    ? t("topicCounter", { n: topicNo, max: MAX }) + (topicNo >= MAX ? ` — ${t("changeLetter")} 🔄` : "")
    : t("topicCounter", { n: "—", max: MAX });
}

function showTopic() {
  els.topic.textContent = deck.next();
  els.topic.classList.remove("is-enter"); void els.topic.offsetWidth; els.topic.classList.add("is-enter");
  renderCounter();
  els.next.disabled = topicNo >= MAX;
}

/* Estrazione con breve animazione "a rullo" */
els.draw.addEventListener("click", () => {
  els.draw.disabled = true;
  els.letter.classList.add("is-rolling");
  let spins = 0;
  const roll = setInterval(() => {
    els.letter.textContent = LETTERS[Math.floor(Math.random() * LETTERS.length)];
    if (++spins % 3 === 0) beep(400 + spins * 15, 0.04);
    if (spins >= 14) {
      clearInterval(roll);
      let next;
      do { next = LETTERS[Math.floor(Math.random() * LETTERS.length)]; } while (next === letter && LETTERS.length > 1);
      letter = next;
      els.letter.textContent = letter;
      els.letter.classList.remove("is-rolling");
      beep(880, 0.2);
      topicNo = 1;
      showTopic();
      els.draw.disabled = false;
    }
  }, 60);
});

els.next.addEventListener("click", () => {
  if (topicNo >= MAX) return;
  topicNo++;
  showTopic();
});

function showWin(ranked) {
  finished = true;
  els.ranking.innerHTML = "";
  ranked.forEach(({ team, gain }) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", team.color);
    const name = document.createElement("span");
    name.textContent = team.name;
    const pts = document.createElement("strong");
    pts.textContent = `+${gain}`;
    li.append(name, pts);
    els.ranking.appendChild(li);
  });
  const top = ranked[0];
  els.winTitle.textContent = `🏆 ${t("winTitle", { name: top.team.name })}`;
  els.winLine.textContent = t("winLine", { n: top.gain });
  views.show("win");
  celebrate();
  PG.ads.reveal("results");
}

function ranking() {
  return PG.teams.list().map((team, i) => ({ team, gain: gained(i) })).sort((a, b) => b.gain - a.gain);
}

PG.teams.onChange(() => {
  if (finished) return;
  const r = ranking();
  if (r.length && r[0].gain >= WIN) showWin(r);
});

$("[data-end]").addEventListener("click", () => showWin(ranking()));

function start() {
  finished = false;
  baseline = PG.teams.list().map((team) => team.score);
  letter = null;
  topicNo = 0;
  deck.reset();
  els.letter.textContent = "?";
  els.topic.textContent = t("topicIdle");
  els.next.disabled = true;
  renderCounter();
  views.show("play", { focus: false });
}

$("[data-restart]").addEventListener("click", start);
start();
