/* =========================================================
   BATTAGLIA ALL'ASTA / AUCTION BATTLE
   Due giocatori, `budget` monete a testa e `itemsPerSession`
   elementi all'asta: chi rilancia di più si aggiudica l'elemento.
   Ognuno deve completare una rosa di `slots` elementi. Alla fine
   il gruppo vota la rosa migliore (+1 punto in classifica).
   Contenuti: assets/data/battaglia-asta.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createViews, mountScoreboard, shuffle, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);
const BUDGET = data.budget, PER_SESSION = data.itemsPerSession, SLOTS = data.slots;

const els = {
  picks: $("[data-picks]"), cats: $("[data-cats]"), catLabel: $("[data-cat-label]"), counter: $("[data-counter]"),
  boards: [$('[data-board="0"]'), $('[data-board="1"]')], itemEmoji: $("[data-item-emoji]"), itemName: $("[data-item-name]"),
  offer: $("[data-offer]"), custom: $("[data-custom]"), assign: [$('[data-assign="0"]'), $('[data-assign="1"]')],
  pass: $("[data-pass]"), forced: $("[data-forced]"), last: $("[data-last]"), final: $("[data-final]"), votes: $("[data-votes]"), voted: $("[data-voted]")
};

const parse = (raw) => { const [name, emoji, dream] = raw.split("|"); return { name, emoji: emoji || "🎁", dream: dream || "" }; };

const state = { picks: [0, 1], cat: null, pool: [], index: 0, offer: 1, players: [], last: null, voted: false };
const team = (k) => PG.teams.list()[state.picks[k]] || { name: "—", color: "#4dd9ff" };

/* ---------- Setup ---------- */
function renderPicks() {
  const list = PG.teams.list();
  els.picks.hidden = list.length <= 2;
  [0, 1].forEach((k) => {
    const sel = root.querySelector(`[data-pick="${k}"]`);
    sel.innerHTML = "";
    list.forEach((tm, i) => sel.append(new Option(tm.name, i, false, i === state.picks[k])));
  });
}
root.querySelectorAll("[data-pick]").forEach((sel) => sel.addEventListener("change", () => {
  const k = Number(sel.getAttribute("data-pick")), v = Number(sel.value);
  if (v === state.picks[1 - k]) state.picks[1 - k] = state.picks[k];
  state.picks[k] = v;
  renderPicks();
}));

data.categories.forEach((cat) => {
  const b = document.createElement("button");
  b.type = "button";
  b.className = "st-cat";
  b.append(Object.assign(document.createElement("span"), { textContent: cat.icon }), cat.label);
  b.firstChild.setAttribute("aria-hidden", "true");
  b.addEventListener("click", () => start(cat));
  els.cats.append(b);
});

/* ---------- Asta ---------- */
function start(cat) {
  state.cat = cat;
  state.pool = shuffle(cat.items.map(parse)).slice(0, PER_SESSION);
  state.index = 0;
  state.players = [0, 1].map(() => ({ budget: BUDGET, items: [] }));
  state.last = null;
  state.voted = false;
  els.catLabel.textContent = `${cat.icon} ${cat.label}`;
  views.show("auction", { focus: false });
  renderItem();
}

const full = (k) => state.players[k].items.length >= SLOTS;

function renderBoards() {
  [0, 1].forEach((k) => {
    const p = state.players[k], el = els.boards[k];
    el.style.setProperty("--team-color", team(k).color);
    el.innerHTML = "";
    el.append(Object.assign(document.createElement("h3"), { className: "ba-board__name", textContent: team(k).name }));
    const budget = Object.assign(document.createElement("p"), { className: "ba-board__budget", textContent: `${p.budget} ${t("coins")}` });
    budget.append(Object.assign(document.createElement("small"), { textContent: t("slots", { n: p.items.length, max: SLOTS }) }));
    el.append(budget);
    const slots = document.createElement("div");
    slots.className = "ba-slots";
    for (let i = 0; i < SLOTS; i++) {
      const it = p.items[i];
      const slot = document.createElement("div");
      slot.className = "ba-slot" + (it ? " is-filled" : "");
      if (it) slot.append(Object.assign(document.createElement("span"), { textContent: it.emoji }), Object.assign(document.createElement("span"), { textContent: it.name }), Object.assign(document.createElement("b"), { textContent: it.price ? `${it.price} ${t("coins")}` : t("free") }));
      slots.append(slot);
    }
    el.append(slots);
  });
}

