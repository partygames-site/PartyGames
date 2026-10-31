/* =========================================================
   INDOVINA LA CANZONE DALLE EMOJI / EMOJI SONG QUIZ
   Un rebus di emoji nasconde una canzone famosa. Le squadre
   rispondono a voce; il conduttore assegna +2 (titolo e artista)
   o +1 (solo uno dei due). Nessun audio: solo emoji.
   Contenuti: assets/data/canzoni-emoji.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);
const SECONDS = data.seconds || 30;

const els = {
  packs: $("[data-packs]"), counter: $("[data-counter]"), emoji: $("[data-emoji]"), hintText: $("[data-hint-text]"),
  ring: $("[data-ring]"), ringValue: $("[data-ring-value]"), timer: $("[data-timer]"), solution: $("[data-solution]"),
  title: $("[data-title]"), by: $("[data-by]"), awards: $("[data-awards]"), awarded: $("[data-awarded]"),
  ranking: $("[data-ranking]"), resultLine: $("[data-result-line]")
};

let pack = "all";
const pool = () => data.songs.filter((s) => pack === "all" || s.pack === pack);
const deck = createDeck(pool());
let song = null, round = 0, tick = null, left = SECONDS, given = new Set();
const teams = () => PG.teams.list();

function renderPacks() {
  els.packs.innerHTML = "";
  Object.entries(data.ui.packs).forEach(([key, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (pack === key ? " is-active" : "");
    b.setAttribute("aria-pressed", String(pack === key));
    b.textContent = label;
    b.addEventListener("click", () => { if (pack === key) return; pack = key; deck.reset(pool()); renderPacks(); load(deck.current); });
    els.packs.append(b);
  });
}

function setRing() {
  els.ringValue.textContent = left;
  els.ring.style.setProperty("--p", (left / SECONDS) * 100);
  els.ring.classList.toggle("is-danger", tick !== null && left <= 5);
}
function stopTimer() { clearInterval(tick); tick = null; }
function resetTimer() {
  stopTimer();
  left = SECONDS;
  setRing();
  els.timer.disabled = false;
  els.timer.textContent = `⏱ ${t("timer", { s: SECONDS })}`;
}

els.timer.addEventListener("click", () => {
  els.timer.disabled = true;
  tick = setInterval(() => {
    left--;
    setRing();
    if (left > 0 && left <= 3) beep(660, 0.1);
    if (left <= 0) { stopTimer(); setRing(); beep(200, 0.5, "sawtooth"); }
  }, 1000);
  setRing();
});

function renderAwards() {
  els.awards.innerHTML = "";
  teams().forEach((tm, i) => {
    const row = document.createElement("div");
    row.className = "ce-award";
    row.style.setProperty("--team-color", tm.color);
    const btns = document.createElement("div");
    [[2, "both"], [1, "one"]].forEach(([n, key]) => {
      const b = Object.assign(document.createElement("button"), { type: "button", textContent: t(key) });
      b.setAttribute("aria-label", `${tm.name} ${t(key)}`);
      b.disabled = given.has(i);
      b.addEventListener("click", () => {
        if (given.has(i)) return;
        given.add(i);
        PG.teams.addScore(i, n);
        els.awarded.textContent = t("awarded", { name: tm.name, n });
        beep(880, 0.15);
        renderAwards();
      });
      btns.append(b);
    });
    row.append(Object.assign(document.createElement("span"), { textContent: tm.name }), btns);
    els.awards.append(row);
  });
}

function load(s) {
  song = s;
  round++;
  given = new Set();
  els.counter.textContent = t("counter", { n: round });
  els.emoji.textContent = s.e;
  els.emoji.setAttribute("aria-label", s.e);
  els.emoji.classList.remove("is-enter"); void els.emoji.offsetWidth; els.emoji.classList.add("is-enter");
  els.hintText.textContent = "";
  els.solution.hidden = true;
  els.awarded.textContent = "";
  resetTimer();
  renderAwards();
}

$("[data-hint]").addEventListener("click", () => { els.hintText.textContent = t("hintText", { year: song.year }); });
$("[data-reveal]").addEventListener("click", () => {
  stopTimer();
  setRing();
  els.title.textContent = song.title;
  els.by.textContent = t("by", { artist: song.artist, year: song.year });
  els.solution.hidden = false;
});
$("[data-next]").addEventListener("click", () => load(deck.next()));

$("[data-end]").addEventListener("click", () => {
  stopTimer();
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

mountScoreboard($("[data-scoreboard]"));
PG.teams.onChange(renderAwards);
renderPacks();
load(deck.current);
