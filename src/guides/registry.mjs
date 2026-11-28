/* =========================================================
   REGISTRO DELLE GUIDE
   Ogni guida ha i testi in src/guides/<id>/<lingua>.html.
   Nei testi, i link ai giochi si scrivono con il segnaposto
   {{game.<id>}} (trattini dell'id sostituiti da "_"), es.
   <a href="{{game.fire_down}}">Fire Down</a>: se un gioco cambia
   indirizzo, i link si aggiornano da soli.

   Campi:
     id        cartella in src/guides/
     icon      emoji della scheda
     color     colore della scheda e dell'immagine social
     published data di pubblicazione (YYYY-MM-DD)
     updated   data dell'ultimo aggiornamento sostanziale
     games     id dei giochi citati (schede in fondo alla guida)
     i18n      per lingua: slug, title (H1), desc (meta description
               e anteprima), keywords
   ========================================================= */

export const GUIDES = [
  {
    id: "how-to-play",
    icon: "📺",
    color: "#4dd9ff",
    published: "2026-11-22",
    updated: "2026-11-22",
    games: ["top10", "skill-test", "fire-down", "canzoni-emoji"],
    i18n: {
      en: {
        slug: "how-to-play-party-games-on-tv",
        title: "How to Play: the Game Master, the TV and the Teams in Five Minutes",
        desc: "A quick guide to playing every PartyGames Club game: what you need, how to cast the game to a TV or projector, what the game master does and how teams and points work.",
        keywords: "how to play party games on tv, game master role, cast browser game to tv, party games projector"
      },
      it: {
        slug: "come-si-gioca-master-tv-squadre",
        title: "Come si gioca: il master, la TV e le squadre in cinque minuti",
        desc: "Guida rapida per giocare a tutti i giochi di PartyGames Club: cosa serve, come proiettare il gioco su TV o proiettore, cosa fa il master e come funzionano squadre e punti.",
        keywords: "come giocare ai giochi di gruppo sulla tv, ruolo del master, proiettare gioco sulla tv, giochi di gruppo con proiettore"
      }
    }
  },
  {
    id: "game-night",
    icon: "🎲",
    color: "#b06aff",
    published: "2026-11-13",
    updated: "2026-11-13",
    games: ["most-likely", "fire-down", "top10", "canzoni-emoji"],
    i18n: {
      en: {
        slug: "how-to-host-a-game-night",
        title: "How to Host a Game Night People Will Talk About",
        desc: "A step-by-step plan for hosting a great game night: how many guests to invite, how to pick and order the games, snacks, teams and the small details that keep everyone playing.",
        keywords: "how to host a game night, game night ideas, party games for adults, game night plan"
      },
      it: {
        slug: "come-organizzare-una-serata-giochi",
        title: "Come organizzare una serata giochi che tutti ricorderanno",
        desc: "Un piano passo per passo per organizzare una serata giochi riuscita: quanti invitati, come scegliere e ordinare i giochi, snack, squadre e i dettagli che tengono tutti coinvolti.",
        keywords: "come organizzare una serata giochi, idee serata giochi, giochi di gruppo per adulti, serata tra amici"
      }
    }
  },
  {
    id: "group-size",
    icon: "👥",
    color: "#4dd9ff",
    published: "2026-11-13",
    updated: "2026-11-13",
    games: ["thermostat", "battaglia-asta", "dilemmi", "coppie", "nomi-cose-citta", "intruso", "parola-nascosta"],
    i18n: {
      en: {
        slug: "best-party-games-by-group-size",
        title: "The Best Party Games for Every Group Size, from 2 to 12+ Players",
        desc: "Which party games work for two people, a small group of four to six, or a crowd of twelve? A practical guide to matching the game to the number of players.",
        keywords: "party games for 2 players, games for small groups, games for large groups, group games by number of players"
      },
      it: {
        slug: "giochi-di-gruppo-per-numero-di-persone",
        title: "I migliori giochi di gruppo per ogni numero di persone, da 2 a 12 e oltre",
        desc: "Quali giochi funzionano in due, in un piccolo gruppo da quattro a sei o in una tavolata da dodici? Una guida pratica per scegliere il gioco giusto in base ai giocatori.",
        keywords: "giochi da fare in due, giochi per piccoli gruppi, giochi per gruppi numerosi, giochi di gruppo per numero di persone"
      }
    }
  },
  {
    id: "christmas",
    icon: "🎄",
    color: "#ff2d55",
    published: "2026-11-13",
    updated: "2026-11-13",
    games: ["canzoni-emoji", "top10", "ordina", "parola-nascosta", "most-likely"],
    i18n: {
      en: {
        slug: "christmas-and-new-years-eve-family-games",
        title: "Christmas and New Year's Eve Games for the Whole Family",
        desc: "Games that work for grandparents, parents and kids at the same table: a plan for Christmas Day, the evenings in between and the countdown to midnight on New Year's Eve.",
        keywords: "christmas family games, new year's eve games, games for family gatherings, holiday party games"
      },
      it: {
        slug: "giochi-natale-capodanno-famiglia",
        title: "Giochi per Natale e Capodanno da fare in famiglia",
        desc: "Giochi che funzionano con nonni, genitori e bambini alla stessa tavola: un programma per il giorno di Natale, le serate delle feste e l'attesa della mezzanotte a Capodanno.",
        keywords: "giochi di natale in famiglia, giochi per capodanno, giochi per le feste, giochi da tavola natale"
      }
    }
  },
  {
    id: "new-year",
    icon: "🎆",
    color: "#ffb020",
    published: "2026-11-28",
    updated: "2026-11-28",
    games: ["most-likely", "top10", "canzoni-emoji", "fire-down", "coppie"],
    i18n: {
      en: {
        slug: "new-years-eve-party-games-at-home",
        title: "New Year's Eve Party Games at Home: a Plan from Dinner to Midnight",
        desc: "The best games for a New Year's Eve party at home with friends: icebreakers, a team championship after dinner, a grand finale before the countdown and a ready-made hour-by-hour plan.",
        keywords: "new year's eve party games, new year's eve games at home, nye party ideas, games for new year's eve with friends"
      },
      it: {
        slug: "giochi-capodanno-in-casa-con-amici",
        title: "Giochi per Capodanno in casa con amici: il programma dalla cena a mezzanotte",
        desc: "I giochi migliori per un Capodanno in casa con gli amici: rompighiaccio, campionato a squadre dopo cena, gran finale prima del conto alla rovescia e un programma pronto ora per ora.",
        keywords: "giochi per capodanno, giochi capodanno in casa, giochi capodanno con amici, cosa fare a capodanno in casa"
      }
    }
  },
  {
    id: "kids-birthday",
    icon: "🎂",
    color: "#ffd600",
    published: "2026-11-13",
    updated: "2026-11-13",
    games: ["skill-test", "intruso", "fire-down", "canzoni-emoji"],
    i18n: {
      en: {
        slug: "kids-birthday-party-games",
        title: "Birthday Party Games for Kids: Ideas by Age, with a Ready-Made Plan",
        desc: "How to keep a room full of children happy at a birthday party: games by age group, a 90-minute plan, tips for mixed ages and how to avoid tears when someone loses.",
        keywords: "kids birthday party games, birthday games for children, indoor party games for kids, party games by age"
      },
      it: {
        slug: "giochi-feste-compleanno-bambini",
        title: "Giochi per feste di compleanno dei bambini: idee per età e un programma pronto",
        desc: "Come tenere allegra una stanza piena di bambini a una festa di compleanno: giochi per fascia d'età, un programma di 90 minuti, consigli per età miste e come evitare i capricci di chi perde.",
        keywords: "giochi per feste di compleanno bambini, giochi per bambini in casa, animazione compleanno, giochi per età"
      }
    }
  },
  {
    id: "team-building",
    icon: "🤝",
    color: "#2fe08a",
    published: "2026-11-13",
    updated: "2026-11-13",
    games: ["duello-lampo", "la-stecca", "ordina", "parola-nascosta", "top10"],
    i18n: {
      en: {
        slug: "team-building-games-for-work",
        title: "Team Building Games for Work That People Actually Enjoy",
        desc: "Quick, inclusive team building games for the office, offsites and remote meetings: how to run them, how long they take and how to avoid the awkward moments.",
        keywords: "team building games, office games, games for work, remote team building activities, icebreakers for meetings"
      },
      it: {
        slug: "giochi-team-building-ufficio",
        title: "Giochi di team building per l'ufficio che piacciono davvero",
        desc: "Giochi di team building veloci e inclusivi per ufficio, eventi aziendali e riunioni a distanza: come condurli, quanto durano e come evitare i momenti imbarazzanti.",
        keywords: "giochi team building, giochi per ufficio, team building aziendale, team building online, rompighiaccio riunioni"
      }
    }
  },
  {
    id: "icebreakers",
    icon: "🧊",
    color: "#ff8a3d",
    published: "2026-11-13",
    updated: "2026-11-13",
    games: ["most-likely", "dilemmi", "coppie", "fire-down", "intruso"],
    i18n: {
      en: {
        slug: "icebreaker-games-for-groups",
        title: "Icebreaker Games for Groups Where Not Everyone Knows Each Other",
        desc: "How to get a mixed group talking in the first fifteen minutes: low-pressure icebreaker games, the right order to play them and what to avoid with people who have just met.",
        keywords: "icebreaker games, icebreakers for groups, games for people who don't know each other, getting to know you games"
      },
      it: {
        slug: "giochi-rompighiaccio-per-gruppi",
        title: "Giochi rompighiaccio per gruppi in cui non tutti si conoscono",
        desc: "Come far parlare un gruppo misto nei primi quindici minuti: giochi rompighiaccio senza pressione, l'ordine giusto in cui proporli e cosa evitare con persone che si sono appena conosciute.",
        keywords: "giochi rompighiaccio, giochi per conoscersi, giochi per gruppi di sconosciuti, attività rompighiaccio"
      }
    }
  }
];

export function guidePath(guide, t) {
  return `${t.routes.guides}${guide.i18n[t.code].slug}/`;
}