function renderOffer() {
  els.offer.textContent = `${state.offer} ${t("coins")}`;
  els.offer.classList.remove("is-pulse"); void els.offer.offsetWidth; els.offer.classList.add("is-pulse");
  updateButtons();
}

function updateButtons() {
  [0, 1].forEach((k) => {
    els.assign[k].style.setProperty("--team-color", team(k).color);
    els.assign[k].textContent = t("assignTo", { name: team(k).name });
    els.assign[k].disabled = full(k) || state.offer > state.players[k].budget;
  });
  const forced = full(0) !== full(1);
  els.pass.disabled = forced;
  els.forced.hidden = !forced;
}

function renderItem() {
  if (state.index >= state.pool.length || (full(0) && full(1))) { finish(); return; }
  const item = state.pool[state.index];
  state.offer = 1;
  els.counter.textContent = t("counter", { n: state.index + 1, total: state.pool.length });
  els.itemEmoji.textContent = item.emoji;
  els.itemEmoji.style.animation = "none"; void els.itemEmoji.offsetWidth; els.itemEmoji.style.animation = "";
  els.itemName.textContent = item.name;
  els.last.textContent = !state.last ? "" : state.last.pass
    ? t("lastPass", { emoji: state.last.emoji, name: state.last.name })
    : t("lastAssign", { emoji: state.last.emoji, name: state.last.name, team: state.last.team, price: state.last.price });
  renderBoards();
  renderOffer();
}

root.querySelectorAll("[data-add]").forEach((b) => b.addEventListener("click", () => {
  state.offer = Math.min(99, state.offer + Number(b.dataset.add));
  beep(500 + state.offer * 10, 0.06);
  renderOffer();
}));
$("[data-set]").addEventListener("click", () => {
  const v = parseInt(els.custom.value, 10);
  if (!Number.isNaN(v) && v >= 1) { state.offer = Math.min(99, v); renderOffer(); }
  els.custom.value = "";
});
els.custom.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); $("[data-set]").click(); } });
$("[data-reset]").addEventListener("click", () => { state.offer = 1; renderOffer(); });

els.assign.forEach((btn, k) => btn.addEventListener("click", () => {
  const p = state.players[k];
  if (full(k) || state.offer > p.budget) return;
  const item = state.pool[state.index];
  p.budget -= state.offer;
  p.items.push({ ...item, price: state.offer });
  state.last = { ...item, team: team(k).name, price: state.offer };
  beep(880, 0.15);
  state.index++;
  renderItem();
}));
els.pass.addEventListener("click", () => {
  if (els.pass.disabled) return;
  state.last = { ...state.pool[state.index], pass: true };
  state.index++;
  renderItem();
});

/* ---------- Scena "Stato dei Sogni" (SVG generato, nessuna immagine) ---------- */
const TERRAIN = [["montagne", "🏔️"], ["foresta", "🌳"], ["metropoli", "🏙️"], ["deserto", "🏜️"], ["mare", "🌊"], ["neve", "❄️"], ["isole", "🏝️"], ["campagna", "🌾"]];
const BADGES = [["animali", "🦁"], ["cibo", "🍽️"], ["vitanotturna", "🌃"], ["cultura", "🏛️"], ["sport", "🧗"], ["benessere", "🧖"], ["musica", "🎸"], ["shopping", "🛍️"]];
const DREAM_KEYS = { "🦁": "animali", "🍽️": "cibo", "🌃": "vitanotturna", "🏛️": "cultura", "🧗": "sport", "🧖": "benessere", "🎸": "musica", "🛍️": "shopping" };

