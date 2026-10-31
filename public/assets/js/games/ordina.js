/* =========================================================
   ORDINA / SORT IT
   Ogni squadra riordina la propria fila di carte secondo la regola
   (dal valore più alto al più basso o viceversa). "Verifica" dice
   quante carte sono fuori posto; il conduttore assegna il punto e
   la soluzione con i valori reali viene mostrata a tutti.
   Contenuti: assets/data/ordina.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createDeck, createViews, mountScoreboard, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);

const els = {
  counts: $("[data-counts]"), counter: $("[data-counter]"), title: $("[data-title]"), rule: $("[data-rule]"),
  hintLeft: $("[data-hint-left]"), hintRight: $("[data-hint-right]"), rows: $("[data-rows]"),
  ranking: $("[data-ranking]"), resultLine: $("[data-result-line]")
};

/* ---------- Valori: le età sono date di nascita "bAAAA-MM-GG" ---------- */
function ageFrom(iso) {
  const b = new Date(`${iso}T00:00:00`), now = new Date();
  let age = now.getFullYear() - b.getFullYear();
  if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--;
  return age;
}
const parse = (raw) => {
  const [name, v, emoji] = raw.split("|");
  return { name, emoji, value: v.startsWith("b") ? ageFrom(v.slice(1)) : Number(v) };
};
const fmt = (v, unit) => {
  const year = /anno|year/i.test(unit) && Number.isInteger(v);
  const num = year ? String(v) : v.toLocaleString(data.locale, { maximumFractionDigits: 2 });
  return year ? num : `${num} ${unit}`;
};

/* Avatar: emoji oppure iniziali su gradiente (nessuna immagine esterna) */
function avatar(item) {
  const el = document.createElement("span");
  el.className = "in-avatar";
  el.setAttribute("aria-hidden", "true");
  if (item.emoji) { el.textContent = item.emoji; return el; }
  const words = item.name.replace(/[()\-–:]/g, " ").split(/\s+/).filter((w) => /^[\p{L}\d]/u.test(w));
  el.textContent = (words.length > 1 ? words[0][0] + words[1][0] : item.name.slice(0, 2)).toUpperCase();
  let h = 0;
  for (const ch of item.name) h = (h * 31 + ch.charCodeAt(0)) % 360;
  el.classList.add("is-initials");
  el.style.setProperty("--av", `linear-gradient(140deg, hsl(${h} 70% 52%), hsl(${(h + 40) % 360} 70% 38%))`);
  return el;
}

/* ---------- Stato ---------- */
const deck = createDeck(data.categories);
let perRound = 6;
let played = 0;
let cat = null;
let solution = [];
let rows = []; // [{ order: [item], solved }]
let drag = null;
const teams = () => PG.teams.list();

function renderCounts() {
  els.counts.innerHTML = "";
  for (let n = 4; n <= 10; n++) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (n === perRound ? " is-active" : "");
    b.setAttribute("aria-pressed", String(n === perRound));
    b.textContent = n;
    b.addEventListener("click", () => { perRound = n; renderCounts(); loadCategory(deck.current); });
    els.counts.append(b);
  }
}

