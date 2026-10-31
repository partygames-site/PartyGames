/* ENGLISH dictionary — UI strings, routes and SEO.
   Same schema as it.mjs: translate the values, never the keys. */

export default {
  code: "en",
  locale: "en_US",
  name: "English",

  routes: {
    home: "/",
    games: "/games/",
    privacy: "/privacy/",
    cookies: "/cookie-policy/",
    about: "/about/",
    contact: "/contact/"
  },

  ui: {
    skipToContent: "Skip to content",
    navHome: "Home",
    navGames: "Games",
    navHowTo: "How to play",
    navAbout: "About",
    mainNavLabel: "Main navigation",
    languageLabel: "Language",
    switchTo: "Switch to",
    breadcrumbLabel: "Breadcrumb",
    adLabel: "Advertisement",
    footerTagline: "Free group games and party games to play at home on your phone, tablet, computer or TV.",
    footerGames: "Games",
    footerInfo: "Information",
    footerLegal: "Legal",
    privacy: "Privacy Policy",
    cookies: "Cookie Policy",
    manageCookies: "Manage cookies",
    about: "About",
    contact: "Contact",
    allRights: "All rights reserved.",
    play: "Play now",
    comingSoon: "Coming soon",
    players: "Players",
    lastUpdated: "Last updated",
    rulesLink: "Rules and tips",
    relatedGames: "More games to try"
  },

  categories: {
    all: "All",
    party: "Party",
    quiz: "Quiz",
    teams: "Teams",
    words: "Words",
    couples: "Couples"
  },

  js: {
    teamsCount: "{n} teams",
    teamName: "Team name",
    teamColor: "Team colour",
    teamDefault: "Team {n}",
    teamMinus: "Remove a point from {name}",
    teamPlus: "Add a point to {name}",
    resetConfirm: "Reset the score of every team?",
    randomNone: "Games are coming soon: check back shortly!",
    randomPicked: "Up next: {title}!",
    points: "pts"
  },

  consent: {
    title: "We respect your privacy",
    text: "We use technical cookies that the site needs to work and, only with your consent, third-party cookies for anonymous statistics and to show ads, including personalised ads, through Google. You can accept, reject or choose each purpose, and change your mind at any time from “Manage cookies” in the footer.",
    more: "Read the Cookie Policy",
    accept: "Accept all",
    reject: "Reject",
    customize: "Customise",
    save: "Save preferences",
    close: "Close and reject",
    prefsTitle: "Cookie preferences",
    necessaryTitle: "Necessary",
    necessaryText: "Required for the site to work (for example to remember your cookie choice and the game state on your device). Always on.",
    alwaysOn: "Always on",
    analyticsTitle: "Statistics",
    analyticsText: "Help us understand, in aggregate, which games are played most so we can improve them (Google Analytics).",
    adsTitle: "Personalised advertising",
    adsText: "Allow Google and its partners to show ads based on your interests and to measure their performance. If you reject, you will still see ads, but they will not be personalised.",
    saved: "Preferences saved"
  },

  seo: {
    siteDescription: "Free group games and party games to play at home: quizzes, team challenges and games for parties and game nights with friends. No app, no sign-up.",
    defaultKeywords: "party games, group games, games to play at home, game night ideas, free online quiz, team games, party games for adults, fun games for friends"
  },

  home: {
    title: "Party Games & Group Games to Play at Home | PartyGames Club",
    description: "16 free party games for game night: quizzes, team challenges, word games and games for couples. Play on your phone, computer or TV, with no app and no sign-up.",
    keywords: "party games, group games, games to play at home, game night games, team games, quiz games for friends, free online party games, house party games, family game night, party games for adults, icebreaker games, fun group activities",
    ogTitle: "PartyGames Club — Group games to play at home",
    eyebrow: "Free · No app · No sign-up",
    h1: "Party games and group games to play at home",
    lead: "Quizzes, team challenges, word games and games for couples for parties, birthdays and game nights. Open a game on your phone or cast it to the TV and you're ready in seconds.",
    ctaPrimary: "Pick a game",
    ctaRandom: "Surprise me",
    stats: [
      { value: "16", label: "games" },
      { value: "2–12+", label: "players" },
      { value: "$0", label: "forever" }
    ],
    gamesH2: "All party games",
    gamesIntro: "Filter by type or let chance decide. Every game comes with step-by-step rules.",
    filtersLabel: "Filter games by category",
    teamsH2: "Your teams",
    teamsIntro: "Set names, colours and scores once and every team game will use them automatically. The data stays on your device only.",
    resetScores: "Reset scores",
    whyH2: "Why play with PartyGames Club",
    why: [
      { h3: "Ready in seconds", p: "No app to install and no account: open a game page and start right away, in any browser." },
      { h3: "Great on TV, computer and phone", p: "Big text you can read from across the room: cast the game to your TV and run it from your phone or laptop." },
      { h3: "For every crowd", p: "Games for friends, colleagues, couples and families, with questions for everyone and silly, harmless forfeits." },
      { h3: "Always free", p: "Every game is free. The site is funded by unobtrusive ads that never interrupt a round." }
    ],
    howH2: "How to host a game night at home",
    how: [
      { h3: "1. Choose the right game", p: "Party games like Most Likely To or Moral Dilemmas are perfect icebreakers; for a fiercer contest pick a team quiz like Odd One Out or Guess the Top 10." },
      { h3: "2. Split into teams", p: "Use the “Your teams” panel to give each group a name and a colour: the score follows you from one game to the next." },
      { h3: "3. Cast it and play", p: "Connect your computer to the TV or mirror your phone. One host runs the game while everyone else plays." }
    ],
    faqH2: "Frequently asked questions",
    faq: [
      { q: "Are the games really free?", a: "Yes. Every PartyGames Club game is free and needs no sign-up. The site is funded by advertising." },
      { q: "Do I need to install an app?", a: "No. The games run directly in the browser on phones, tablets, computers and smart TVs." },
      { q: "How many people can play?", a: "It depends on the game: some are one-on-one duels, others support up to 6 teams with any number of players." },
      { q: "Can we play on the TV?", a: "Yes. The interface is designed to be read from a distance: just cast your computer or phone screen to the TV." },
      { q: "Are the games suitable for kids?", a: "The content is designed for a general audience. For younger players we still recommend an adult acting as host." }
    ]
  },

  pages: {
    privacy: {
      title: "Privacy Policy | PartyGames Club",
      h1: "Privacy Policy",
      description: "How PartyGames Club processes personal data: data collected, purposes, cookies, Google AdSense, Google Analytics and your rights.",
      breadcrumb: "Privacy Policy"
    },
    cookies: {
      title: "Cookie Policy | PartyGames Club",
      h1: "Cookie Policy",
      description: "Which cookies and similar technologies PartyGames Club uses, why, for how long, and how to manage or withdraw your consent.",
      breadcrumb: "Cookie Policy"
    },
    about: {
      title: "About | PartyGames Club",
      h1: "About PartyGames Club",
      description: "PartyGames Club is a collection of free group games and party games to play at home, made for parties and game nights.",
      breadcrumb: "About"
    },
    contact: {
      title: "Contact | PartyGames Club",
      h1: "Contact",
      description: "Get in touch with the PartyGames Club team for bug reports, new game ideas or privacy requests.",
      breadcrumb: "Contact"
    },
    notFound: {
      title: "Page not found | PartyGames Club",
      h1: "Oops! Page not found",
      lead: "The page you are looking for does not exist or has been moved.",
      back: "Back to the home page"
    }
  }
};
