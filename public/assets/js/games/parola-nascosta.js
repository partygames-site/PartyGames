/* =========================================================
   LA PAROLA NASCOSTA / HIDDEN WORD LINK
   Cinque parole indizio si scoprono una alla volta; le squadre
   hanno `seconds` secondi per trovare la parola che le collega.
   Ogni squadra che indovina guadagna +1 (anche più squadre).
   Contenuti: assets/data/parola-nascosta.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const SECONDS = data.seconds || 40;
const REVEAL_MS = data.revealMs || 450;
const els = {
  levels: $("[data-levels]"),
  counter: $("[data-counter]"),
  words: $("[data-words]"),
  ring: $("[data-ring]"),
  ringValue: $("[data-ring-value]"),
  status: $("[data-status]"),
  start: $("[data-start]"),
  stop: $("[data-stop]"),
  answers: $("[data-answers]"),
  verify: $("[data-verify]"),
  solution: $("[data-solution]"),
  solutionWord: $("[data-solution-word]"),
  solutionLinks: $("[data-solution-links]"),
  reveal: $("[data-reveal]"),
  ranking: $("[data-ranking]"),
  resultLine: $("[data-result-line]")
};

let level = "easy";
const pool = () => data.puzzles.filter((p) => level === "all" || p.level === level);
const deck = createDeck(pool());
const state = { round: 0, puzzle: null, phase: "ready", remaining: SECONDS, endAt: 0 };
let tick = null;
let revealTimers = [];

mountScoreboard($("[data-scoreboard]"));

/* ---------- Livello ---------- */
function renderLevels() {
  els.levels.innerHTML = "";
  ["easy", "hard", "all"].forEach((key) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip" + (key === level ? " is-active" : "");
    btn.setAttribute("aria-pressed", String(key === level));
    btn.textContent = data.ui.levels[key];
    btn.addEventListener("click", () => {
      if (key === level) return;
      level = key;
      deck.reset(pool());
      renderLevels();
      loadPuzzle(deck.current);
    });
    els.levels.appendChild(btn);
  });
}

/* ---------- Confronto tollerante: maiuscole, accenti, spazi, apostrofi ---------- */
const normalize = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");
const isCorrect = (input, p) => {
  const a = normalize(input);
  return !!a && [p.answer, ...(p.alt || [])].some((w) => normalize(w) === a);
};

/* ---------- Puzzle ---------- */
function loadPuzzle(puzzle) {
  stopTick();
  revealTimers.forEach(clearTimeout);
  revealTimers = [];
  state.puzzle = puzzle;
  state.round++;
  state.phase = "ready";
  state.remaining = SECONDS;

  els.counter.textContent = t("counter", { n: state.round });
  els.words.innerHTML = "";
  puzzle.words.forEach((_, i) => {
    const w = document.createElement("div");
    w.className = "gk-word";
    w.innerHTML = `<small>${i + 1}</small><span>?</span>`;
    els.words.appendChild(w);
  });
  els.solution.hidden = true;
  els.status.textContent = t("statusReady");
  renderAnswers();
  renderTimer();
  updateControls();
}

function showWord(i) {
  const card = els.words.children[i];
  if (!card || card.classList.contains("is-shown")) return;
  card.lastChild.textContent = state.puzzle.words[i];
  card.classList.add("is-shown");
}

function showAllWords() {
  revealTimers.forEach(clearTimeout);
  revealTimers = [];
  state.puzzle.words.forEach((_, i) => showWord(i));
}

function renderAnswers() {
  els.answers.innerHTML = "";
  PG.teams.list().forEach((team, i) => {
    const row = document.createElement("label");
    row.className = "gk-answer";
    row.style.setProperty("--team-color", team.color);
    row.innerHTML = `<span class="gk-answer__name"></span><input class="gk-input" type="text" maxlength="30" autocomplete="off" spellcheck="false"><span class="gk-answer__mark" aria-live="polite"></span>`;
    row.querySelector(".gk-answer__name").textContent = team.name;
    const input = row.querySelector("input");
    input.placeholder = t("placeholder");
    input.dataset.i = i;
    els.answers.appendChild(row);
  });
}

// Invio passa al campo successivo; dall'ultimo verifica
els.answers.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.target.tagName !== "INPUT") return;
  e.preventDefault();
  const inputs = [...els.answers.querySelectorAll("input")];
  const pos = inputs.indexOf(e.target);
  if (pos < inputs.length - 1) inputs[pos + 1].focus();
  else if (!els.verify.disabled) verify();
});

/* ---------- Timer (basato sull'orologio: preciso anche in background) ---------- */
function renderTimer() {
  const secs = Math.ceil(state.remaining);
  els.ringValue.textContent = secs;
  els.ring.style.setProperty("--p", (state.remaining / SECONDS) * 100);
  els.ring.classList.toggle("is-danger", state.phase === "running" && secs <= 10);
}

