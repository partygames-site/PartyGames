/* =========================================================
   GAME KIT — strumenti condivisi dai giochi (modulo ES)
   import { ... } from "../core/game-kit.mjs";

   loadGameData()          carica il modulo dati della lingua corrente
   createI18n(ui)          → t(key, vars) con segnaposto {nome}
   shuffle(arr)            mescola (Fisher-Yates) e restituisce l'array
   createDeck(items)       mazzo che si rimescola da solo a fine giro
   createViews(root)       mostra una sola schermata [data-view] alla volta
   countdown(opts)         conto alla rovescia a schermo intero (Promise)
   beep(freq, seconds)     suono generato via Web Audio (nessun file audio)
   celebrate()             coriandoli in CSS per la schermata di vittoria
   mountScoreboard(el, o)  tabellone collegato alle squadre globali (PG.teams)
   ========================================================= */

const PG = window.PG;

/** Il percorso del modulo dati è scritto in build su [data-game-data] */
export async function loadGameData() {
  const host = document.querySelector("[data-game-data]");
  const mod = await import(host.getAttribute("data-game-data"));
  return mod.default;
}

export function createI18n(ui) {
  return function t(key, vars) {
    let text = ui[key] != null ? String(ui[key]) : key;
    if (vars) for (const k of Object.keys(vars)) text = text.split(`{${k}}`).join(vars[k]);
    return text;
  };
}

export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Mazzo infinito: pesca senza ripetizioni finché non si esaurisce, poi rimescola */
export function createDeck(items) {
  let source = items.slice();
  let order = shuffle(source.slice());
  let index = 0;
  return {
    get current() { return order[index]; },
    get position() { return index + 1; },
    get total() { return order.length; },
    next() {
      index++;
      if (index >= order.length) { order = shuffle(source.slice()); index = 0; }
      return order[index];
    },
    reset(newItems) {
      if (newItems) source = newItems.slice();
      order = shuffle(source.slice());
      index = 0;
      return order[index];
    }
  };
}

/** Schermate del gioco: <section data-view="setup">, <section data-view="play">… */
export function createViews(root) {
  const views = Array.from(root.querySelectorAll("[data-view]"));
  return {
    show(name, { focus = true } = {}) {
      views.forEach((v) => { v.hidden = v.getAttribute("data-view") !== name; });
      const view = views.find((v) => v.getAttribute("data-view") === name);
      if (focus && view) {
        const heading = view.querySelector("h2, h3, [data-focus]");
        if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
        root.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      return view;
    }
  };
}

/* ---------------- Audio ---------------- */
let audioCtx;
export function beep(freq = 440, seconds = 0.15) {
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + seconds);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + seconds);
  } catch (e) { /* audio non disponibile: si gioca in silenzio */ }
}

/* ---------------- Conto alla rovescia ---------------- */
export function countdown({ from = 3, label = "", goText = "!", goLabel = "", sound = true } = {}) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "gk-countdown";
    overlay.setAttribute("role", "alert");
    overlay.innerHTML = `<div class="gk-countdown__num"></div><div class="gk-countdown__label"></div>`;
    const num = overlay.firstElementChild;
    const lab = overlay.lastElementChild;
    document.body.appendChild(overlay);

    let n = from;
    const tick = () => {
      if (n > 0) {
        num.textContent = n;
        lab.textContent = label;
        num.classList.remove("is-pop"); void num.offsetWidth; num.classList.add("is-pop");
        if (sound) beep(440, 0.15);
        n--;
        setTimeout(tick, 1000);
      } else {
        num.textContent = goText;
        lab.textContent = goLabel;
        num.classList.remove("is-pop"); void num.offsetWidth; num.classList.add("is-pop");
        if (sound) beep(880, 0.35);
        setTimeout(() => { overlay.remove(); resolve(); }, 1300);
      }
    };
    tick();
  });
}

/* ---------------- Coriandoli ---------------- */
const CONFETTI_COLORS = ["#ffd60a", "#ff4757", "#4dd9ff", "#00e676", "#b06aff", "#ffffff"];
export function celebrate(ms = 3500) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.createElement("div");
  layer.className = "gk-confetti";
  layer.setAttribute("aria-hidden", "true");
  document.body.appendChild(layer);
  const spawn = setInterval(() => {
    for (let i = 0; i < 6; i++) {
      const p = document.createElement("span");
      p.style.left = `${Math.random() * 100}vw`;
      p.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      p.style.animationDuration = `${2.2 + Math.random() * 2}s`;
      p.style.borderRadius = Math.random() < 0.5 ? "50%" : "2px";
      p.addEventListener("animationend", () => p.remove());
      layer.appendChild(p);
    }
  }, 160);
  setTimeout(() => {
    clearInterval(spawn);
    setTimeout(() => layer.remove(), 4500);
  }, ms);
}

/* ---------------- Tabellone squadre ----------------
   Mostra le squadre globali con +/−; si aggiorna da solo quando
   punteggi o numero di squadre cambiano (anche da altre schede).
   opts.count: numero fisso di squadre (default: quelle attive).
   opts.highlight(i) → true per evidenziare la squadra di turno. */
export function mountScoreboard(el, { count, label = (name) => name, highlight } = {}) {
  const t = PG.ui.t;
  function draw() {
    const teams = PG.teams.list().slice(0, count || PG.teams.count());
    el.innerHTML = "";
    teams.forEach((team, i) => {
      const card = document.createElement("div");
      card.className = "gk-score" + (highlight && highlight(i) ? " is-active" : "");
      card.style.setProperty("--team-color", team.color);
      const name = document.createElement("span");
      name.className = "gk-score__name";
      name.textContent = label(team.name, i);
      const value = document.createElement("output");
      value.className = "gk-score__value";
      value.textContent = team.score;
      const btns = document.createElement("div");
      btns.className = "gk-score__btns";
      [["−", -1, "teamMinus"], ["+", 1, "teamPlus"]].forEach(([txt, delta, key]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = txt;
        b.setAttribute("aria-label", t(key, { name: team.name }));
        b.addEventListener("click", () => PG.teams.addScore(i, delta));
        btns.appendChild(b);
      });
      card.append(name, value, btns);
      el.appendChild(card);
    });
  }
  PG.teams.onChange(draw);
  draw();
  return { redraw: draw };
}
