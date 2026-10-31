/* Dizionario ITALIANO — testi dell'interfaccia, percorsi e SEO.
   Ogni lingua ha lo stesso schema: per aggiungerne una basta
   copiare questo file e tradurre i valori (non le chiavi). */

export default {
  code: "it",
  locale: "it_IT",
  name: "Italiano",

  // Percorsi delle pagine in questa lingua (sempre con "/" finale)
  routes: {
    home: "/",
    games: "/giochi/",
    privacy: "/privacy/",
    cookies: "/cookie-policy/",
    about: "/chi-siamo/",
    contact: "/contatti/"
  },

  ui: {
    skipToContent: "Vai al contenuto",
    navHome: "Home",
    navGames: "Giochi",
    navHowTo: "Come si gioca",
    navAbout: "Chi siamo",
    mainNavLabel: "Navigazione principale",
    languageLabel: "Lingua",
    switchTo: "Passa alla versione",
    breadcrumbLabel: "Percorso",
    adLabel: "Pubblicità",
    footerTagline: "Giochi di gruppo e party game gratuiti da fare in casa, su smartphone, tablet, PC e TV.",
    footerGames: "Giochi",
    footerInfo: "Informazioni",
    footerLegal: "Note legali",
    privacy: "Privacy Policy",
    cookies: "Cookie Policy",
    manageCookies: "Gestisci cookie",
    about: "Chi siamo",
    contact: "Contatti",
    allRights: "Tutti i diritti riservati.",
    play: "Gioca ora",
    comingSoon: "In arrivo",
    players: "Giocatori",
    lastUpdated: "Ultimo aggiornamento",
    rulesLink: "Regole e consigli",
    relatedGames: "Altri giochi da provare"
  },

  categories: {
    all: "Tutti",
    party: "Party",
    quiz: "Quiz",
    teams: "A squadre",
    words: "Parole",
    couples: "Coppie"
  },

  // Testi usati dal JavaScript nel browser (cookie banner, squadre, home)
  js: {
    teamsCount: "{n} squadre",
    teamName: "Nome squadra",
    teamColor: "Colore squadra",
    teamDefault: "Squadra {n}",
    teamMinus: "Togli un punto a {name}",
    teamPlus: "Aggiungi un punto a {name}",
    resetConfirm: "Azzerare il punteggio di tutte le squadre?",
    randomNone: "I giochi sono in arrivo: torna presto!",
    randomPicked: "Tocca a: {title}!",
    points: "pt"
  },

  consent: {
    title: "Rispettiamo la tua privacy",
    text: "Usiamo cookie tecnici necessari al funzionamento del sito e, solo con il tuo consenso, cookie di terze parti per statistiche anonime e per mostrare annunci pubblicitari, anche personalizzati, tramite Google. Puoi accettare, rifiutare o scegliere le singole finalità; puoi cambiare idea in qualsiasi momento da “Gestisci cookie” nel piè di pagina.",
    more: "Leggi la Cookie Policy",
    accept: "Accetta tutti",
    reject: "Rifiuta",
    customize: "Personalizza",
    save: "Salva preferenze",
    close: "Chiudi e rifiuta",
    prefsTitle: "Preferenze cookie",
    necessaryTitle: "Necessari",
    necessaryText: "Indispensabili per il funzionamento del sito (es. memorizzare la tua scelta sui cookie e lo stato dei giochi sul tuo dispositivo). Sempre attivi.",
    alwaysOn: "Sempre attivi",
    analyticsTitle: "Statistiche",
    analyticsText: "Ci aiutano a capire in forma aggregata quali giochi vengono usati di più, per migliorarli (Google Analytics).",
    adsTitle: "Pubblicità personalizzata",
    adsText: "Permettono a Google e ai suoi partner di mostrare annunci in base ai tuoi interessi e di misurarne l'efficacia. Se rifiuti vedrai comunque annunci, ma non personalizzati.",
    saved: "Preferenze salvate"
  },

  seo: {
    siteDescription: "Giochi di gruppo e party game gratis da fare in casa: quiz, sfide a squadre e giochi per feste e serate tra amici. Senza app e senza registrazione.",
    defaultKeywords: "giochi di gruppo, party game, giochi da fare in casa, giochi per feste, giochi per serate tra amici, quiz online gratis, giochi a squadre, passatempi"
  },

  home: {
    title: "Giochi di Gruppo e Party Game da Fare in Casa | PartyGames",
    description: "16 party game gratis per feste e serate tra amici: quiz, sfide a squadre, giochi di parole e di coppia. Si gioca da smartphone, PC o TV, senza app e senza registrazione.",
    keywords: "giochi di gruppo, party game, giochi da fare in casa, giochi per feste, giochi per serate tra amici, giochi a squadre, quiz per amici, giochi di società online, giochi da tavolo online gratis, passatempi di gruppo, giochi per adulti e ragazzi, giochi per la famiglia",
    ogTitle: "PartyGames — Giochi di gruppo da fare in casa",
    eyebrow: "Gratis · Senza app · Senza registrazione",
    h1: "Giochi di gruppo e party game da fare in casa",
    lead: "Quiz, sfide a squadre, giochi di parole e di coppia per feste, compleanni e serate tra amici. Apri il gioco sul telefono o proiettalo sulla TV: si comincia in pochi secondi.",
    ctaPrimary: "Scegli un gioco",
    ctaRandom: "Scegli a caso",
    stats: [
      { value: "16", label: "giochi" },
      { value: "2–12+", label: "giocatori" },
      { value: "0 €", label: "per sempre" }
    ],
    gamesH2: "Tutti i party game",
    gamesIntro: "Filtra per tipologia o lascia decidere al caso. Ogni gioco ha le sue regole spiegate passo passo.",
    filtersLabel: "Filtra i giochi per categoria",
    teamsH2: "Le tue squadre",
    teamsIntro: "Imposta nomi, colori e punteggio una volta sola: verranno usati automaticamente da tutti i giochi a squadre. I dati restano solo sul tuo dispositivo.",
    resetScores: "Azzera punteggi",
    whyH2: "Perché giocare con PartyGames",
    why: [
      { h3: "Pronti in pochi secondi", p: "Nessuna app da installare e nessun account: apri la pagina del gioco e inizia subito, da qualsiasi browser." },
      { h3: "Perfetto su TV, PC e smartphone", p: "Testi grandi e leggibili da lontano: proietta il gioco sul televisore e gestisci la partita dal telefono o dal computer." },
      { h3: "Per tutte le compagnie", p: "Giochi per amici, colleghi, coppie e famiglie, con domande adatte a tutti e penitenze divertenti ma innocue." },
      { h3: "Sempre gratis", p: "Tutti i giochi sono gratuiti. Il sito si sostiene con pubblicità discreta che non interrompe mai la partita." }
    ],
    howH2: "Come organizzare una serata di giochi in casa",
    how: [
      { h3: "1. Scegli il gioco giusto", p: "Per rompere il ghiaccio vanno benissimo i giochi party come Il Più Probabile o Dilemmi Morali; per una sfida più accesa scegli un quiz a squadre come L'Intruso o Indovina la Top 10." },
      { h3: "2. Dividetevi in squadre", p: "Usa il pannello “Le tue squadre” per dare un nome e un colore a ogni gruppo: il punteggio vi segue da un gioco all'altro." },
      { h3: "3. Proietta e gioca", p: "Collega il PC alla TV o usa il mirroring dello smartphone. Un conduttore gestisce la partita, tutti gli altri giocano." }
    ],
    faqH2: "Domande frequenti",
    faq: [
      { q: "I giochi sono davvero gratuiti?", a: "Sì. Tutti i giochi di PartyGames sono gratuiti e non richiedono registrazione. Il sito è finanziato da annunci pubblicitari." },
      { q: "Serve installare un'app?", a: "No. I giochi funzionano direttamente nel browser di smartphone, tablet, computer e smart TV." },
      { q: "Quante persone possono giocare?", a: "Dipende dal gioco: alcuni sono sfide a due, altri funzionano con squadre fino a 6 gruppi e un numero libero di giocatori." },
      { q: "Si può giocare sulla TV?", a: "Sì. L'interfaccia è pensata per essere letta da lontano: basta proiettare lo schermo del PC o del telefono sul televisore." },
      { q: "I giochi sono adatti anche ai ragazzi?", a: "I contenuti sono pensati per un pubblico generale. Per i più piccoli consigliamo comunque la presenza di un adulto come conduttore." }
    ]
  },

  pages: {
    privacy: {
      title: "Privacy Policy | PartyGames",
      h1: "Privacy Policy",
      description: "Informativa sul trattamento dei dati personali di PartyGames: dati raccolti, finalità, cookie, Google AdSense, Google Analytics e diritti degli utenti.",
      breadcrumb: "Privacy Policy"
    },
    cookies: {
      title: "Cookie Policy | PartyGames",
      h1: "Cookie Policy",
      description: "Quali cookie e tecnologie simili usa PartyGames, per quali finalità, per quanto tempo e come gestire o revocare il consenso.",
      breadcrumb: "Cookie Policy"
    },
    about: {
      title: "Chi siamo | PartyGames",
      h1: "Chi siamo",
      description: "PartyGames è una raccolta di giochi di gruppo e party game gratuiti da fare in casa, pensata per feste e serate tra amici.",
      breadcrumb: "Chi siamo"
    },
    contact: {
      title: "Contatti | PartyGames",
      h1: "Contatti",
      description: "Contatta il team di PartyGames per segnalazioni, suggerimenti di nuovi giochi o richieste sulla privacy.",
      breadcrumb: "Contatti"
    },
    notFound: {
      title: "Pagina non trovata | PartyGames",
      h1: "Ops! Pagina non trovata",
      lead: "La pagina che cerchi non esiste o è stata spostata.",
      back: "Torna alla home"
    }
  }
};
