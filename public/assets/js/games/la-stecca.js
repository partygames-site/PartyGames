/* =========================================================
   LA STECCA / STACK UP
   Due squadre, una categoria, 5 elementi: per ogni elemento le
   squadre scrivono una risposta (nascosta fino a "Rivela"), il
   gioco la cerca nell'elenco e ne somma il valore. Il totale più
   alto vince la manche (+1 punto in classifica).
   Il conduttore può correggere o aggiungere valori (pannello Master).
   Contenuti: assets/data/la-stecca.<lingua>.mjs
   ========================================================= */
import { loadGameData, createI18n, createViews, mountScoreboard, shuffle, celebrate, beep } from "../core/game-kit.mjs";

const PG = window.PG;
const data = await loadGameData();
const t = createI18n(data.ui);
const root = document.getElementById("game-stage");
const views = createViews(root);
const $ = (sel) => root.querySelector(sel);
const PER_ROUND = data.elementsPerRound || 5;
const EXTRA_KEY = "pg_stecca_extra";
const YEAR = new Date().getFullYear();

const els = {
  picks: $("[data-picks]"), targets: $("[data-targets]"), wins: $("[data-wins]"), cats: $("[data-cats]"),
  manche: $("[data-manche]"), counter: $("[data-counter]"), catName: $("[data-cat-name]"),
  elEmoji: $("[data-el-emoji]"), elName: $("[data-el-name]"), rule: $("[data-rule]"),
  inputs: $("[data-inputs]"), reveal: $("[data-reveal]"), results: $("[data-results]"), leader: $("[data-leader]"),
  next: $("[data-next]"), table: $("[data-table]"), mancheResult: $("[data-manche-result]"),
  winTitle: $("[data-win-title]"), winLine: $("[data-win-line]"),
  master: $("[data-master]"), mTyped: $("[data-m-typed]"), mSelect: $("[data-m-select]"),
  mValue: $("[data-m-value]"), mRemember: $("[data-m-remember]")
};

/* ---------- Dati: "Nome|valore|alias…" → oggetti ---------- */
const parseItem = (raw) => {
  const [name, value, ...alias] = raw.split("|");
  const v = value.startsWith("y") ? YEAR - Number(value.slice(1)) : Number(value);
  return { name, value: v, alias };
};

function loadExtra() { return PG.ui.storage.get(EXTRA_KEY, {}); }
function extraKey(cat, el) { return `${data.locale}:${cat.id}:${el.n}`; }
function itemsOf(cat, el) {
  const base = el.i.map(parseItem);
  const extra = (loadExtra()[extraKey(cat, el)] || []).map((x) => ({ name: x.name, value: x.value, alias: [] }));
  const names = new Set(extra.map((x) => x.name.toLowerCase()));
  return [...base.filter((x) => !names.has(x.name.toLowerCase())), ...extra];
}

/* ---------- Riconoscimento risposte (maiuscole, accenti, piccoli errori) ---------- */
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
  .replace(/&/g, " and ").replace(/[^a-z0-9]+/g, " ").trim();