function dreamScene(items) {
  const keys = items.map((it) => it.dream || DREAM_KEYS[it.emoji]).filter(Boolean);
  const W = 400, H = 220, ground = H * 0.68;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", t("dreamTitle"));
  const add = (tag, attrs, text) => {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    if (text) el.textContent = text;
    svg.append(el);
    return el;
  };
  if (!keys.length) {
    add("rect", { x: 0, y: 0, width: W, height: H, fill: "#262b38" });
    add("text", { x: W / 2, y: H / 2, "text-anchor": "middle", "font-size": 14, fill: "#ffffff99", "font-family": "sans-serif" }, t("dreamUnknown"));
    return svg;
  }
  const defs = add("defs", {});
  const grad = document.createElementNS(NS, "linearGradient");
  Object.entries({ id: `sky-${Math.random().toString(36).slice(2, 7)}`, x1: 0, y1: 0, x2: 0, y2: 1 }).forEach(([k, v]) => grad.setAttribute(k, v));
  [["0%", "#1e3a5f"], ["60%", "#5b8fc7"], ["100%", "#bfe3f2"]].forEach(([o, c]) => { const st = document.createElementNS(NS, "stop"); st.setAttribute("offset", o); st.setAttribute("stop-color", c); grad.append(st); });
  defs.append(grad);
  add("rect", { x: 0, y: 0, width: W, height: ground, fill: `url(#${grad.id})` });
  add("circle", { cx: W - 50, cy: 40, r: 22, fill: "#ffe28a", opacity: 0.9 });
  add("rect", { x: 0, y: ground, width: W, height: H - ground, fill: "#3d7a3d" });
  const tileW = (W - 16) / TERRAIN.length;
  TERRAIN.forEach(([key, emoji], i) => {
    const cx = 8 + tileW * i + tileW / 2, cy = ground + (H - ground) / 2;
    if (keys.includes(key)) {
      add("text", { x: cx, y: cy + 10, "text-anchor": "middle", "font-size": 28 }, emoji);
      add("text", { x: cx, y: H - 5, "text-anchor": "middle", "font-size": 8, fill: "#ffffffcc", "font-family": "sans-serif" }, data.ui.dreamTerrain[key]);
    } else add("circle", { cx, cy, r: 12, fill: "none", stroke: "#ffffff40", "stroke-width": 1.5, "stroke-dasharray": "3,3" });
  });
  const badgeW = (W - 16) / BADGES.length;
  BADGES.forEach(([key, emoji], i) => {
    const cx = 8 + badgeW * i + badgeW / 2, cy = 26;
    if (keys.includes(key)) {
      add("circle", { cx, cy, r: 15, fill: "#0a0e1a", "fill-opacity": 0.55, stroke: "#ffd166", "stroke-width": 1.5 });
      add("text", { x: cx, y: cy + 6, "text-anchor": "middle", "font-size": 16 }, emoji);
    } else add("circle", { cx, cy, r: 12, fill: "none", stroke: "#ffffff30", "stroke-width": 1.2, "stroke-dasharray": "2,2" });
  });
  return svg;
}

/* ---------- Resoconto e voto ---------- */
function finish() {
  els.final.innerHTML = "";
  [0, 1].forEach((k) => {
    const p = state.players[k];
    const card = document.createElement("section");
    card.className = "ba-roster";
    card.style.setProperty("--team-color", team(k).color);
    card.append(Object.assign(document.createElement("h3"), { textContent: team(k).name }), Object.assign(document.createElement("p"), { className: "gk-hint", textContent: t("budgetLeft", { n: p.budget }) }));
    if (!p.items.length) card.append(Object.assign(document.createElement("p"), { className: "gk-hint", textContent: t("empty") }));
    else {
      const ul = document.createElement("ul");
      p.items.forEach((it) => {
        const li = document.createElement("li");
        li.append(Object.assign(document.createElement("span"), { textContent: it.emoji }), Object.assign(document.createElement("span"), { textContent: it.name }), Object.assign(document.createElement("b"), { textContent: it.price ? `${it.price} ${t("coins")}` : t("free") }));
        ul.append(li);
      });
      card.append(ul);
    }
    if (state.cat.key === "statodeisogni") {
      const dream = document.createElement("div");
      dream.className = "ba-dream";
      dream.append(dreamScene(p.items));
      card.append(dream);
    }
    els.final.append(card);
  });
  els.votes.innerHTML = "";
  els.voted.textContent = "";
  [0, 1].forEach((k) => {
    const b = Object.assign(document.createElement("button"), { type: "button", className: "btn btn--lg", textContent: `🏆 ${t("vote", { name: team(k).name })}` });
    b.style.background = team(k).color;
    b.style.color = "var(--on-accent)";
    b.addEventListener("click", () => {
      if (state.voted) return;
      state.voted = true;
      PG.teams.addScore(state.picks[k], 1);
      els.voted.textContent = t("voted", { name: team(k).name });
      els.votes.querySelectorAll("button").forEach((x) => { x.disabled = true; });
      celebrate();
    });
    els.votes.append(b);
  });
  views.show("final");
  PG.ads.reveal("results");
}

$("[data-rematch]").addEventListener("click", () => views.show("setup"));

mountScoreboard($("[data-scoreboard]"));
PG.teams.onChange(() => { renderPicks(); if (!$("[data-view='auction']").hidden) { renderBoards(); updateButtons(); } });
renderPicks();
views.show("setup", { focus: false });
