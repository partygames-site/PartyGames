/* =========================================================
   SKILL TEST
   Sfide di percezione visiva generate in SVG (nessuna immagine):
   colore diverso, forma diversa, combinazione, specchio,
   sequenza logica, conteggio e trova l'emoji.
   La squadra di turno ha `seconds` secondi per toccare la risposta:
   giusta = +1, sbagliata o tempo scaduto = la sfida passa alla
   squadra successiva. La difficoltà cresce ogni 3 sfide.
   Contenuti: assets/data/skill-test.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createViews, mountScoreboard, shuffle, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const tp = createI18n(data.ui.prompts);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);
const SECONDS = data.seconds || 10;
const NS = "http://www.w3.org/2000/svg";

const els = {
  types: $("[data-types]"), counter: $("[data-counter]"), level: $("[data-level]"), prompt: $("[data-prompt]"),
  target: $("[data-target]"), seq: $("[data-seq]"), grid: $("[data-grid]"), turn: $("[data-turn]"),
  fill: $("[data-fill]"), timeText: $("[data-time]"), next: $("[data-next]"), ranking: $("[data-ranking]"), resultLine: $("[data-result-line]")
};

/* ---------- Utilità ---------- */
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const HUES = [0, 28, 48, 130, 175, 205, 255, 290, 330];
const color = (h, l = 56) => `hsl(${h} 78% ${l}%)`;

