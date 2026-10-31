/* =========================================================
   FIRE DOWN
   Una categoria, pochi secondi per rispondere: chi esita viene
   eliminato. L'ultima squadra (o giocatore) in gioco vince +1.
   I partecipanti sono le squadre globali (PG.teams).
   Contenuti: assets/data/fire-down.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const SECONDS = data.seconds || 5;
const els = {
  remaining: $("[data-remaining]"),
  category: $("[data-category]"),
  ring: $("[data-ring]"),
  ringValue: $("[data-ring-value]"),
  chips: $("[data-chips]"),
  timer: $("[data-timer]"),
  winTitle: $("[data-win-title]")
};

const deck = createDeck(data.categories);
let players = [];
let over = false;
let interval = null;

els.timer.textContent = `⏱ ${t("timer", { s: SECONDS })}`;
mountScoreboard($("[data-scoreboard]"));

function setRing(value, pct) {
  els.ringValue.textContent = value;
  els.ring.style.setProperty("--p", pct);
}

function resetTimer() {
  clearInterval(interval);
  interval = null;
  els.ring.classList.remove("is-warn", "is-danger");
  setRing(SECONDS, 100);
  els.timer.disabled = false;
}

function renderChips() {
  els.chips.innerHTML = "";
  players.forEach((p, i) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "gk-chip" + (p.out ? " is-out" : "");
    chip.style.setProperty("--team-color", p.color);
    chip.setAttribute("aria-pressed", String(p.out));
    chip.textContent = p.out ? `${p.name} ❌` : p.name;
    if (p.out) chip.setAttribute("aria-label", `${p.name} — ${t("out")}`);
    chip.addEventListener("click", () => {
      if (over) return;
      p.out = !p.out;
      renderChips();
      checkWinner();
    });
    els.chips.appendChild(chip);
  });
  const alive = players.filter((p) => !p.out).length;
  els.remaining.textContent = t("remaining", { n: alive, total: players.length });
}

function showCategory() {
  els.category.textContent = deck.current;
  els.category.classList.remove("is-enter"); void els.category.offsetWidth; els.category.classList.add("is-enter");
  resetTimer();
}

function checkWinner() {
  const alive = players.map((p, i) => ({ p, i })).filter((x) => !x.p.out);
  if (players.length < 2 || alive.length !== 1) return;
  over = true;
  resetTimer();
  const winner = alive[0];
  PG.teams.addScore(winner.i, 1);
  els.winTitle.textContent = `🏆 ${t("winTitle", { name: winner.p.name })}`;
  views.show("win");
  celebrate();
  PG.ads.reveal("results");
}

function start() {
  over = false;
  players = PG.teams.list().map((team) => ({ name: team.name, color: team.color, out: false }));
  deck.reset();
  renderChips();
  showCategory();
  views.show("play", { focus: false });
}

els.timer.addEventListener("click", () => {
  els.timer.disabled = true;
  let left = SECONDS;
  els.ring.classList.remove("is-warn", "is-danger");
  setRing(left, 100);
  beep(523, 0.15);
  interval = setInterval(() => {
    left--;
    if (left > 0) {
      setRing(left, (left / SECONDS) * 100);
      els.ring.classList.toggle("is-warn", left <= 3 && left > 2);
      els.ring.classList.toggle("is-danger", left <= 2);
      beep(left <= 2 ? 660 : 523, 0.15);
    } else {
      clearInterval(interval);
      setRing("🔥", 0);
      els.ring.classList.add("is-danger");
      beep(220, 0.45);
      setTimeout(() => {
        els.ring.classList.remove("is-danger");
        els.timer.disabled = false;
      }, 900);
    }
  }, 1000);
});

$("[data-next]").addEventListener("click", () => {
  deck.next();
  showCategory();
});

$("[data-restart]").addEventListener("click", start);
$("[data-restart-small]").addEventListener("click", start);

// Se nel pannello cambiano nomi o numero di squadre a partita non iniziata, si riparte
PG.teams.onChange((list) => {
  const untouched = players.every((p) => !p.out);
  if (!over && untouched && list.length !== players.length) start();
  else if (!over) list.forEach((team, i) => { if (players[i]) { players[i].name = team.name; players[i].color = team.color; } });
  if (!over) renderChips();
});

start();