const stripArticle = (s) => s.replace(/^(the|a|an|il|lo|la|i|gli|le|l|un|uno|una) (?=\S)/, "");
function lev(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
function match(text, items) {
  const q = stripArticle(norm(text));
  if (!q) return null;
  const qc = q.replace(/ /g, "");
  const tol = qc.length < 4 ? 0 : qc.length <= 6 ? 1 : qc.length <= 10 ? 2 : 3;
  let best = null, bestScore = 0;
  items.forEach((item) => {
    [item.name, ...item.alias].forEach((variant) => {
      const v = stripArticle(norm(variant)), vc = v.replace(/ /g, "");
      if (!vc) return;
      let s = 0;
      if (vc === qc) s = 100;
      else if (qc.length >= 4 && vc.startsWith(qc)) s = 90 - Math.min(10, vc.length - qc.length);
      else if (qc.length >= 4 && v.split(" ").includes(q)) s = 85;
      else {
        const d = lev(qc, vc);
        if (tol && d <= tol) s = 80 - d * 5;
        if (q.length >= 5) v.split(" ").forEach((w) => { if (w.length >= 5 && lev(q, w) <= 1) s = Math.max(s, 72); });
      }
      if (s > bestScore) { bestScore = s; best = item; }
    });
  });
  return best;
}

/* ---------- Numeri ---------- */
const nf = (v, min, max) => v.toLocaleString(data.locale, { minimumFractionDigits: min, maximumFractionDigits: max });
function fmt(v, cat) {
  if (v == null || Number.isNaN(v)) return "—";
  if (cat.fmt === "dec1") return nf(v, 1, 1);
  if (cat.fmt === "big") {
    const a = Math.abs(v);
    if (a >= 1e9) return `${nf(v / 1e9, 0, 2)} ${t("billions")}`;
    if (a >= 1e6) return `${nf(v / 1e6, 0, 2)} ${t("millions")}`;
    if (a >= 1e4) return nf(Math.round(v), 0, 0);
    return nf(v, 0, 3);
  }
  return nf(v, 0, 1);
}
const withUnit = (v, cat) => `${fmt(v, cat)} ${cat.unit}`;

// "185.000", "1,6 mln", "1.6M", "185k", "2 mld"
function parseNum(str) {
  let s = String(str || "").trim().toLowerCase().replace(/\s+/g, "");
  if (!s) return NaN;
  let mult = 1;
  if (/(mld|miliardi|miliardo|bn|b)$/.test(s)) mult = 1e9;
  else if (/(mln|milioni|milione|mio|m)$/.test(s)) mult = 1e6;
  else if (/(k|mila)$/.test(s)) mult = 1e3;
  s = s.replace(/[^0-9.,-]/g, "");
  const it = data.locale.startsWith("it");
  if (s.includes(".") && s.includes(",")) s = it ? s.replace(/\./g, "").replace(",", ".") : s.replace(/,/g, "");
  else if (s.includes(",")) s = it ? s.replace(",", ".") : s.replace(/,/g, "");
  else if (it && /^-?\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  const n = parseFloat(s);
  return Number.isNaN(n) ? NaN : n * mult;
}

function countUp(el, to, cat) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !to) { el.textContent = withUnit(to, cat); return; }
  const start = performance.now(), dur = 900;
  const step = (now) => {
    const k = Math.min(1, Math.max(0, (now - start) / dur));
    const v = to * (1 - Math.pow(1 - k, 3));
    el.textContent = withUnit(cat.fmt === "dec1" ? Math.round(v * 10) / 10 : Math.round(v), cat);
    if (k < 1) requestAnimationFrame(step); else el.textContent = withUnit(to, cat);
  };
  requestAnimationFrame(step);
}

/* ---------- Stato ---------- */
const state = {
  target: 3, picks: [0, 1], wins: [0, 0], manche: 0,
  cat: null, elements: [], index: 0,
  answers: [], // answers[elemento][squadra] = { typed, item, value, manual }
  used: {}     // elementi già usati per categoria in questa partita
};
const team = (k) => PG.teams.list()[state.picks[k]] || { name: "—", color: "#4dd9ff", score: 0 };

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
  const k = Number(sel.getAttribute("data-pick"));
  const v = Number(sel.value);
  if (v === state.picks[1 - k]) state.picks[1 - k] = state.picks[k];
  state.picks[k] = v;
  state.wins = [0, 0];
  renderPicks();
  renderWins();
}));

function renderTargets() {
  els.targets.innerHTML = "";
  for (const key of [3, 5, 0]) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip" + (state.target === key ? " is-active" : "");
    b.setAttribute("aria-pressed", String(state.target === key));
    b.textContent = data.ui.targets[key];
    b.addEventListener("click", () => { state.target = key; renderTargets(); });
    els.targets.append(b);
  }
}

function renderWins() {
  els.wins.innerHTML = "";
  [0, 1].forEach((k) => {
    const card = document.createElement("div");
    card.className = "gk-score";
    card.style.setProperty("--team-color", team(k).color);
    card.innerHTML = `<span class="gk-score__name"></span><output class="gk-score__value"></output>`;
    card.firstChild.textContent = team(k).name;
    card.lastChild.textContent = t("wins", { n: state.wins[k] });
    els.wins.append(card);
  });
}

function renderCats() {
  els.cats.innerHTML = "";
  data.categories.forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "st-cat";
    b.innerHTML = `<span aria-hidden="true"></span>`;
    b.firstChild.textContent = cat.icon;
    b.append(cat.name);
    b.addEventListener("click", () => startManche(cat));
    els.cats.append(b);
  });
}

$("[data-random]").addEventListener("click", () => {
  const buttons = [...els.cats.children];
  let n = 0;
  const id = setInterval(() => {
    buttons.forEach((b) => b.classList.remove("is-picked"));
    const k = Math.floor(Math.random() * buttons.length);
    buttons[k].classList.add("is-picked");
    beep(500 + n * 20, 0.04);
    if (++n > 14) { clearInterval(id); setTimeout(() => startManche(data.categories[k]), 500); }
  }, 70);
});

