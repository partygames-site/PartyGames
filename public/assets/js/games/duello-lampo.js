/* =========================================================
   DUELLO LAMPO / LIGHTNING DUEL
   Mazzo di sfide di 14 tipi. Le sfide "a voce" usano gli elenchi
   del file dati; quelle interattive (calcolo, puntini, cronometro,
   memoria, Simon, riflessi, paroliere) sono generate qui e
   suggeriscono in automatico chi ha fatto meglio.
   Il conduttore assegna i punti (a una, più o nessuna squadra).
   Contenuti: assets/data/duello-lampo.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createViews, mountScoreboard, shuffle, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const hint = createI18n(data.ui.hint);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const TEAM_KEYS = ["A", "L", "Q", "P", "Z", "M"];
const SIMON = [
  { color: "#ff3b5c", freq: 330 },
  { color: "#2979ff", freq: 392 },
  { color: "#00e676", freq: 494 },
  { color: "#ffd600", freq: 587 }
];
// Quante volte ogni sfida generata compare nel mazzo
const GENERATED = { maths: 10, dots: 5, stopwatch: 6, memory: 5, simon: 5, reflex: 6, letters: 5 };

const els = {
  types: $("[data-types]"),
  type: $("[data-type]"),
  counter: $("[data-counter]"),
  card: $("[data-card]"),
  prompt: $("[data-prompt]"),
  hint: $("[data-hint]"),
  widget: $("[data-widget]"),
  timerBox: $("[data-timer-box]"),
  ring: $("[data-ring]"),
  ringValue: $("[data-ring-value]"),
  timerBtn: $("[data-timer]"),
  solution: $("[data-solution]"),
  solutionText: $("[data-solution-text]"),
  solutionNote: $("[data-solution-note]"),
  reveal: $("[data-reveal]"),
  points: $("[data-points]"),
  pointsSummary: $("[data-points-summary]"),
  ranking: $("[data-ranking]"),
  resultLine: $("[data-result-line]")
};

/* ---------- Utilità ---------- */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const fmt = (n) => Number(n).toLocaleString(data.locale, { maximumFractionDigits: 3 });
const fmt2 = (n) => n.toLocaleString(data.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Crea un elemento: h("div", { class: "x", onclick: fn }, "testo", altroNodo) */
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else if (k === "style") Object.assign(el.style, v);
    else if (k.startsWith("--")) el.style.setProperty(k, v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  children.flat().forEach((c) => el.append(c instanceof Node ? c : String(c)));
  return el;
}

/** Numeri scritti dagli utenti: "42,195" o "42.195", "185.000" o "185,000" */
function parseNum(s) {
  let v = String(s || "").trim().replace(/\s/g, "");
  if (!v) return NaN;
  if (data.locale.startsWith("it")) {
    if (v.includes(",")) v = v.replace(/\./g, "").replace(",", ".");
    else if (/^\d{1,3}(\.\d{3})+$/.test(v)) v = v.replace(/\./g, "");
  } else {
    v = v.replace(/,/g, "");
  }
  return Number(v);
}

/* ---------- Stato ---------- */
let enabled = new Set(Object.keys(data.types));
let deck = [];
let deckPos = 0;
let round = 0;
let card = null;
let selected = new Set();
let cleanups = [];
const teams = () => PG.teams.list();

mountScoreboard($("[data-scoreboard]"));

/* ---------- Mazzo ---------- */
function buildDeck() {
  const cards = [];
  const add = (type, list) => { if (enabled.has(type)) list.forEach((item) => cards.push({ type, ...item })); };
  add("riddle", data.riddles);
  add("logic", data.logic);
  add("sequence", data.sequences);
  add("list", data.lists);
  add("oddOne", data.oddOneOut);
  add("estimate", data.estimates);
  if (enabled.has("anagram")) data.anagrams.forEach((word) => cards.push({ type: "anagram", word }));
  for (const [type, n] of Object.entries(GENERATED)) {
    if (enabled.has(type)) for (let i = 0; i < n; i++) cards.push({ type });
  }
  deck = shuffle(cards);
  // evita due sfide dello stesso tipo di fila, quando possibile
  for (let i = 1; i < deck.length; i++) {
    if (deck[i].type === deck[i - 1].type) {
      const j = deck.findIndex((c, k) => k > i && c.type !== deck[i - 1].type);
      if (j > 0) [deck[i], deck[j]] = [deck[j], deck[i]];
    }
  }
  deckPos = 0;
}

function renderTypes() {
  els.types.innerHTML = "";
  for (const [key, label] of Object.entries(data.types)) {
    els.types.append(h("button", {
      type: "button",
      class: "chip" + (enabled.has(key) ? " is-active" : ""),
      "aria-pressed": String(enabled.has(key)),
      onclick: () => {
        if (enabled.has(key)) { if (enabled.size === 1) return; enabled.delete(key); }
        else enabled.add(key);
        renderTypes();
        buildDeck();
        nextCard(false);
      }
    }, label));
  }
}

/* ---------- Punti ---------- */
function renderPoints() {
  els.points.innerHTML = "";
  teams().forEach((team, i) => {
    const on = selected.has(i);
    els.points.append(h("button", {
      type: "button", class: "dl-point", "--team-color": team.color, "aria-pressed": String(on),
      onclick: () => { selected.has(i) ? selected.delete(i) : selected.add(i); renderPoints(); }
    }, team.name, " ", h("b", {}, on ? "✅ +1" : "+1")));
  });
  const names = [...selected].sort().map((i) => teams()[i]?.name).filter(Boolean);
  els.pointsSummary.textContent = names.length ? t("pointsSummary", { names: names.join(", ") }) : t("pointsNone");
}

function suggest(indices) {
  selected = new Set(indices);
  renderPoints();
}

$("[data-none]").addEventListener("click", () => suggest([]));
$("[data-next]").addEventListener("click", () => {
  selected.forEach((i) => PG.teams.addScore(i, 1));
  if (selected.size) beep(880, 0.2);
  nextCard(true);
});

PG.teams.onChange(() => renderPoints());

/* ---------- Timer per le sfide a voce ---------- */
let timer = null;

function setupTimer(seconds, onStart) {
  stopTimer();
  els.timerBox.hidden = !seconds;
  if (!seconds) { timer = null; return; }
  timer = { total: seconds, remaining: seconds, running: false, started: false, endAt: 0, id: null, onStart };
  renderRing();
  els.timerBtn.disabled = false;
  els.timerBtn.textContent = `▶ ${t("startTimer", { s: seconds })}`;
}

function renderRing() {
  const whole = Math.ceil(timer.remaining);
  els.ringValue.textContent = whole;
  els.ring.style.setProperty("--p", (timer.remaining / timer.total) * 100);
  els.ring.classList.toggle("is-danger", timer.running && whole <= 5);
}

function stopTimer() {
  if (timer && timer.id) { clearInterval(timer.id); timer.id = null; }
  if (timer) timer.running = false;
}

els.timerBtn.addEventListener("click", () => {
  if (!timer) return;
  if (timer.running) {
    stopTimer();
    renderRing();
    els.timerBtn.textContent = `▶ ${t("resume")}`;
    return;
  }
  if (timer.remaining <= 0) return;
  if (!timer.started) { timer.started = true; if (timer.onStart) timer.onStart(); }
  timer.running = true;
  timer.endAt = Date.now() + timer.remaining * 1000;
  els.timerBtn.textContent = `⏸ ${t("pause")}`;
  let last = Math.ceil(timer.remaining);
  timer.id = setInterval(() => {
    timer.remaining = Math.max(0, (timer.endAt - Date.now()) / 1000);
    const whole = Math.ceil(timer.remaining);
    if (whole !== last) { last = whole; if (whole > 0 && whole <= 3) beep(660, 0.1); }
    renderRing();
    if (timer.remaining <= 0) {
      stopTimer();
      renderRing();
      beep(200, 0.5, "sawtooth");
      els.timerBtn.textContent = t("timeUp");
      els.timerBtn.disabled = true;
    }
  }, 100);
});

/* ---------- Soluzione ---------- */
function setSolution(text, note) {
  els.solutionText.textContent = text || "";
  els.solutionNote.textContent = note || "";
  els.solution.hidden = true;
  els.reveal.hidden = !text;
  els.reveal.disabled = false;
}

els.reveal.addEventListener("click", () => {
  if (card && card.onReveal) card.onReveal();
  els.solution.hidden = false;
  els.reveal.disabled = true;
});

/* ---------- Cambio sfida ---------- */
function nextCard(countRound) {
  stopTimer();
  cleanups.forEach((fn) => { try { fn(); } catch (e) { /* ignorato */ } });
  cleanups = [];
  if (deckPos >= deck.length) buildDeck();
  card = { ...deck[deckPos++] };
  if (countRound || round === 0) round++;
  els.counter.textContent = t("counter", { n: round });
  selected = new Set();
  renderPoints();

  els.type.textContent = data.types[card.type];
  els.prompt.className = "gk-question";
  els.prompt.textContent = "";
  els.hint.textContent = "";
  els.widget.innerHTML = "";
  setSolution("", "");
  setupTimer(0);
  RENDER[card.type]();
  els.card.classList.remove("is-enter"); void els.card.offsetWidth; els.card.classList.add("is-enter");
}

/* ---------- Riga di input per squadra (stime, paroliere) ---------- */
function teamInputs(placeholder, inputmode) {
  const wrap = h("div", { class: "gk-answers" });
  const rows = teams().map((team) => {
    const input = h("input", { class: "gk-input", placeholder, autocomplete: "off", spellcheck: "false", inputmode });
    const mark = h("span", { class: "gk-answer__mark" });
    const row = h("label", { class: "gk-answer", "--team-color": team.color }, h("span", { class: "gk-answer__name" }, team.name), input, mark);
    wrap.append(row);
    return { row, input, mark };
  });
  els.widget.append(wrap);
  return rows;
}

function estimateInputs(answer) {
  const rows = teamInputs(t("estimatePlaceholder"), "decimal");
  const prev = card.onReveal;
  card.onReveal = () => {
    if (prev) prev();
    const diffs = rows.map(({ input, mark }) => {
      const v = parseNum(input.value);
      if (Number.isNaN(v)) { mark.textContent = "—"; return Infinity; }
      const d = Math.abs(v - answer);
      mark.textContent = t("estimateGap", { n: fmt(Math.round(d * 1000) / 1000) });
      return d;
    });
    const best = Math.min(...diffs);
    if (best !== Infinity) {
      diffs.forEach((d, i) => rows[i].row.classList.toggle("is-best", d === best));
      suggest(diffs.map((d, i) => (d === best ? i : -1)).filter((i) => i >= 0));
    }
  };
}

/* Risultati misurati (cronometro, Simon) con evidenziazione del migliore */
function resultsList(container, results, format, better) {
  container.innerHTML = "";
  const done = results.map((r, i) => ({ r, i })).filter((x) => x.r !== null);
  if (!done.length) return;
  const best = done.reduce((acc, x) => (better(x.r, acc) ? x.r : acc), done[0].r);
  done.forEach(({ r, i }) => {
    const team = teams()[i];
    container.append(h("div", { class: "gk-answer" + (r === best ? " is-best" : ""), "--team-color": team.color },
      h("span", { class: "gk-answer__name" }, team.name), h("span", {}, format(r)), h("span", { class: "gk-answer__mark" }, r === best ? "🏆" : "")));
  });
  if (done.length === teams().length) suggest(done.filter((x) => x.r === best).map((x) => x.i));
}

/* ---------- Generatori ---------- */
function generateCalc() {
  const forms = [
    () => { const a = rand(6, 19), b = rand(3, 9), d = rand(2, 9), k = rand(2, 12); return { text: `${a} × ${b} − ${d * k} ÷ ${d}`, result: a * b - k }; },
    () => { const a = rand(10, 60), b = rand(3, 12), c = rand(3, 12), d = rand(5, 30); return { text: `${a} + ${b} × ${c} − ${d}`, result: a + b * c - d }; },
    () => { const a = rand(5, 25), b = rand(5, 25), c = rand(3, 9), d = rand(2, 40); return { text: `(${a} + ${b}) × ${c} − ${d}`, result: (a + b) * c - d }; },
    () => { const a = rand(7, 15), b = rand(3, 9), c = rand(3, 9); return { text: `${a}² − ${b} × ${c}`, result: a * a - b * c }; },
    () => { const b = rand(2, 9), k = rand(3, 15), c = rand(2, 9), d = rand(3, 12); return { text: `${b * k} ÷ ${b} + ${c} × ${d}`, result: k + c * d }; },
    () => { const a = rand(100, 400), b = rand(11, 19), c = rand(4, 9); return { text: `${a} − ${b} × ${c}`, result: a - b * c }; }
  ];
  return pick(forms)();
}

function generateLetters() {
  const out = [];
  for (let i = 0; i < 4; i++) out.push(pick(data.vowels));
  for (let i = 0; i < 5; i++) out.push(pick(data.consonants));
  return shuffle(out);
}

/* ---------- Renderer dei tipi di sfida ---------- */
const RENDER = {
  riddle() { els.prompt.textContent = card.q; els.hint.textContent = hint("riddle"); setupTimer(45); setSolution(card.a); },
  logic() { els.prompt.textContent = card.q; els.hint.textContent = hint("logic"); setupTimer(45); setSolution(card.a); },
  sequence() {
    els.prompt.textContent = card.q; els.prompt.classList.add("is-big");
    els.hint.textContent = hint("sequence"); setupTimer(40); setSolution(card.a, card.note);
  },
  list() { els.prompt.textContent = card.q; els.hint.textContent = hint("list"); setupTimer(card.time || 40); setSolution(card.a, hint("listNote")); },
  oddOne() {
    els.prompt.textContent = card.q; els.prompt.classList.add("is-big");
    els.hint.textContent = hint("oddOne"); setupTimer(30); setSolution(card.a, card.note);
  },
  anagram() {
    const word = card.word;
    let scrambled = word;
    for (let i = 0; i < 20 && scrambled === word; i++) scrambled = shuffle(word.split("")).join("");
    els.prompt.textContent = scrambled.split("").join(" ");
    els.prompt.classList.add("is-big");
    els.hint.textContent = hint("anagram", { n: word.length });
    setupTimer(30);
    setSolution(word.charAt(0) + word.slice(1).toLowerCase());
  },
  maths() {
    const { text, result } = generateCalc();
    els.prompt.textContent = hint("mathsPrompt");
    els.prompt.classList.add("is-muted");
    els.hint.textContent = hint("maths");
    const show = (full) => {
      els.prompt.classList.remove("is-muted");
      els.prompt.classList.add("is-big");
      els.prompt.textContent = full ? `${text} = ${result}` : `${text} = ?`;
    };
    setupTimer(10, () => show(false));
    setSolution(String(result));
    card.onReveal = () => show(true);
  },
  estimate() {
    els.prompt.textContent = card.q;
    els.hint.textContent = hint("estimate");
    setupTimer(30);
    estimateInputs(card.a);
    setSolution(fmt(card.a) + (card.unit ? ` ${card.unit}` : ""));
  },
  dots() {
    const n = rand(35, 140);
    els.prompt.textContent = t("dotsPrompt");
    els.hint.textContent = hint("dots");
    const canvas = h("canvas", { class: "dl-dots", width: 800, height: 600, role: "img", "aria-label": t("dotsPrompt") });
    const ctx = canvas.getContext("2d");
    const dots = [];
    let guard = 0;
    while (dots.length < n && guard++ < 20000) {
      const x = rand(20, 780), y = rand(20, 580);
      if (dots.every((d) => (d.x - x) ** 2 + (d.y - y) ** 2 > 26 * 26)) dots.push({ x, y });
    }
    const draw = (visible) => {
      ctx.clearRect(0, 0, 800, 600);
      if (!visible) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.font = "bold 120px Poppins, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("?", 400, 300);
        return;
      }
      ctx.fillStyle = "#4dd9ff";
      dots.forEach((d) => { ctx.beginPath(); ctx.arc(d.x, d.y, 8, 0, Math.PI * 2); ctx.fill(); });
    };
    draw(false);
    const btn = h("button", { type: "button", class: "btn btn--accent", onclick: () => {
      btn.disabled = true;
      draw(true);
      const id = setTimeout(() => draw(false), 3000);
      cleanups.push(() => clearTimeout(id));
    } }, `👁 ${t("dotsShow")}`);
    els.widget.append(canvas, btn);
    card.onReveal = () => draw(true);
    estimateInputs(dots.length);
    setSolution(`${dots.length} ${t("dotsUnit")}`);
  },
  stopwatch() {
    const target = pick([5, 7, 10, 12, 15]);
    els.prompt.textContent = t("stopwatchPrompt", { s: fmt2(target) });
    els.hint.textContent = hint("stopwatch");
    const results = new Array(teams().length).fill(null);
    let current = -1, startAt = 0, raf = null;
    const display = h("div", { class: "dl-stopwatch", "aria-live": "off" }, fmt2(0));
    const buttons = h("div", { class: "gk-actions" });
    const list = h("div", { class: "gk-answers" });
    els.widget.append(display, buttons, list);

    const renderButtons = () => {
      buttons.innerHTML = "";
      if (current >= 0) {
        buttons.append(h("button", { type: "button", class: "btn btn--accent btn--lg", onclick: stop }, `⏹ ${t("stopwatchStop", { name: teams()[current].name })}`));
      } else {
        teams().forEach((team, i) => buttons.append(h("button", {
          type: "button", class: "btn btn--ghost btn--sm", disabled: results[i] !== null, onclick: () => start(i)
        }, `▶ ${t("turnOf", { name: team.name })}`)));
      }
    };
    const tick = () => {
      const s = (performance.now() - startAt) / 1000;
      if (s < 1) { display.textContent = fmt2(s); display.classList.remove("is-blind"); }
      else { display.textContent = "??"; display.classList.add("is-blind"); }
      raf = requestAnimationFrame(tick);
    };
    function start(i) { current = i; startAt = performance.now(); beep(520, 0.1); renderButtons(); tick(); }
    function stop() {
      if (current < 0) return;
      cancelAnimationFrame(raf);
      const s = Math.round(((performance.now() - startAt) / 1000) * 100) / 100;
      results[current] = s;
      display.classList.remove("is-blind");
      display.textContent = fmt2(s);
      current = -1;
      beep(880, 0.12);
      renderButtons();
      resultsList(list, results, (r) => {
        const d = r - target;
        return `${fmt2(r)} s (${d >= 0 ? "+" : "−"}${fmt2(Math.abs(d))})`;
      }, (a, b) => Math.abs(a - target) < Math.abs(b - target));
    }
    const onKey = (e) => { if (e.code === "Space" && current >= 0) { e.preventDefault(); stop(); } };
    document.addEventListener("keydown", onKey);
    cleanups.push(() => { document.removeEventListener("keydown", onKey); cancelAnimationFrame(raf); });
    renderButtons();
  },
  memory() {
    const items = shuffle(data.memoPool.slice()).slice(0, 15);
    els.prompt.textContent = t("memoryPrompt");
    els.hint.textContent = hint("memory");
    const grid = h("div", { class: "dl-memo" });
    const counter = h("div", { class: "dl-big-num" }, "20");
    const draw = (visible) => {
      grid.innerHTML = "";
      items.forEach((e) => grid.append(h("div", {}, visible ? e : "❓")));
    };
    draw(false);
    const btn = h("button", { type: "button", class: "btn btn--accent", onclick: () => {
      btn.disabled = true;
      draw(true);
      const end = Date.now() + 20000;
      const id = setInterval(() => {
        const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
        counter.textContent = left;
        if (left <= 3 && left > 0) beep(660, 0.08);
        if (left <= 0) { clearInterval(id); draw(false); beep(200, 0.4, "sawtooth"); counter.textContent = t("memoryWrite"); }
      }, 250);
      cleanups.push(() => clearInterval(id));
    } }, `👁 ${t("memoryShow")}`);
    els.widget.append(grid, counter, btn);
    setSolution(items.join("  "), t("memoryNote"));
    card.onReveal = () => draw(true);
  },
  simon() {
    const sequence = Array.from({ length: 40 }, () => rand(0, 3));
    const results = new Array(teams().length).fill(null);
    let current = -1, level = 0, pos = 0, accepting = false;
    els.prompt.textContent = t("simonPrompt");
    els.hint.textContent = hint("simon");
    const status = h("p", { class: "dl-status", "aria-live": "polite" }, t("simonPick"));
    const pads = SIMON.map((c, i) => h("button", { type: "button", "--pad": c.color, disabled: true, "aria-label": data.simonColors[i] }));
    const grid = h("div", { class: "dl-simon" }, pads);
    const buttons = h("div", { class: "gk-actions" });
    const list = h("div", { class: "gk-answers" });
    els.widget.append(status, grid, buttons, list);
    const timeouts = [];
    cleanups.push(() => timeouts.forEach(clearTimeout));
    const flash = (i, ms) => {
      pads[i].classList.add("is-lit");
      beep(SIMON[i].freq, (ms / 1000) * 0.9);
      timeouts.push(setTimeout(() => pads[i].classList.remove("is-lit"), ms));
    };
    const renderButtons = () => {
      buttons.innerHTML = "";
      if (current >= 0) return;
      teams().forEach((team, i) => buttons.append(h("button", {
        type: "button", class: "btn btn--ghost btn--sm", disabled: results[i] !== null, onclick: () => startTurn(i)
      }, `▶ ${t("turnOf", { name: team.name })}`)));
    };
    const playLevel = () => {
      accepting = false;
      pads.forEach((p) => { p.disabled = true; });
      status.textContent = t("simonWatch", { name: teams()[current].name, n: level });
      const speed = Math.max(260, 620 - level * 25);
      for (let k = 0; k < level; k++) timeouts.push(setTimeout(() => flash(sequence[k], speed * 0.75), 600 + k * speed));
      timeouts.push(setTimeout(() => {
        accepting = true;
        pos = 0;
        pads.forEach((p) => { p.disabled = false; });
        status.textContent = t("simonGo", { name: teams()[current].name, n: level });
      }, 600 + level * speed));
    };
    function startTurn(i) { current = i; level = 1; renderButtons(); playLevel(); }
    function endTurn(score) {
      results[current] = score;
      accepting = false;
      pads.forEach((p) => { p.disabled = true; });
      status.textContent = `${teams()[current].name}: ${t("simonResult", { n: score })}`;
      current = -1;
      renderButtons();
      resultsList(list, results, (r) => t("simonResult", { n: r }), (a, b) => a > b);
    }
    pads.forEach((pad, i) => pad.addEventListener("click", () => {
      if (!accepting) return;
      flash(i, 220);
      if (i !== sequence[pos]) { beep(150, 0.5, "sawtooth"); endTurn(level - 1); return; }
      pos++;
      if (pos === level) {
        accepting = false;
        if (level >= sequence.length) { endTurn(level); return; }
        level++;
        timeouts.push(setTimeout(playLevel, 700));
      }
    }));
    renderButtons();
  },
  reflex() {
    els.prompt.textContent = t("reflexPrompt");
    els.hint.textContent = hint("reflex");
    const list = teams();
    let phase = "idle", goAt = 0, timeoutId = null;
    const falseStart = new Set();
    const times = {};
    const light = h("div", { class: "dl-light", "aria-live": "assertive" }, t("reflexReady"));
    const results = [];
    const zones = list.map((team, i) => {
      const res = h("span", {});
      results.push(res);
      const zone = h("div", { class: "dl-zone", "--team-color": team.color, role: "button", tabindex: "0" },
        h("kbd", {}, TEAM_KEYS[i] || ""), h("span", {}, team.name), res);
      zone.addEventListener("pointerdown", (e) => { e.preventDefault(); press(i); });
      return zone;
    });
    const btn = h("button", { type: "button", class: "btn btn--accent btn--lg" }, `▶ ${t("reflexStart")}`);
    els.widget.append(light, h("div", { class: "dl-zones" }, zones), btn);

    const finish = () => {
      const alive = list.map((_, i) => i).filter((i) => !falseStart.has(i));
      const pressed = Object.keys(times).map(Number);
      if (phase === "go" && (pressed.length >= alive.length || (pressed.length > 0 && Date.now() - goAt > 1500))) {
        phase = "done";
        const best = pressed.length ? Math.min(...pressed.map((i) => times[i])) : null;
        pressed.forEach((i) => { if (times[i] === best) zones[i].classList.add("is-winner"); });
        suggest(pressed.filter((i) => times[i] === best));
        light.className = "dl-light";
        light.textContent = pressed.length ? t("reflexDone") : t("reflexNobody");
        btn.disabled = false;
        btn.textContent = `🔁 ${t("reflexAgain")}`;
      }
    };
    function press(i) {
      if (i >= list.length || falseStart.has(i) || times[i] !== undefined) return;
      if (phase === "wait") {
        falseStart.add(i);
        zones[i].classList.add("is-false");
        results[i].textContent = t("reflexFalse");
        beep(150, 0.3, "sawtooth");
        if (falseStart.size === list.length) {
          clearTimeout(timeoutId);
          phase = "done";
          light.className = "dl-light";
          light.textContent = t("reflexAllOut");
          btn.disabled = false;
          btn.textContent = `🔁 ${t("reflexAgain")}`;
          suggest([]);
        }
        return;
      }
      if (phase !== "go") return;
      times[i] = Date.now() - goAt;
      results[i].textContent = `${times[i]} ms`;
      finish();
      if (phase === "go") setTimeout(finish, 1600);
    }
    const onKey = (e) => {
      const idx = TEAM_KEYS.indexOf(e.key.toUpperCase());
      if (idx >= 0 && (phase === "wait" || phase === "go")) { e.preventDefault(); press(idx); }
    };
    document.addEventListener("keydown", onKey);
    cleanups.push(() => { document.removeEventListener("keydown", onKey); clearTimeout(timeoutId); });
    btn.addEventListener("click", () => {
      falseStart.clear();
      Object.keys(times).forEach((k) => delete times[k]);
      zones.forEach((z, i) => { z.classList.remove("is-winner", "is-false"); results[i].textContent = ""; });
      suggest([]);
      btn.disabled = true;
      phase = "wait";
      light.className = "dl-light is-wait";
      light.textContent = t("reflexWait");
      timeoutId = setTimeout(() => {
        phase = "go";
        goAt = Date.now();
        light.className = "dl-light is-go";
        light.textContent = t("reflexGo");
        beep(1000, 0.15, "square");
      }, rand(2000, 6000));
    });
  },
  letters() {
    const letters = generateLetters();
    els.prompt.textContent = t("lettersPrompt");
    els.hint.textContent = hint("letters");
    els.widget.append(h("div", { class: "dl-tiles", "aria-label": letters.join(" ") }, letters.map((l) => h("span", {}, l))));
    const rows = teamInputs(t("lettersPlaceholder"));
    els.widget.append(h("button", { type: "button", class: "btn btn--ghost btn--sm", onclick: () => {
      const scores = rows.map(({ row, input, mark }) => {
        const word = input.value.trim().toUpperCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^A-Z]/g, "");
        row.classList.remove("is-best", "is-wrong");
        if (!word) { mark.textContent = "—"; return 0; }
        const pool = letters.slice();
        const ok = word.split("").every((ch) => {
          const k = pool.indexOf(ch);
          if (k < 0) return false;
          pool.splice(k, 1);
          return true;
        });
        if (!ok) { row.classList.add("is-wrong"); mark.textContent = t("lettersBad"); return 0; }
        mark.textContent = t("lettersCount", { n: word.length });
        return word.length;
      });
      const best = Math.max(...scores);
      if (best > 0) {
        scores.forEach((s, i) => rows[i].row.classList.toggle("is-best", s === best));
        suggest(scores.map((s, i) => (s === best ? i : -1)).filter((i) => i >= 0));
      } else suggest([]);
    } }, `🔍 ${t("lettersCheck")}`));
    setupTimer(60);
  }
};

/* ---------- Fine partita ---------- */
$("[data-end]").addEventListener("click", () => {
  stopTimer();
  cleanups.forEach((fn) => { try { fn(); } catch (e) { /* ignorato */ } });
  cleanups = [];
  els.ranking.innerHTML = "";
  teams().slice().sort((a, b) => b.score - a.score).forEach((team) => {
    els.ranking.append(h("li", { "--team-color": team.color }, h("span", {}, team.name), h("strong", {}, team.score)));
  });
  els.resultLine.textContent = t("resultLine", { n: round });
  views.show("result");
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  round = 0;
  buildDeck();
  views.show("play", { focus: false });
  nextCard(false);
});

renderTypes();
buildDeck();
nextCard(false);
