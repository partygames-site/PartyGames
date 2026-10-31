/* SKILL TEST — contenuti in italiano.
   Le sfide sono generate dal codice in SVG (forme, colori, rotazioni):
   qui ci sono solo i testi e gli insiemi di emoji per "Trova l'emoji". */

export default {
  ui: {
    modeLabel: "Tipi di sfida",
    types: {
      oddColor: "🎨 Colore diverso",
      oddShape: "🔷 Forma diversa",
      target: "🎯 Trova la combinazione",
      mirror: "🪞 Lo specchio",
      sequence: "🔢 Sequenza logica",
      count: "🧮 Conta le forme",
      emoji: "🔍 Trova l'emoji"
    },
    prompts: {
      oddColor: "Una forma ha un colore leggermente diverso: trovala!",
      oddShape: "Una forma è diversa dalle altre: trovala!",
      target: "Trova la forma identica al bersaglio (stessa forma e stesso colore)",
      mirror: "Quattro figure sono la stessa forma ruotata, una è riflessa allo specchio: trovala!",
      sequence: "Quale figura continua la sequenza?",
      count: "{shape}",
      emoji: "Trova questa emoji nella griglia"
    },
    shapes: { circle: "Quanti cerchi ci sono?", square: "Quanti quadrati ci sono?", triangle: "Quanti triangoli ci sono?", star: "Quante stelle ci sono?", hexagon: "Quanti esagoni ci sono?", diamond: "Quanti rombi ci sono?" },
    target: "Bersaglio",
    counter: "Sfida {n}",
    level: "Livello {n}",
    turn: "🎯 Tocca a {name}",
    timeLeft: "{s} s",
    correct: "✅ Esatto! +1 a {name}",
    wrong: "❌ Sbagliato! Ora tocca a {name}",
    timeout: "⏰ Tempo scaduto! Ora tocca a {name}",
    allFailed: "Nessuno ci è riuscito: ecco la soluzione",
    next: "Prossima sfida ▶",
    end: "Termina partita",
    resultTitle: "Classifica finale",
    resultLine: "Avete giocato {n} sfide.",
    restart: "Nuova partita",
    optionLabel: "Opzione {n}"
  },

  seconds: 10,

  emojiSets: [
    ["😀", "😃", "😄", "😁", "😆", "😅", "🙂", "😊", "😇", "🙃", "😉", "😌", "😋", "😛", "😜", "🤪", "😝", "🤗", "🤭", "😏", "😶", "😐", "😑", "🫡"],
    ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🐔", "🐧", "🐦", "🐤", "🦉", "🐺", "🐗", "🐴", "🦄"],
    ["🍏", "🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🥑", "🫒", "🌶️", "🫑", "🥒", "🥕"],
    ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "⛳", "🥊", "🥋", "🎳", "🛹", "⛸️", "🥌", "🎯"],
    ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘", "🌙", "🌚", "🌛", "🌜", "☀️", "🌝", "🌞", "⭐", "🌟", "✨", "⚡", "☄️", "💫", "🌠", "🌤️", "⛅"],
    ["🚗", "🚕", "🚙", "🚌", "🚎", "🏎️", "🚓", "🚑", "🚒", "🚐", "🛻", "🚚", "🚛", "🚜", "🛵", "🏍️", "🚲", "🛴", "🚂", "🚆", "🚇", "✈️", "🚁", "⛵"]
  ]
};