/* ---------- Manche ---------- */
function startManche(cat) {
  state.cat = cat;
  state.manche++;
  // elementi non ancora usati in questa partita (poi si ricomincia)
  const used = state.used[cat.id] || [];
  let pool = cat.elements.filter((e) => !used.includes(e.n));
  if (pool.length < PER_ROUND) { pool = cat.elements.slice(); state.used[cat.id] = []; }
  state.elements = shuffle(pool.slice()).slice(0, PER_ROUND);
  state.used[cat.id] = [...(state.used[cat.id] || []), ...state.elements.map((e) => e.n)];
  state.index = 0;
  state.answers = state.elements.map(() => [null, null]);
  views.show("duel", { focus: false });
  showElement();
}

function showElement() {
  const cat = state.cat, el = state.elements[state.index];
  els.manche.textContent = `${cat.icon} ${t("manche", { n: state.manche })}`;
  els.counter.textContent = t("element", { n: state.index + 1, total: state.elements.length });
  els.catName.textContent = cat.name;
  els.elEmoji.textContent = el.e;
  els.elName.textContent = el.n;
  els.rule.textContent = cat.rule;
  els.inputs.innerHTML = "";
  [0, 1].forEach((k) => {
    const row = document.createElement("label");
    row.className = "gk-answer";
    row.style.setProperty("--team-color", team(k).color);
    row.innerHTML = `<span class="gk-answer__name"></span><input class="gk-input" type="password" autocomplete="off" spellcheck="false"><span class="gk-answer__mark"></span>`;
    row.firstChild.textContent = team(k).name;
    const input = row.querySelector("input");
    input.placeholder = t("answerPlaceholder", { name: team(k).name });
    input.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (k === 0) els.inputs.querySelectorAll("input")[1].focus(); else reveal();
    });
    els.inputs.append(row);
  });
  els.inputs.hidden = false;
  els.reveal.hidden = false;
  els.results.hidden = true;
  els.next.hidden = true;
  updateLeader();
  els.inputs.querySelector("input").focus({ preventScroll: true });
}

function resolve(typed, cat, el) {
  const item = typed.trim() ? match(typed, itemsOf(cat, el)) : null;
  return { typed: typed.trim(), item, value: item ? item.value : 0, manual: false };
}

function reveal() {
  const cat = state.cat, el = state.elements[state.index];
  const inputs = els.inputs.querySelectorAll("input");
  state.answers[state.index] = [0, 1].map((k) => resolve(inputs[k].value, cat, el));
  els.inputs.hidden = true;
  els.reveal.hidden = true;
  renderResults(true);
  els.next.textContent = state.index < state.elements.length - 1 ? t("next") : t("summary");
  els.next.hidden = false;
  beep(700, 0.15);
}
els.reveal.addEventListener("click", reveal);

const total = (k) => state.answers.reduce((sum, row) => sum + (row[k] ? row[k].value : 0), 0);

function answerLabel(a) {
  if (!a.typed) return [t("empty"), ""];
  if (a.item) return [a.item.name, a.manual || norm(a.typed) === norm(a.item.name) ? "" : `(${a.typed})`];
  return [a.typed, a.manual ? "" : t("notFound")];
}

function renderResults(animate) {
  const cat = state.cat;
  els.results.innerHTML = "";
  [0, 1].forEach((k) => {
    const a = state.answers[state.index][k];
    const card = document.createElement("div");
    card.className = "st-result";
    card.style.setProperty("--team-color", team(k).color);
    const [label, note] = answerLabel(a);
    card.innerHTML = `<span class="st-result__team"></span><span class="st-result__answer"><span></span><small></small></span><span class="st-result__value"></span><span class="st-result__total"></span>`;
    card.querySelector(".st-result__team").textContent = team(k).name;
    card.querySelector(".st-result__answer span").textContent = label;
    card.querySelector(".st-result__answer small").textContent = note;
    const value = card.querySelector(".st-result__value");
    if (animate) countUp(value, a.value, cat); else value.textContent = withUnit(a.value, cat);
    card.querySelector(".st-result__total").textContent = `${t("total")}: ${withUnit(total(k), cat)}`;
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "btn btn--ghost btn--sm";
    edit.textContent = t("edit");
    edit.addEventListener("click", () => openMaster(state.index, k));
    card.append(edit);
    els.results.append(card);
  });
  els.results.hidden = false;
  updateLeader();
}

function updateLeader() {
  const a = total(0), b = total(1);
  if (!a && !b) { els.leader.textContent = ""; return; }
  els.leader.textContent = a === b ? t("tie") : t("leader", { name: team(a > b ? 0 : 1).name });
}

els.next.addEventListener("click", () => {
  if (state.index < state.elements.length - 1) { state.index++; showElement(); }
  else showSummary();
});

