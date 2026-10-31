/* =========================================================
   IL PIÙ PROBABILE / MOST LIKELY TO
   Pacchetti di domande, voto con conto alla rovescia e
   penitenza casuale per chi riceve più voti.
   Contenuti: assets/data/most-likely.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, countdown } from "../core/game-kit.mjs";

const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  packs: $("[data-packs]"),
  counter: $("[data-counter]"),
  question: $("[data-question]"),
  forfeit: $("[data-forfeit]"),
  vote: $("[data-vote]"),
  resultLine: $("[data-result-line]")
};

let pack = data.packs[0];
const deck = createDeck(pack.questions);
const forfeits = createDeck(data.forfeits);
let played = 1;

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
      deck.reset(p.questions);
      renderPacks();
      showQuestion();
    });
    els.packs.appendChild(btn);
  });
}

function showQuestion() {
  els.question.textContent = deck.current;
  els.question.classList.remove("is-enter"); void els.question.offsetWidth; els.question.classList.add("is-enter");
  els.counter.textContent = t("counter", { n: deck.position, total: deck.total });
  els.forfeit.textContent = forfeits.next();
}

$("[data-next]").addEventListener("click", () => {
  deck.next();
  played++;
  showQuestion();
});

$("[data-new-forfeit]").addEventListener("click", () => {
  els.forfeit.textContent = forfeits.next();
});

els.vote.addEventListener("click", async () => {
  els.vote.disabled = true;
  await countdown({ label: t("ready"), goText: t("go"), goLabel: t("goLabel") });
  els.vote.disabled = false;
});

$("[data-end]").addEventListener("click", () => {
  els.resultLine.textContent = t("resultLine", { n: played });
  views.show("result");
  window.PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  played = 1;
  deck.reset(pack.questions);
  forfeits.reset();
  views.show("play");
  showQuestion();
});

renderPacks();
showQuestion();
