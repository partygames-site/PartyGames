/* =========================================================
   REGISTRO DEI GIOCHI — unica fonte di verità.
   Homepage, sitemap, immagini Open Graph e pagine dei giochi
   vengono generate a partire da questo array.

   Campi:
   - id          identificatore stabile (= nome cartella in src/games/<id>/
                 e dei file public/assets/js/games/<id>.js)
   - status      "live" = pagina pubblicata · "soon" = card "In arrivo"
   - icon        emoji mostrata nella card (resa dal font del dispositivo)
   - color       colore di accento del gioco
   - categories  chiavi definite in i18n/<lang>.mjs → categories
   - players     testo breve, uguale in tutte le lingue
   - minutes     durata indicativa di una partita
   - teams       true = usa le squadre globali (mostra il pannello squadre)
   - i18n        per ogni lingua: slug (URL), title, tagline, desc, keywords

   Per aggiungere un gioco: aggiungere un oggetto qui, creare
   src/games/<id>/ (vedi README) e impostare status: "live".
   ========================================================= */

export const GAMES = [
  {
    id: "most-likely",
    status: "live",
    icon: "🙋",
    color: "#ff9f1c",
    categories: ["party"],
    players: "3+",
    minutes: 15,
    i18n: {
      it: {
        slug: "il-piu-probabile",
        title: "Il Più Probabile",
        tagline: "Chi è più propenso a…?",
        desc: "Votate chi del gruppo è più propenso a fare la cosa sullo schermo. Chi riceve più voti affronta una penitenza divertente: domande esilaranti garantite.",
        keywords: "il più probabile, most likely to, gioco chi è più probabile, domande per amici, giochi per rompere il ghiaccio"
      },
      en: {
        slug: "most-likely-to",
        title: "Most Likely To",
        tagline: "Who's most likely to…?",
        desc: "Vote for the friend most likely to do what's on screen. Whoever gets the most votes takes on a silly forfeit: hilarious questions guaranteed.",
        keywords: "most likely to, most likely to questions, who is most likely to game, icebreaker games, party questions"
      }
    }
  },
  {
    id: "dilemmi",
    status: "live",
    icon: "⚖️",
    color: "#ff2d55",
    categories: ["party", "couples"],
    players: "2+",
    minutes: 20,
    i18n: {
      it: {
        slug: "dilemmi-morali",
        title: "Dilemmi Morali",
        tagline: "Preferiresti…?",
        desc: "Scelte impossibili da fare in coppia o in gruppo. Nessuna risposta giusta: solo discussioni accese e tante risate.",
        keywords: "dilemmi morali, preferiresti, domande preferiresti, would you rather italiano, domande per coppie"
      },
      en: {
        slug: "moral-dilemmas",
        title: "Moral Dilemmas",
        tagline: "Would you rather…?",
        desc: "Impossible choices to make as a couple or a group. There's no right answer: just heated debates and plenty of laughs.",
        keywords: "would you rather, moral dilemmas game, would you rather questions, debate games, questions for couples"
      }
    }
  },
  {
    id: "coppie",
    status: "live",
    teams: true,
    icon: "💞",
    color: "#4dd9ff",
    categories: ["couples", "party"],
    players: "2–8",
    minutes: 20,
    i18n: {
      it: {
        slug: "chi-si-conosce-meglio",
        title: "Chi Si Conosce Meglio",
        tagline: "Quanto conosci l'altro?",
        desc: "Sfida a coppie, di fidanzati o di amici, per scoprire chi conosce davvero l'altro. Un punto per ogni risposta indovinata.",
        keywords: "gioco di coppia, quanto mi conosci, domande per coppie, chi si conosce meglio, gioco per fidanzati"
      },
      en: {
        slug: "who-knows-who-best",
        title: "Who Knows Who Best",
        tagline: "How well do you really know them?",
        desc: "A challenge for couples or best friends to find out who really knows the other. One point for every right answer.",
        keywords: "couples game, how well do you know me, newlywed game questions, couple quiz, best friend quiz"
      }
    }
  },
  {
    id: "fire-down",
    status: "live",
    teams: true,
    icon: "🔥",
    color: "#00e676",
    categories: ["party", "words"],
    players: "3+",
    minutes: 10,
    i18n: {
      it: {
        slug: "fire-down",
        title: "Fire Down",
        tagline: "Categorie a raffica",
        desc: "Una categoria sullo schermo e 5 secondi per rispondere: chi esita o ripete viene eliminato. L'ultimo rimasto vince.",
        keywords: "gioco delle categorie, categorie a raffica, giochi di velocità, giochi di gruppo veloci, giochi senza materiale"
      },
      en: {
        slug: "fire-down",
        title: "Fire Down",
        tagline: "Rapid-fire categories",
        desc: "A category on screen and 5 seconds to answer: hesitate or repeat and you're out. The last player standing wins.",
        keywords: "categories game, rapid fire game, speed party games, no-prep group games, quick party games"
      }
    }
  },
  {
    id: "nomi-cose-citta",
    status: "live",
    teams: true,
    icon: "🔤",
    color: "#ffd600",
    categories: ["words", "teams"],
    players: "4+",
    minutes: 20,
    i18n: {
      it: {
        slug: "nomi-cose-citta-speed",
        title: "Nomi Cose Città Speed",
        tagline: "Squadra contro squadra",
        desc: "Estrai una lettera, rispondi sull'argomento prima degli avversari e porta la tua squadra a 25 punti. La versione veloce del classico.",
        keywords: "nomi cose città, nomi cose città online, gioco delle lettere, giochi di parole a squadre, nomi cose animali"
      },
      en: {
        slug: "name-place-animal-speed",
        title: "Name Place Animal Speed",
        tagline: "Team against team",
        desc: "Draw a letter, answer the topic faster than the other team and race to 25 points. The speed version of the classic word game.",
        keywords: "name place animal thing, categories letter game, word games for teams, online word game, letter game"
      }
    }
  },
  {
    id: "ordina",
    status: "soon",
    icon: "🔀",
    color: "#d500f9",
    categories: ["quiz", "teams"],
    players: "2+",
    minutes: 20,
    i18n: {
      it: {
        slug: "ordina",
        title: "Ordina",
        tagline: "Metti in fila",
        desc: "Riordina gli elementi secondo la regola mostrata: dal più veloce al più lento, dal più antico al più recente… Chi trova l'ordine esatto vince il punto.",
        keywords: "gioco ordina, quiz di cultura generale, metti in ordine, quiz a squadre, giochi di logica"
      },
      en: {
        slug: "sort-it",
        title: "Sort It",
        tagline: "Put them in order",
        desc: "Sort the items by the rule on screen: fastest to slowest, oldest to newest… Get the exact order right to win the point.",
        keywords: "ordering quiz, put in order game, general knowledge quiz, team quiz, trivia sorting game"
      }
    }
  },
  {
    id: "top10",
    status: "soon",
    icon: "🏆",
    color: "#ffb703",
    categories: ["quiz", "teams"],
    players: "4+",
    minutes: 25,
    i18n: {
      it: {
        slug: "indovina-la-top-10",
        title: "Indovina la Top 10",
        tagline: "Scopri tutta la classifica",
        desc: "Una categoria e una classifica nascosta: a turno ogni squadra dice una risposta e il conduttore scopre le caselle. Chi completa più posizioni vince.",
        keywords: "indovina la top 10, quiz classifica, gioco a squadre tv, quiz per feste, giochi da salotto"
      },
      en: {
        slug: "guess-the-top-10",
        title: "Guess the Top 10",
        tagline: "Reveal the whole chart",
        desc: "One category and a hidden top 10: teams take turns giving answers while the host reveals the board. Fill the most spots to win.",
        keywords: "guess the top 10, top ten quiz, survey game, team quiz game, party trivia game"
      }
    }
  },
  {
    id: "thermostat",
    status: "live",
    teams: true,
    icon: "🌡️",
    color: "#ff4757",
    categories: ["quiz"],
    players: "2",
    minutes: 10,
    i18n: {
      it: {
        slug: "numero-esatto",
        title: "Numero Esatto",
        tagline: "Più alto o più basso?",
        desc: "Un numero segreto da 1 a 100 e una frase di contesto buffa: a turno i due sfidanti provano a indovinarlo mentre il termometro si stringe.",
        keywords: "indovina il numero, gioco più alto più basso, giochi a due, sfida a due, giochi di intuito"
      },
      en: {
        slug: "exact-number",
        title: "Exact Number",
        tagline: "Higher or lower?",
        desc: "A secret number from 1 to 100 and a funny clue: the two players take turns guessing while the thermometer closes in.",
        keywords: "guess the number game, higher or lower game, two player games, number guessing game, head to head games"
      }
    }
  },
  {
    id: "il-picco",
    status: "soon",
    icon: "⛰️",
    color: "#ffca28",
    categories: ["quiz"],
    players: "2",
    minutes: 15,
    i18n: {
      it: {
        slug: "il-picco",
        title: "Il Picco",
        tagline: "Trova il punto più alto",
        desc: "A turno, indovinate il film più apprezzato o la canzone più famosa di un artista: chi arriva al picco per primo guadagna il punto.",
        keywords: "quiz cinema, quiz musica, quiz film e canzoni, quiz a due, giochi di cultura pop"
      },
      en: {
        slug: "the-peak",
        title: "The Peak",
        tagline: "Find the highest point",
        desc: "Take turns guessing an artist's best-rated film or most famous song: whoever reaches the peak first scores the point.",
        keywords: "movie quiz, music quiz, pop culture trivia, two player quiz, film and song trivia"
      }
    }
  },
  {
    id: "skill-test",
    status: "soon",
    icon: "🎯",
    color: "#b388ff",
    categories: ["quiz"],
    players: "2+",
    minutes: 15,
    i18n: {
      it: {
        slug: "skill-test",
        title: "Skill Test",
        tagline: "Occhio, colori e forme",
        desc: "Una griglia di simboli, colori e forme e un elemento da trovare: chi lo individua per primo guadagna il punto. Occhio allenato e riflessi pronti!",
        keywords: "test di abilità, gioco di osservazione, trova la differenza, giochi di riflessi, quiz visivo"
      },
      en: {
        slug: "skill-test",
        title: "Skill Test",
        tagline: "Eyes, colours and shapes",
        desc: "A grid of symbols, colours and shapes and one target to spot: the first to find it scores. Sharp eyes and quick reflexes required!",
        keywords: "skill test game, observation game, spot the odd one, reflex games, visual quiz"
      }
    }
  },
  {
    id: "battaglia-asta",
    status: "soon",
    icon: "🔨",
    color: "#22d3ee",
    categories: ["party"],
    players: "2",
    minutes: 20,
    i18n: {
      it: {
        slug: "battaglia-all-asta",
        title: "Battaglia all'Asta",
        tagline: "Rilancia e costruisci la tua rosa",
        desc: "Due giocatori, 20 crediti a testa e 10 elementi all'asta: rilancia ad alta voce e aggiudicati i 5 pezzi migliori, dai supereroi agli animali più forti.",
        keywords: "gioco dell'asta, asta tra amici, gioco a due, draft game, giochi di strategia per feste"
      },
      en: {
        slug: "auction-battle",
        title: "Auction Battle",
        tagline: "Bid and build your squad",
        desc: "Two players, 20 credits each and 10 items up for auction: bid out loud and win the best 5, from superheroes to the toughest animals.",
        keywords: "auction game, bidding game, draft game with friends, two player party game, strategy party game"
      }
    }
  },
  {
    id: "canzoni-emoji",
    status: "soon",
    icon: "🎵",
    color: "#ff6fa8",
    categories: ["quiz", "teams"],
    players: "4+",
    minutes: 20,
    i18n: {
      it: {
        slug: "indovina-la-canzone-emoji",
        title: "Indovina la Canzone dalle Emoji",
        tagline: "Musica in emoji",
        desc: "Una sequenza di emoji nasconde il titolo di una canzone famosa: indovina titolo e artista prima dell'altra squadra per prendere 2 punti.",
        keywords: "indovina la canzone, quiz emoji, indovina la canzone dalle emoji, quiz musicale, giochi musicali per feste"
      },
      en: {
        slug: "emoji-song-quiz",
        title: "Emoji Song Quiz",
        tagline: "Music in emoji",
        desc: "A string of emoji hides the title of a famous song: guess the title and artist before the other team to score 2 points.",
        keywords: "guess the song, emoji quiz, guess the song from emoji, music quiz, music party games"
      }
    }
  },
  {
    id: "parola-nascosta",
    status: "live",
    teams: true,
    icon: "🧩",
    color: "#ffc247",
    categories: ["words", "teams"],
    players: "2+",
    minutes: 15,
    i18n: {
      it: {
        slug: "la-parola-nascosta",
        title: "La Parola Nascosta",
        tagline: "5 indizi, una parola",
        desc: "Cinque parole e 40 secondi per trovare quella che le collega tutte. Ogni squadra scrive la sua risposta: +1 a chi indovina.",
        keywords: "parola nascosta, gioco della parola che collega, indovina la parola, giochi di parole, quiz di parole"
      },
      en: {
        slug: "hidden-word-link",
        title: "Hidden Word Link",
        tagline: "5 clues, one word",
        desc: "Five words and 40 seconds to find the one that links them all. Each team writes its answer: +1 for every correct guess.",
        keywords: "word association game, connect the words, hidden word game, word puzzle game, linking word quiz"
      }
    }
  },
  {
    id: "duello-lampo",
    status: "live",
    teams: true,
    icon: "⚡",
    color: "#4d8bff",
    categories: ["quiz", "teams"],
    players: "2+",
    minutes: 20,
    i18n: {
      it: {
        slug: "duello-lampo",
        title: "Duello Lampo",
        tagline: "Sfide a raffica",
        desc: "Indovinelli, logica, sequenze, calcolo lampo, anagrammi, memoria e riflessi: una raffica di mini-sfide dove ogni prova vale un punto.",
        keywords: "giochi di logica, indovinelli, sfide a squadre, giochi di memoria, giochi di riflessi"
      },
      en: {
        slug: "lightning-duel",
        title: "Lightning Duel",
        tagline: "Rapid-fire challenges",
        desc: "Riddles, logic, sequences, mental maths, anagrams, memory and reflexes: a barrage of mini challenges where every round is worth a point.",
        keywords: "logic games, riddles, team challenges, memory games, reflex games"
      }
    }
  },
  {
    id: "la-stecca",
    status: "soon",
    icon: "📈",
    color: "#2dd4a7",
    categories: ["quiz", "teams"],
    players: "2+",
    minutes: 20,
    i18n: {
      it: {
        slug: "la-stecca",
        title: "La Stecca",
        tagline: "Chi somma di più",
        desc: "20 categorie e una risposta a testa: abitanti, altezze, distanze, calorie e molto altro. Ogni valore si somma al totale e chi arriva più in alto vince la manche.",
        keywords: "quiz numeri, quiz di cultura generale, gioco delle stime, quiz a squadre, giochi di numeri"
      },
      en: {
        slug: "stack-up",
        title: "Stack Up",
        tagline: "Highest total wins",
        desc: "20 categories and one answer each: populations, heights, distances, calories and more. Every value adds to your total and the highest score takes the round.",
        keywords: "numbers quiz, general knowledge quiz, estimation game, team trivia, number trivia game"
      }
    }
  },
  {
    id: "intruso",
    status: "soon",
    icon: "🕵️",
    color: "#ff7a45",
    categories: ["quiz", "teams"],
    players: "2+",
    minutes: 20,
    i18n: {
      it: {
        slug: "l-intruso",
        title: "L'Intruso",
        tagline: "Non scoprire l'intruso",
        desc: "Una domanda e 10 carte coperte: a turno ogni squadra ne gira una. Verde se è salva, rossa se è l'intruso: chi lo scopre perde il round.",
        keywords: "trova l'intruso, gioco dell'intruso, quiz a squadre, quiz di logica, giochi per feste"
      },
      en: {
        slug: "odd-one-out",
        title: "Odd One Out",
        tagline: "Don't flip the odd one",
        desc: "One question and 10 face-down cards: teams take turns flipping one. Green means safe, red is the odd one out, and whoever finds it loses the round.",
        keywords: "odd one out game, find the odd one out, team quiz, logic quiz, party quiz game"
      }
    }
  }
];

/** URL relativo (con "/" iniziale e finale) di un gioco in una lingua */
export function gamePath(game, t) {
  return `${t.routes.games}${game.i18n[t.code].slug}/`;
}