/* ---------- Riepilogo ---------- */
function renderTable() {
  const cat = state.cat;
  const tbl = els.table;
  tbl.innerHTML = "";
  const head = tbl.createTHead().insertRow();
  head.append(document.createElement("th"));
  [0, 1].forEach((k) => {
    const th = document.createElement("th");
    th.style.setProperty("--team-color", team(k).color);
    th.textContent = team(k).name;
    head.append(th);
  });
  const body = tbl.createTBody();
  state.elements.forEach((el, i) => {
    const tr = body.insertRow();
    const th = document.createElement("th");
    th.textContent = `${el.e} ${el.n}`;
    tr.append(th);
    const row = state.answers[i];
    const best = Math.max(row[0].value, row[1].value);
    [0, 1].forEach((k) => {
      const a = row[k];
      const td = tr.insertCell();
      if (a.value === best && best > 0) td.className = "is-best";
      td.append(`${answerLabel(a)[0]} · ${withUnit(a.value, cat)}`);
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = "✏️";
      b.setAttribute("aria-label", t("edit"));
      b.addEventListener("click", () => openMaster(i, k));
      td.append(b);
    });
  });
  const foot = tbl.createTFoot().insertRow();
  foot.insertCell().textContent = t("total");
  [0, 1].forEach((k) => { foot.insertCell().textContent = withUnit(total(k), cat); });
  const a = total(0), b = total(1);
  els.mancheResult.textContent = a === b ? t("mancheTie") : `🏆 ${t("mancheWin", { name: team(a > b ? 0 : 1).name })}`;
}

function showSummary() {
  renderTable();
  views.show("summary");
}

$("[data-next-manche]").addEventListener("click", () => {
  const a = total(0), b = total(1);
  if (a !== b) {
    const k = a > b ? 0 : 1;
    state.wins[k]++;
    PG.teams.addScore(state.picks[k], 1);
    beep(880, 0.25);
    if (state.target && state.wins[k] >= state.target) { showWin(k); return; }
  }
  renderWins();
  views.show("setup");
});

function showWin(k) {
  els.winTitle.textContent = `🏆 ${t("matchWin", { name: team(k).name })}`;
  els.winLine.textContent = t("matchLine", { n: state.wins[k] });
  views.show("win");
  celebrate();
  PG.ads.reveal("results");
}

$("[data-new-match]").addEventListener("click", () => {
  state.wins = [0, 0];
  state.manche = 0;
  state.used = {};
  renderWins();
  views.show("setup");
});

/* ---------- Pannello Master: correggi o aggiungi un valore ---------- */
let editing = null;
function openMaster(i, k) {
  const cat = state.cat, el = state.elements[i], a = state.answers[i][k];
  editing = { i, k };
  els.mTyped.textContent = a.typed || "—";
  els.mSelect.innerHTML = "";
  els.mSelect.append(new Option(t("masterNone"), ""));
  itemsOf(cat, el).slice().sort((x, y) => x.name.localeCompare(y.name, data.locale)).forEach((item) => {
    els.mSelect.append(new Option(`${item.name} — ${withUnit(item.value, cat)}`, item.name, false, a.item && a.item.name === item.name));
  });
  els.mValue.value = "";
  els.master.showModal();
}

function applyEdit(value, itemName) {
  const { i, k } = editing;
  const cat = state.cat, el = state.elements[i];
  const a = state.answers[i][k];
  if (itemName) {
    const item = itemsOf(cat, el).find((x) => x.name === itemName);
    Object.assign(a, { item, value: item.value, manual: true });
  } else {
    Object.assign(a, { item: null, value, manual: true });
    if (els.mRemember.checked && a.typed && value > 0) {
      const extra = loadExtra();
      const key = extraKey(cat, el);
      extra[key] = (extra[key] || []).filter((x) => x.name.toLowerCase() !== a.typed.toLowerCase());
      extra[key].push({ name: a.typed, value });
      PG.ui.storage.set(EXTRA_KEY, extra);
      a.item = { name: a.typed, value, alias: [] };
    }
  }
  els.master.close();
  if ($("[data-view='summary']").hidden) renderResults(false); else renderTable();
}

$("[data-m-apply]").addEventListener("click", () => {
  const manual = parseNum(els.mValue.value);
  if (!Number.isNaN(manual)) applyEdit(manual, null);
  else if (els.mSelect.value) applyEdit(0, els.mSelect.value);
  else els.master.close();
});
$("[data-m-zero]").addEventListener("click", () => applyEdit(0, null));

/* ---------- Avvio ---------- */
mountScoreboard($("[data-scoreboard]"));
PG.teams.onChange(() => { renderPicks(); renderWins(); });
renderPicks();
renderTargets();
renderWins();
renderCats();
views.show("setup", { focus: false });
