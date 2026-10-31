/* =========================================================
   DILEMMI MORALI / MORAL DILEMMAS
   Due opzioni, conteggio delle mani alzate e timer per la
   discussione. Contenuti: assets/data/dilemmi.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, beep } from "../core/game-kit.mjs";

const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  packs: $("[data-packs]"),
  counter: $("[data-counter]"),
  question: $("[data-question]"),
  options: { a: $('[data-option="a"]'), b: $('[data-option="b"]') },
  fill: $("[data-timer-fill]"),
  timerText: $("[data-timer-text]"),
  discuss: $("[data-discuss]"),
  resultLine: $("[data-result-line]")
};

const SECONDS = data.discussSeconds || 30;
let pack = data.packs[0];
const deck = createDeck(pack.items);
const votes = { a: 0, b: 0 };
let played = 1;
let timer = null;

els.discuss.textContent = `🗣 ${t("discuss", { s: SECONDS })}`;

function renderPacks() {
  els.packs.innerHTML = "";
  data.packs.forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (p === pack ? " is-active" : "");
    btn.setAttribute("aria-pressed", String(p === pack));
    btn.textContent = `${p.icon} ${p.label}`;
    btn.addEventListener("click", () => {
      if (p === pack) return;
      pack = p;
      deck.reset(p.items);
      renderPacks();
      showDilemma();
    });
    els.packs.appendChild(btn);
  });
}

function renderVotes() {
  for (const key of ["a", "b"]) {
    const btn = els.options[key];
    btn.querySelector("[data-count]").textContent = votes[key];
    btn.setAttribute("aria-label", `${key.toUpperCase()}: ${btn.querySelector("[data-text]").textContent} — ${votes[key]} ${t("votesFor", { option: key.toUpperCase() })}`);
  }
}

function resetTimer() {
  clearInterval(timer);
  timer = null;
  els.fill.style.transition = "none";
  els.fill.style.width = "100%";
  els.fill.classList.remove("is-low");
  void els.fill.offsetWidth;
  els.fill.style.transition = "";
  els.timerText.textContent = t("timerReady");
  els.discuss.disabled = false;
}

function showDilemma() {
  const d = deck.current;
  els.question.textContent = d.q;
  els.question.classList.remove("is-enter"); void els.question.offsetWidth; els.question.classList.add("is-enter");
  els.options.a.querySelector("[data-text]").textContent = d.a;
  els.options.b.querySelector("[data-text]").textContent = d.b;
  votes.a = 0;
  votes.b = 0;
  renderVotes();
  els.counter.textContent = t("counter", { n: deck.position, total: deck.total });
  resetTimer();
}

for (const key of ["a", "b"]) {
  els.options[key].addEventListener("click", () => {
    votes[key]++;
    renderVotes();
  });
}

els.discuss.addEventListener("click", () => {
  els.discuss.disabled = true;
  let left = SECONDS;
  els.timerText.textContent = t("timerRunning", { s: left });
  els.fill.style.transitionDuration = "1s";
  timer = setInterval(() => {
    left--;
    els.fill.style.width = `${(left / SECONDS) * 100}%`;
    els.fill.classList.toggle("is-low", left <= 5);
    if (left > 0) {
      els.timerText.textContent = t("timerRunning", { s: left });
      if (left <= 3) beep(520, 0.1);
    } else {
      clearInterval(timer);
      els.timerText.textContent = t("timerEnd");
      els.discuss.disabled = false;
      beep(880, 0.4);
    }
  }, 1000);
});

$("[data-next]").addEventListener("click", () => {
  deck.next();
  played++;
  showDilemma();
});

$("[data-end]").addEventListener("click", () => {
  resetTimer();
  els.resultLine.textContent = t("resultLine", { n: played });
  views.show("result");
  window.PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  played = 1;
  deck.reset(pack.items);
  views.show("play");
  showDilemma();
});

renderPacks();
showDilemma();
