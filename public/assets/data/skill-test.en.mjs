/* SKILL TEST — English content.
   Challenges are generated in code as SVG (shapes, colours, rotations):
   this file only holds the texts and the emoji sets for "Spot the emoji". */

export default {
  ui: {
    modeLabel: "Challenge types",
    types: {
      oddColor: "🎨 Odd colour",
      oddShape: "🔷 Odd shape",
      target: "🎯 Find the match",
      mirror: "🪞 Mirror image",
      sequence: "🔢 Logic sequence",
      count: "🧮 Count the shapes",
      emoji: "🔍 Spot the emoji"
    },
    prompts: {
      oddColor: "One shape is a slightly different colour: find it!",
      oddShape: "One shape is different from the others: find it!",
      target: "Find the shape identical to the target (same shape and same colour)",
      mirror: "Four figures are the same shape rotated, one is a mirror image: find it!",
      sequence: "Which figure continues the sequence?",
      count: "{shape}",
      emoji: "Find this emoji in the grid"
    },
    shapes: { circle: "How many circles are there?", square: "How many squares are there?", triangle: "How many triangles are there?", star: "How many stars are there?", hexagon: "How many hexagons are there?", diamond: "How many diamonds are there?" },
    target: "Target",
    counter: "Challenge {n}",
    level: "Level {n}",
    turn: "🎯 {name}'s turn",
    timeLeft: "{s} s",
    correct: "✅ Correct! +1 to {name}",
    wrong: "❌ Wrong! Now it's {name}'s turn",
    timeout: "⏰ Time's up! Now it's {name}'s turn",
    allFailed: "Nobody got it: here's the solution",
    next: "Next challenge ▶",
    end: "End game",
    resultTitle: "Final leaderboard",
    resultLine: "You played {n} challenges.",
    restart: "New game",
    optionLabel: "Option {n}"
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