function shuffleArr(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function loadCategory(c) {
  cat = c;
  els.counter.textContent = `${cat.icon} ${t("counter", { n: played + 1 })}`;
  els.title.textContent = cat.title;
  els.rule.textContent = cat.rule;
  els.rule.classList.remove("is-enter"); void els.rule.offsetWidth; els.rule.classList.add("is-enter");
  const items = shuffleArr(cat.items.map(parse)).slice(0, Math.min(perRound, cat.items.length));
  solution = items.slice().sort((a, b) => (cat.order === "desc" ? b.value - a.value : a.value - b.value));
  const desc = cat.order === "desc";
  els.hintLeft.textContent = desc ? t("high") : t("lowFirst");
  els.hintRight.textContent = desc ? t("low") : t("highLast");
  rows = teams().map(() => ({ order: shuffleArr(items.slice()), solved: false }));
  renderRows();
}

function renderRows() {
  els.rows.innerHTML = "";
  teams().forEach((team, r) => {
    if (!rows[r]) return;
    const wrap = document.createElement("section");
    wrap.className = "or-row";
    wrap.style.setProperty("--team-color", team.color);
    const head = document.createElement("div");
    head.className = "or-row__head";
    const name = Object.assign(document.createElement("p"), { className: "or-row__name", textContent: team.name });
    const actions = document.createElement("div");
    actions.className = "or-row__actions";
    const result = Object.assign(document.createElement("span"), { className: "or-row__result" });
    result.setAttribute("aria-live", "polite");
    const verify = Object.assign(document.createElement("button"), { type: "button", className: "btn btn--ghost btn--sm", textContent: t("verify") });
    verify.addEventListener("click", () => {
      const wrong = rows[r].order.filter((it, i) => it.value !== solution[i].value).length;
      result.textContent = wrong ? (wrong === 1 ? t("error") : t("errors", { n: wrong })) : t("perfect");
      result.classList.toggle("is-ok", !wrong);
      beep(wrong ? 330 : 880, 0.15);
    });
    const award = Object.assign(document.createElement("button"), { type: "button", className: "btn btn--accent btn--sm", textContent: t("award") });
    award.addEventListener("click", () => { PG.teams.addScore(r, 1); celebrate(1500); revealAll(); });
    if (rows[r].solved) { verify.disabled = true; award.disabled = true; }
    actions.append(result, verify, award);
    head.append(name, actions);
    const track = document.createElement("div");
    track.className = "or-track";
    track.dataset.row = r;
    wrap.append(head, track);
    els.rows.append(wrap);
    renderTrack(r);
    bindTrack(track, r);
  });
}

function renderTrack(r) {
  const track = els.rows.querySelector(`[data-row="${r}"]`);
  const row = rows[r];
  track.innerHTML = "";
  row.order.forEach((item, pos) => {
    const box = document.createElement("div");
    box.className = "or-item" + (row.solved ? ` is-solved ${item.value === solution[pos].value ? "is-right" : "is-wrong"}` : "");
    box.dataset.pos = pos;
    box.draggable = !row.solved;
    box.tabIndex = row.solved ? -1 : 0;
    box.setAttribute("role", "listitem");
    box.setAttribute("aria-label", `${pos + 1}. ${item.name}${row.solved ? ` — ${fmt(item.value, cat.unit)}` : ""}`);
    const moves = document.createElement("span");
    moves.className = "or-item__moves";
    [[-1, "◀", "moveLeft"], [1, "▶", "moveRight"]].forEach(([dir, txt, key]) => {
      const b = Object.assign(document.createElement("button"), { type: "button", textContent: txt });
      b.dataset.dir = dir;
      b.setAttribute("aria-label", t(key, { name: item.name }));
      b.disabled = row.solved || (dir < 0 ? pos === 0 : pos === row.order.length - 1);
      moves.append(b);
    });
    box.append(
      Object.assign(document.createElement("span"), { className: "or-item__pos", textContent: pos + 1 }),
      avatar(item),
      Object.assign(document.createElement("span"), { className: "or-item__name", textContent: item.name }),
      Object.assign(document.createElement("span"), { className: "or-item__value", textContent: row.solved ? fmt(item.value, cat.unit) : "" }),
      moves
    );
    track.append(box);
  });
}

function move(r, from, to) {
  const row = rows[r];
  if (row.solved || to < 0 || to >= row.order.length || from === to) return;
  const [it] = row.order.splice(from, 1);
  row.order.splice(to, 0, it);
  renderTrack(r);
  const box = els.rows.querySelector(`[data-row="${r}"]`).children[to];
  if (box) box.focus({ preventScroll: true });
}

function bindTrack(track, r) {
  track.setAttribute("role", "list");
  track.addEventListener("click", (e) => {
    const b = e.target.closest("button[data-dir]");
    if (!b || b.disabled) return;
    const pos = Number(b.closest(".or-item").dataset.pos);
    move(r, pos, pos + Number(b.dataset.dir));
  });
  track.addEventListener("keydown", (e) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    const box = e.target.closest(".or-item");
    if (!box) return;
    e.preventDefault();
    const pos = Number(box.dataset.pos);
    move(r, pos, pos + (e.key === "ArrowLeft" ? -1 : 1));
  });
  track.addEventListener("dragstart", (e) => {
    const box = e.target.closest(".or-item");
    if (!box || rows[r].solved) return;
    drag = { r, pos: Number(box.dataset.pos) };
    box.classList.add("is-dragging");
    e.dataTransfer.effectAllowed = "move";
  });
  track.addEventListener("dragend", () => { drag = null; track.querySelectorAll(".is-dragging, .is-over").forEach((x) => x.classList.remove("is-dragging", "is-over")); });
  track.addEventListener("dragover", (e) => {
    if (!drag || drag.r !== r) return;
    e.preventDefault();
    track.querySelectorAll(".is-over").forEach((x) => x.classList.remove("is-over"));
    const over = e.target.closest(".or-item");
    if (over) over.classList.add("is-over");
  });
  track.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!drag || drag.r !== r) return;
    const target = e.target.closest(".or-item");
    const to = target ? Number(target.dataset.pos) : rows[r].order.length - 1;
    const from = drag.pos;
    drag = null;
    move(r, from, to);
  });
}

function revealAll() {
  rows.forEach((row) => { row.solved = true; });
  renderRows();
}

$("[data-reveal]").addEventListener("click", revealAll);
$("[data-next]").addEventListener("click", () => { played++; loadCategory(deck.next()); });

$("[data-end]").addEventListener("click", () => {
  els.ranking.innerHTML = "";
  teams().slice().sort((a, b) => b.score - a.score).forEach((tm) => {
    const li = document.createElement("li");
    li.style.setProperty("--team-color", tm.color);
    li.append(Object.assign(document.createElement("span"), { textContent: tm.name }), Object.assign(document.createElement("strong"), { textContent: tm.score }));
    els.ranking.append(li);
  });
  els.resultLine.textContent = t("resultLine", { n: played + 1 });
  views.show("result");
  PG.ads.reveal("results");
});

$("[data-restart]").addEventListener("click", () => {
  played = 0;
  views.show("play", { focus: false });
  loadCategory(deck.next());
});

// Se cambia il numero di squadre, si aggiungono o tolgono le file
PG.teams.onChange((list) => {
  if (list.length === rows.length) { renderRows(); return; }
  const items = solution.slice();
  while (rows.length < list.length) rows.push({ order: shuffleArr(items.slice()), solved: rows.some((x) => x.solved) });
  rows.length = list.length;
  renderRows();
});

mountScoreboard($("[data-scoreboard]"));
renderCounts();
loadCategory(deck.current);