function startTick() {
  stopTick();
  state.endAt = Date.now() + state.remaining * 1000;
  let last = Math.ceil(state.remaining);
  tick = setInterval(() => {
    state.remaining = Math.max(0, (state.endAt - Date.now()) / 1000);
    const whole = Math.ceil(state.remaining);
    if (whole !== last) { last = whole; if (whole > 0 && whole <= 5) beep(660, 0.12); }
    renderTimer();
    if (state.remaining <= 0) timeUp();
  }, 100);
}
function stopTick() { clearInterval(tick); tick = null; }

function timeUp() {
  stopTick();
  state.remaining = 0;
  state.phase = "stopped";
  renderTimer();
  beep(180, 0.6, "sawtooth");
  els.status.textContent = t("statusTimeUp");
  updateControls();
  focusFirst();
}

function focusFirst() {
  const first = els.answers.querySelector("input:not(:disabled)");
  if (first) first.focus({ preventScroll: true });
}

function updateControls() {
  const p = state.phase;
  els.start.hidden = p !== "ready";
  els.stop.hidden = !(p === "running" || (p === "stopped" && state.remaining > 0));
  els.stop.textContent = p === "running" ? `⏸ ${t("stop")}` : `▶ ${t("resume")}`;
  els.verify.disabled = !(p === "running" || p === "stopped");
  els.reveal.disabled = p === "done";
  els.answers.querySelectorAll("input").forEach((inp) => { inp.disabled = p === "done"; });
}

/* ---------- Azioni ---------- */
els.start.addEventListener("click", () => {
  if (state.phase !== "ready") return;
  state.phase = "running";
  els.status.textContent = t("statusRunning");
  updateControls();
  state.puzzle.words.forEach((_, i) => {
    revealTimers.push(setTimeout(() => { showWord(i); beep(520 + i * 60, 0.12); }, i * REVEAL_MS));
  });
  revealTimers.push(setTimeout(() => { if (state.phase === "running") startTick(); }, (state.puzzle.words.length - 1) * REVEAL_MS + 200));
});

els.stop.addEventListener("click", () => {
  if (state.phase === "running") {
    showAllWords();
    stopTick();
    state.phase = "stopped";
    els.status.textContent = t("statusStopped");
    focusFirst();
  } else if (state.phase === "stopped" && state.remaining > 0) {
    state.phase = "running";
    els.status.textContent = t("statusRunning");
    startTick();
  }
  updateControls();
});

function showSolution() {
  els.solutionWord.textContent = state.puzzle.answer;
  els.solutionLinks.textContent = state.puzzle.links || "";
  els.solution.hidden = false;
}

function verify() {
  if (!(state.phase === "running" || state.phase === "stopped")) return;
  showAllWords();
  stopTick();
  state.phase = "done";
  const teams = PG.teams.list();
  const winners = [];
  els.answers.querySelectorAll(".gk-answer").forEach((row, i) => {
    const ok = isCorrect(row.querySelector("input").value, state.puzzle);
    row.classList.toggle("is-correct", ok);
    row.classList.toggle("is-wrong", !ok);
    row.querySelector(".gk-answer__mark").textContent = ok ? "✅" : "❌";
    if (ok) winners.push(i);
  });
  winners.forEach((i) => PG.teams.addScore(i, 1));
  if (winners.length) {
    beep(880, 0.25);
    setTimeout(() => beep(1175, 0.35), 180);
    els.status.textContent = winners.length === teams.length && teams.length > 1
      ? t("statusAll")
      : t("statusWinners", { names: winners.map((i) => teams[i].name).join(t("joiner")) });
  } else {
    beep(160, 0.5, "sawtooth");
    els.status.textContent = t("statusNone");
  }
  showSolution();
  updateControls();
}

els.verify.addEventListener("click", verify);

els.reveal.addEventListener("click", () => {
  if (state.phase === "done") return;
  showAllWords();
  stopTick();
  state.phase = "done";
  showSolution();
  updateControls();
});

$("[data-next]").addEventListener("click", () => loadPuzzle(deck.next()));

$("[data-end]").addEventListener("click", () => {
  stopTick();
  const teams = PG.teams.list().slice().sort((a, b) => b.score - a.score);
  els.ranking.innerHTML = "";
  teams.forEach((team) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", team.color);
    const name = document.createElement("span");
    name.textContent = team.name;
    const pts = document.createElement("strong");
    pts.textContent = team.score;
    li.append(name, pts);
    els.ranking.appendChild(li);
  });
  els.resultLine.textContent = t("resultLine", { n: state.round });
  views.show("result");
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  state.round = 0;
  deck.reset(pool());
  views.show("play", { focus: false });
  loadPuzzle(deck.current);
});

// Se cambiano le squadre, aggiorna le righe di risposta del puzzle non ancora iniziato
PG.teams.onChange((list) => {
  if (state.phase === "ready" && els.answers.children.length !== list.length) renderAnswers();
});

renderLevels();
loadPuzzle(deck.current);