/* ---------- Forme SVG (viewBox 0 0 100 100) ---------- */
function starPoints(n, outer = 40, inner = 18) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer, a = (Math.PI / n) * i - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(" ");
}
function polyPoints(n, r = 40, rot = -90) {
  return Array.from({ length: n }, (_, i) => {
    const a = ((360 / n) * i + rot) * Math.PI / 180;
    return `${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}
const SHAPES = {
  circle: () => ["circle", { cx: 50, cy: 50, r: 38 }],
  square: () => ["rect", { x: 14, y: 14, width: 72, height: 72, rx: 6 }],
  triangle: () => ["polygon", { points: "50,10 90,84 10,84" }],
  star: (n = 5) => ["polygon", { points: starPoints(n) }],
  hexagon: () => ["polygon", { points: polyPoints(6) }],
  diamond: () => ["polygon", { points: "50,8 90,50 50,92 10,50" }],
  arrow: () => ["polygon", { points: "50,8 84,46 62,46 62,92 38,92 38,46 16,46" }]
};
const SHAPE_KEYS = ["circle", "square", "triangle", "star", "hexagon", "diamond"];

function svg(children, label) {
  const el = document.createElementNS(NS, "svg");
  el.setAttribute("viewBox", "0 0 100 100");
  el.setAttribute("aria-hidden", "true");
  if (label) el.dataset.label = label;
  children.forEach((c) => el.append(c));
  return el;
}
function shapeEl(kind, fill, { rotate = 0, scale = 1, arg } = {}) {
  const [tag, attrs] = SHAPES[kind](arg);
  const el = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  el.setAttribute("fill", fill);
  const tf = [];
  if (rotate) tf.push(`rotate(${rotate} 50 50)`);
  if (scale !== 1) tf.push(`translate(50 50) scale(${scale}) translate(-50 -50)`);
  if (tf.length) el.setAttribute("transform", tf.join(" "));
  return el;
}

/* Pentamini chirali: la loro immagine allo specchio non è una rotazione */
const PENTOMINOES = [
  [[1, 0], [2, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [1, 3]],
  [[1, 0], [1, 1], [0, 2], [1, 2], [0, 3]],
  [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2]],
  [[1, 0], [0, 1], [1, 1], [1, 2], [1, 3]]
];
function polyomino(cells, fill, { rotate = 0, mirror = false } = {}) {
  const g = document.createElementNS(NS, "g");
  const size = 18, off = 50 - size * 2;
  cells.forEach(([x, y]) => {
    const r = document.createElementNS(NS, "rect");
    Object.entries({ x: off + x * size, y: off + y * size, width: size - 2, height: size - 2, rx: 3, fill }).forEach(([k, v]) => r.setAttribute(k, v));
    g.append(r);
  });
  const tf = [`rotate(${rotate} 50 50)`];
  if (mirror) tf.push("translate(100 0) scale(-1 1)");
  g.setAttribute("transform", tf.join(" "));
  return g;
}

/* ---------- Generatori delle sfide ----------
   Ognuno restituisce { prompt, target?, seq?, options: [Node], answer, cols } */
const GEN = {
  oddColor(level) {
    const n = Math.min(36, 16 + level * 2), h = pick(HUES), shape = pick(SHAPE_KEYS);
    const delta = Math.max(4, 20 - level * 2), answer = rand(0, n - 1);
    const options = Array.from({ length: n }, (_, i) => svg([shapeEl(shape, color(h, i === answer ? 56 + delta : 56))]));
    return { prompt: tp("oddColor"), options, answer, cols: n > 25 ? 6 : n > 16 ? 5 : 4 };
  },
  oddShape(level) {
    const n = Math.min(30, 12 + level * 2), h = pick(HUES), answer = rand(0, n - 1);
    const variant = pick(["rotate", "star"]);
    const angle = Math.max(8, 40 - level * 4);
    const options = Array.from({ length: n }, (_, i) => {
      if (variant === "star") return svg([shapeEl("star", color(h), { arg: i === answer ? 6 : 5 })]);
      return svg([shapeEl("arrow", color(h), { rotate: i === answer ? angle : 0 })]);
    });
    return { prompt: tp("oddShape"), options, answer, cols: n > 20 ? 6 : n > 12 ? 5 : 4 };
  },
  target(level) {
    const n = Math.min(30, 12 + level * 2);
    const tShape = pick(SHAPE_KEYS), tHue = pick(HUES);
    const combos = [];
    while (combos.length < n - 1) {
      // molti "quasi uguali": stessa forma o stesso colore
      const s = Math.random() < 0.45 ? tShape : pick(SHAPE_KEYS);
      const h = Math.random() < 0.45 ? tHue : pick(HUES);
      if (s === tShape && h === tHue) continue;
      combos.push([s, h]);
    }
    const answer = rand(0, n - 1);
    combos.splice(answer, 0, [tShape, tHue]);
    const options = combos.map(([s, h]) => svg([shapeEl(s, color(h))]));
    return { prompt: tp("target"), target: svg([shapeEl(tShape, color(tHue))]), options, answer, cols: n > 20 ? 6 : n > 12 ? 5 : 4 };
  },
  mirror() {
    const cells = pick(PENTOMINOES), fill = color(pick(HUES));
    const angles = shuffle([0, 90, 180, 270, pick([0, 90, 180, 270])]).slice(0, 4);
    const items = angles.map((a) => ({ a, mirror: false }));
    const answer = rand(0, 4);
    items.splice(answer, 0, { a: pick([0, 90, 180, 270]), mirror: true });
    const options = items.map((it) => svg([polyomino(cells, fill, { rotate: it.a, mirror: it.mirror })]));
    return { prompt: tp("mirror"), options, answer, cols: 5 };
  },
  sequence() {
    const rule = pick(["rotate", "dots", "colors", "grow"]);
    const h = pick(HUES);
    let seq, correct, distract;
    if (rule === "rotate") {
      const step = pick([45, 90, 30]), start = pick([0, 45, 90]);
      const mk = (k) => svg([shapeEl("arrow", color(h), { rotate: start + step * k })]);
      seq = [0, 1, 2, 3].map(mk);
      correct = mk(4);
      distract = [mk(3), mk(5), mk(6)];
    } else if (rule === "dots") {
      const start = rand(1, 3);
      const dots = (n) => {
        const nodes = [];
        for (let i = 0; i < n; i++) {
          const c = document.createElementNS(NS, "circle");
          const col = i % 3, row = Math.floor(i / 3);
          Object.entries({ cx: 25 + col * 25, cy: 25 + row * 25, r: 9, fill: color(h) }).forEach(([k, v]) => c.setAttribute(k, v));
          nodes.push(c);
        }
        return svg(nodes);
      };
      seq = [0, 1, 2, 3].map((k) => dots(start + k));
      correct = dots(start + 4);
      distract = [dots(start + 3), dots(start + 5), dots(Math.max(1, start + 2))];
    } else if (rule === "colors") {
      const hues = shuffle(HUES.slice()).slice(0, 3), shape = pick(SHAPE_KEYS);
      const mk = (k) => svg([shapeEl(shape, color(hues[k % 3]))]);
      seq = [0, 1, 2, 3].map(mk);
      correct = mk(4);
      const other = HUES.find((x) => !hues.includes(x));
      distract = [mk(3), mk(5), svg([shapeEl(shape, color(other))])];
    } else {
      const shape = pick(SHAPE_KEYS);
      const mk = (s) => svg([shapeEl(shape, color(h), { scale: s })]);
      seq = [0.3, 0.45, 0.6, 0.75].map(mk);
      correct = mk(0.9);
      distract = [mk(0.75), mk(0.5), mk(0.35)];
    }
    const options = shuffle([correct, ...distract]);
    return { prompt: tp("sequence"), seq, options, answer: options.indexOf(correct), cols: 4 };
  },
  count(level) {
    const n = Math.min(32, 16 + level * 2), types = shuffle(SHAPE_KEYS.slice()).slice(0, 3 + Math.min(2, Math.floor(level / 3)));
    const ask = types[0];
    const items = Array.from({ length: n }, () => pick(types));
    const real = items.filter((x) => x === ask).length || (items[0] = ask, 1);
    const big = document.createElementNS(NS, "g");
    items.forEach((s, i) => {
      const col = i % 8, row = Math.floor(i / 8);
      const g = document.createElementNS(NS, "g");
      g.setAttribute("transform", `translate(${col * 50} ${row * 50}) scale(.45)`);
      g.append(shapeEl(s, color(pick(HUES))));
      big.append(g);
    });
    const board = document.createElementNS(NS, "svg");
    board.setAttribute("viewBox", `0 0 400 ${Math.ceil(n / 8) * 50}`);
    board.setAttribute("aria-hidden", "true");
    board.append(big);
    const nums = new Set([real]);
    while (nums.size < 4) nums.add(Math.max(0, real + pick([-3, -2, -1, 1, 2, 3])));
    const values = shuffle([...nums]);
    const options = values.map((v) => Object.assign(document.createElement("span"), { className: "sk-num", textContent: v }));
    return { prompt: tp("count", { shape: data.ui.shapes[ask] }), target: board, wide: true, options, answer: values.indexOf(real), cols: 4 };
  },
  emoji(level) {
    const set = pick(data.emojiSets), n = Math.min(set.length, 12 + level * 2);
    const chosen = shuffle(set.slice()).slice(0, n), answer = rand(0, n - 1);
    const options = chosen.map((e) => Object.assign(document.createElement("span"), { className: "sk-emoji", textContent: e }));
    return { prompt: tp("emoji"), target: Object.assign(document.createElement("span"), { className: "sk-emoji", textContent: chosen[answer] }), options, answer, cols: n > 20 ? 6 : n > 12 ? 5 : 4 };
  }
};

/* ---------- Stato ---------- */
let enabled = new Set(Object.keys(GEN));
let count = 0, starter = -1, turn = 0, attempts = 0, challenge = null, done = false, timer = null, left = SECONDS;
const teams = () => PG.teams.list();
const teamAt = (i) => teams()[i % teams().length];

const scoreboard = mountScoreboard($("[data-scoreboard]"), { highlight: (i) => !done && i === turn % teams().length });

function renderTypes() {
  els.types.innerHTML = "";
  Object.keys(GEN).forEach((key) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (enabled.has(key) ? " is-active" : "");
    b.setAttribute("aria-pressed", String(enabled.has(key)));
    b.textContent = data.ui.types[key];
    b.addEventListener("click", () => {
      if (enabled.has(key)) { if (enabled.size === 1) return; enabled.delete(key); } else enabled.add(key);
      renderTypes();
    });
    els.types.append(b);
  });
}

function stopTimer() { clearInterval(timer); timer = null; }
function startTimer() {
  stopTimer();
  left = SECONDS;
  const draw = () => {
    els.fill.style.width = `${(left / SECONDS) * 100}%`;
    els.fill.classList.toggle("is-low", left <= 3);
    els.timeText.textContent = t("timeLeft", { s: left });
  };
  draw();
  timer = setInterval(() => {
    left--;
    draw();
    if (left > 0 && left <= 3) beep(660, 0.08);
    if (left <= 0) { stopTimer(); miss("timeout"); }
  }, 1000);
}

function setTurn(text) { els.turn.textContent = text; scoreboard.redraw(); }

function nextChallenge() {
  const level = 1 + Math.floor(count / 3);
  const type = pick([...enabled]);
  count++;
  starter = (starter + 1) % teams().length;
  turn = starter;
  attempts = 0;
  done = false;
  challenge = GEN[type](level);
  els.counter.textContent = `${data.ui.types[type]} · ${t("counter", { n: count })}`;
  els.level.textContent = t("level", { n: level });
  els.prompt.textContent = challenge.prompt;
  els.target.replaceChildren();
  els.target.hidden = !challenge.target;
  els.target.classList.toggle("is-wide", !!challenge.wide);
  if (challenge.target) els.target.append(challenge.target);
  els.seq.replaceChildren();
  els.seq.hidden = !challenge.seq;
  if (challenge.seq) {
    challenge.seq.forEach((node) => {
      const slot = Object.assign(document.createElement("span"), { className: "sk-seq__item" });
      slot.append(node);
      els.seq.append(slot);
    });
    els.seq.append(Object.assign(document.createElement("span"), { className: "sk-seq__item is-q", textContent: "?" }));
  }
  els.grid.innerHTML = "";
  els.grid.style.setProperty("--cols", challenge.cols);
  challenge.options.forEach((node, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "sk-cell";
    b.setAttribute("aria-label", t("optionLabel", { n: i + 1 }));
    b.append(node);
    b.addEventListener("click", () => choose(i, b));
    els.grid.append(b);
  });
  els.next.hidden = true;
  setTurn(t("turn", { name: teamAt(turn).name }));
  startTimer();
}

function revealAnswer() {
  const cell = els.grid.children[challenge.answer];
  if (cell) cell.classList.add("is-right");
  els.grid.querySelectorAll(".sk-cell").forEach((c) => { c.disabled = true; });
  els.next.hidden = false;
  stopTimer();
}

function choose(i, cell) {
  if (done) return;
  if (i === challenge.answer) {
    done = true;
    const k = turn % teams().length;
    PG.teams.addScore(k, 1);
    beep(880, 0.15); setTimeout(() => beep(1175, 0.2), 120);
    revealAnswer();
    setTurn(t("correct", { name: teamAt(k).name }));
    return;
  }
  cell.classList.add("is-wrong");
  cell.disabled = true;
  miss("wrong");
}

function miss(kind) {
  if (done) return;
  beep(180, 0.3, "sawtooth");
  attempts++;
  const options = els.grid.querySelectorAll(".sk-cell:not(:disabled)").length;
  if (attempts >= teams().length || options <= 1) {
    done = true;
    revealAnswer();
    setTurn(t("allFailed"));
    return;
  }
  turn = (turn + 1) % teams().length;
  setTurn(t(kind, { name: teamAt(turn).name }));
  startTimer();
}

els.next.addEventListener("click", nextChallenge);

$("[data-end]").addEventListener("click", () => {
  stopTimer();
  els.ranking.innerHTML = "";
  teams().slice().sort((a, b) => b.score - a.score).forEach((tm) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", tm.color);
    li.append(Object.assign(document.createElement("span"), { textContent: tm.name }), Object.assign(document.createElement("strong"), { textContent: tm.score }));
    els.ranking.append(li);
  });
  els.resultLine.textContent = t("resultLine", { n: count });
  views.show("result");
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => { count = 0; views.show("play", { focus: false }); nextChallenge(); });

renderTypes();
nextChallenge();
