/* IL PICCO — contenuti in italiano.
   Ogni soggetto: tipo ("imdb" = film col voto più alto, "spotify" =
   canzone più ascoltata) e i titoli "Titolo|punteggio|alias…".
   Il primo titolo è il picco; i titoli italiani sono tra gli alias. */

export default {
  locale: "it-IT",
  ui: {
      "counter": "Soggetto {n}",
      "turn": "Tocca a {name}",
      "imdb": "🎬 Il film con il voto IMDb più alto",
      "spotify": "🎧 La canzone più ascoltata su Spotify",
      "guessLabel": "Titolo detto dal gruppo",
      "placeholder": "Titolo detto dal gruppo…",
      "submit": "Invia",
      "hint": "💡 Premi Invio per inviare: i piccoli errori di battitura vengono tollerati",
      "empty": "Nessun tentativo ancora: indovinate ad alta voce!",
      "peak": "🏆 RECORD RAGGIUNTO!",
      "good": "👍 Titolo valido, ma non è il picco",
      "unknown": "❓ Non riconosciuto",
      "solved": "🏆 Picco raggiunto da {name}! Ecco la Top 5:",
      "revealed": "📖 Risposta rivelata. Ecco la Top 5:",
      "reveal": "🏳️ Rivela la risposta",
      "next": "Prossimo soggetto ▶",
      "imdbUnit": "IMDb",
      "spotifyUnit": "mld di stream",
      "filterLabel": "Tipo di sfida",
      "filters": {
          "all": "🎲 Tutto",
          "imdb": "🎬 Film",
          "spotify": "🎧 Musica"
      },
      "end": "Termina partita",
      "resultTitle": "Classifica finale",
      "resultLine": "Avete giocato {n} soggetti.",
      "restart": "Nuova partita",
      "note": "Voti e ascolti indicativi, aggiornati circa al 2025."
  },

  subjects: [
    { name: "Leonardo DiCaprio", type: "imdb", items: [
      "Inception|8.8|inception",
      "Django Unchained|8.4|django unchained|django",
      "Shutter Island|8.2|shutter island",
      "The Wolf of Wall Street|8.2|wolf of wall street|il lupo di wall street",
      "Titanic|7.9|titanic"
    ] },
    { name: "Christopher Nolan", type: "imdb", items: [
      "The Dark Knight|9|the dark knight|dark knight|il cavaliere oscuro|cavaliere oscuro",
      "Oppenheimer|8.9|oppenheimer",
      "Inception|8.8|inception",
      "Interstellar|8.7|interstellar",
      "Memento|8.4|memento"
    ] },
    { name: "Keanu Reeves", type: "imdb", items: [
      "The Matrix|8.7|the matrix|matrix",
      "John Wick: Chapter 4|7.7|john wick 4|john wick chapter 4|john wick capitolo 4",
      "John Wick|7.4|john wick",
      "Speed|7.3|speed",
      "The Matrix Reloaded|7.2|matrix reloaded|the matrix reloaded"
    ] },
    { name: "Tom Hanks", type: "imdb", items: [
      "Forrest Gump|8.8|forrest gump",
      "Saving Private Ryan|8.6|saving private ryan|salvate il soldato ryan",
      "Toy Story|8.3|toy story",
      "Cast Away|7.8|cast away",
      "Big|7.4|big"
    ] },
    { name: "Brad Pitt", type: "imdb", items: [
      "Fight Club|8.8|fight club",
      "Se7en|8.6|se7en|seven|sette",
      "Inglourious Basterds|8.3|inglourious basterds|bastardi senza gloria",
      "Ocean's Eleven|7.7|oceans eleven|ocean's eleven",
      "Once Upon a Time in Hollywood|7.6|once upon a time in hollywood|cera una volta a hollywood"
    ] },
    { name: "Meryl Streep", type: "imdb", items: [
      "The Deer Hunter|8.1|the deer hunter|deer hunter|il cacciatore",
      "Sophie's Choice|7.9|sophies choice|sophie's choice|la scelta di sophie",
      "Kramer vs. Kramer|7.7|kramer vs kramer|kramer contro kramer",
      "The Devil Wears Prada|6.9|the devil wears prada|il diavolo veste prada",
      "Mamma Mia!|6.4|mamma mia"
    ] },
    { name: "Queen", type: "spotify", items: [
      "Bohemian Rhapsody|2.3|bohemian rhapsody",
      "Another One Bites the Dust|1.1|another one bites the dust",
      "Don't Stop Me Now|1|dont stop me now|don't stop me now",
      "We Will Rock You|0.9|we will rock you",
      "Somebody to Love|0.5|somebody to love"
    ] },
    { name: "Coldplay", type: "spotify", items: [
      "Yellow|2|yellow",
      "Something Just Like This|1.8|something just like this",
      "Viva la Vida|1.5|viva la vida",
      "The Scientist|1.3|the scientist",
      "Paradise|1.2|paradise"
    ] },
    { name: "Eminem", type: "spotify", items: [
      "Lose Yourself|2|lose yourself",
      "Love the Way You Lie|1.9|love the way you lie",
      "Without Me|1.6|without me",
      "The Real Slim Shady|1.3|the real slim shady|real slim shady",
      "Stan|1.2|stan"
    ] },
    { name: "Ed Sheeran", type: "spotify", items: [
      "Shape of You|4|shape of you",
      "Perfect|2.8|perfect",
      "Thinking Out Loud|2|thinking out loud",
      "Photograph|1.5|photograph",
      "Bad Habits|1.3|bad habits"
    ] },
    { name: "The Weeknd", type: "spotify", items: [
      "Blinding Lights|4.5|blinding lights",
      "Starboy|2.9|starboy",
      "Save Your Tears|1.9|save your tears",
      "Die For You|1.8|die for you",
      "Can't Feel My Face|1.4|cant feel my face|can't feel my face"
    ] },
    { name: "Billie Eilish", type: "spotify", items: [
      "bad guy|2.9|bad guy",
      "everything i wanted|1.3|everything i wanted",
      "Happier Than Ever|1.1|happier than ever",
      "Ocean Eyes|0.9|ocean eyes",
      "Bellyache|0.6|bellyache"
    ] },
    { name: "Tom Cruise", type: "imdb", items: [
      "Top Gun: Maverick|8.2|top gun maverick|top gun 2",
      "Rain Man|8|rain man",
      "Edge of Tomorrow|7.9|edge of tomorrow|senza domani",
      "Mission: Impossible - Fallout|7.7|mission impossible fallout",
      "Jerry Maguire|7.3|jerry maguire"
    ] },
    { name: "Robert Downey Jr.", type: "imdb", items: [
      "Oppenheimer|8.9|oppenheimer",
      "Avengers: Endgame|8.4|avengers endgame",
      "Iron Man|7.9|iron man",
      "Sherlock Holmes|7.6|sherlock holmes",
      "Tropic Thunder|7|tropic thunder"
    ] },
    { name: "Will Smith", type: "imdb", items: [
      "The Pursuit of Happyness|8|the pursuit of happyness|pursuit of happyness|la ricerca della felicita",
      "King Richard|7.5|king richard",
      "Men in Black|7.3|men in black",
      "I Am Legend|7.2|i am legend",
      "Independence Day|6.9|independence day"
    ] },
    { name: "Denzel Washington", type: "imdb", items: [
      "Glory|7.8|glory",
      "Training Day|7.7|training day",
      "American Gangster|7.7|american gangster",
      "Man on Fire|7.6|man on fire",
      "Fences|7.2|fences"
    ] },
    { name: "Scarlett Johansson", type: "imdb", items: [
      "Avengers: Endgame|8.4|avengers endgame",
      "Jojo Rabbit|7.9|jojo rabbit",
      "Marriage Story|7.9|marriage story|storia di un matrimonio",
      "Lost in Translation|7.7|lost in translation",
      "Lucy|6.4|lucy"
    ] },
    { name: "Morgan Freeman", type: "imdb", items: [
      "The Shawshank Redemption|9.3|the shawshank redemption|shawshank redemption|le ali della liberta",
      "The Dark Knight|9|the dark knight|dark knight|il cavaliere oscuro",
      "Se7en|8.6|se7en|seven|sette",
      "Million Dollar Baby|8.1|million dollar baby",
      "Invictus|7.4|invictus"
    ] },
    { name: "Natalie Portman", type: "imdb", items: [
      "Léon: The Professional|8.5|leon the professional|leon|this is leon",
      "V for Vendetta|8.2|v for vendetta",
      "Black Swan|8|black swan",
      "Closer|7.2|closer",
      "Thor|6.8|thor"
    ] },
    { name: "Al Pacino", type: "imdb", items: [
      "The Godfather|9.2|the godfather|godfather|il padrino",
      "The Godfather Part II|9|the godfather part 2|godfather part 2|il padrino parte 2",
      "Scarface|8.3|scarface",
      "Heat|8.2|heat",
      "The Godfather Part III|7.6|the godfather part 3|il padrino parte 3"
    ] },
    { name: "Samuel L. Jackson", type: "imdb", items: [
      "Pulp Fiction|8.9|pulp fiction",
      "Django Unchained|8.4|django unchained|django",
      "Jurassic Park|8.2|jurassic park",
      "The Avengers|8|the avengers|avengers",
      "Unbreakable|7.3|unbreakable"
    ] },
    { name: "Quentin Tarantino", type: "imdb", items: [
      "Pulp Fiction|8.9|pulp fiction",
      "Django Unchained|8.4|django unchained|django",
      "Inglourious Basterds|8.3|inglourious basterds|bastardi senza gloria",
      "Reservoir Dogs|8.3|reservoir dogs|le iene",
      "Kill Bill: Vol. 1|8.2|kill bill vol 1|kill bill"
    ] },
    { name: "Steven Spielberg", type: "imdb", items: [
      "Schindler's List|9|schindlers list|schindler's list|schindler list",
      "Saving Private Ryan|8.6|saving private ryan|salvate il soldato ryan",
      "Jurassic Park|8.2|jurassic park",
      "Jaws|8.1|jaws|lo squalo",
      "E.T. the Extra-Terrestrial|7.9|e.t.|et the extra terrestrial|et"
    ] },
    { name: "Martin Scorsese", type: "imdb", items: [
      "Goodfellas|8.7|goodfellas|quei bravi ragazzi",
      "The Departed|8.5|the departed|the departed - il bene e il male",
      "Taxi Driver|8.2|taxi driver",
      "Casino|8.2|casino",
      "The Wolf of Wall Street|8.2|the wolf of wall street|il lupo di wall street"
    ] },
    { name: "Taylor Swift", type: "spotify", items: [
      "Cruel Summer|2.5|cruel summer",
      "Anti-Hero|2.2|anti hero|antihero",
      "Blank Space|2|blank space",
      "Shake It Off|1.9|shake it off",
      "Lover|1.3|lover"
    ] },
    { name: "Ariana Grande", type: "spotify", items: [
      "7 rings|2.2|7 rings|seven rings",
      "thank u, next|1.8|thank u next",
      "No Tears Left to Cry|1.4|no tears left to cry",
      "Side to Side|1.2|side to side",
      "God is a woman|1.1|god is a woman"
    ] },
    { name: "Drake", type: "spotify", items: [
      "One Dance|2.5|one dance",
      "God's Plan|2|gods plan|god's plan",
      "Hotline Bling|1.7|hotline bling",
      "In My Feelings|1.6|in my feelings",
      "Passionfruit|1.5|passionfruit"
    ] },
    { name: "Rihanna", type: "spotify", items: [
      "Diamonds|1.9|diamonds",
      "Work|1.8|work",
      "Umbrella|1.3|umbrella",
      "Love on the Brain|1.2|love on the brain",
      "Don't Stop the Music|0.9|dont stop the music|don't stop the music"
    ] },
    { name: "Justin Bieber", type: "spotify", items: [
      "Stay|2.7|stay",
      "Sorry|2.3|sorry",
      "Love Yourself|2.1|love yourself",
      "Peaches|1.6|peaches",
      "What Do You Mean?|1.3|what do you mean"
    ] },
    { name: "Bruno Mars", type: "spotify", items: [
      "Uptown Funk|2|uptown funk",
      "Just the Way You Are|1.5|just the way you are",
      "That's What I Like|1.2|thats what i like",
      "Grenade|1.1|grenade",
      "24K Magic|1.1|24k magic"
    ] },
    { name: "Adele", type: "spotify", items: [
      "Rolling in the Deep|1.9|rolling in the deep",
      "Easy On Me|1.7|easy on me",
      "Hello|1.6|hello",
      "Someone Like You|1.4|someone like you",
      "Set Fire to the Rain|1.1|set fire to the rain"
    ] },
    { name: "Post Malone", type: "spotify", items: [
      "Sunflower|3|sunflower",
      "Circles|2.3|circles",
      "Rockstar|2.2|rockstar",
      "Congratulations|1.6|congratulations",
      "Better Now|1.5|better now"
    ] },
    { name: "Dua Lipa", type: "spotify", items: [
      "Don't Start Now|2|dont start now|don't start now",
      "Levitating|1.8|levitating",
      "New Rules|1.6|new rules",
      "One Kiss|1.2|one kiss",
      "IDGAF|1|idgaf"
    ] },
    { name: "Imagine Dragons", type: "spotify", items: [
      "Believer|2.4|believer",
      "Thunder|2.1|thunder",
      "Radioactive|1.9|radioactive",
      "Demons|1.7|demons",
      "Bad Liar|0.8|bad liar"
    ] },
    { name: "Maroon 5", type: "spotify", items: [
      "Sugar|1.8|sugar",
      "Girls Like You|1.7|girls like you",
      "Memories|1.6|memories",
      "Animals|1.2|animals",
      "Payphone|1.1|payphone"
    ] },
    { name: "Michael Jackson", type: "spotify", items: [
      "Billie Jean|1.4|billie jean",
      "Thriller|1.2|thriller",
      "Smooth Criminal|1.1|smooth criminal",
      "Beat It|1|beat it",
      "Man in the Mirror|0.6|man in the mirror"
    ] },
    { name: "Christian De Sica", type: "imdb", items: [
      "Sapore di mare|7|sapore di mare",
      "Vacanze di Natale|6.4|vacanze di natale",
      "Yuppies|5.8|yuppies",
      "Vacanze di Natale '90|5.7|vacanze di natale 90",
      "Grand Hotel Excelsior|5.5|grand hotel excelsior"
    ] },
    { name: "George Clooney", type: "imdb", items: [
      "Gravity|7.7|gravity",
      "Ocean's Eleven|7.6|oceans eleven|ocean's eleven",
      "Good Night, and Good Luck|7.5|good night and good luck",
      "Up in the Air|7.4|up in the air",
      "Michael Clayton|7.2|michael clayton"
    ] },
    { name: "Margot Robbie", type: "imdb", items: [
      "The Wolf of Wall Street|8.2|the wolf of wall street|il lupo di wall street",
      "Once Upon a Time in Hollywood|7.6|once upon a time in hollywood",
      "I, Tonya|7.5|i tonya",
      "Barbie|6.8|barbie",
      "Suicide Squad|5.9|suicide squad"
    ] },
    { name: "Christian Bale", type: "imdb", items: [
      "The Dark Knight|9|the dark knight|dark knight|il cavaliere oscuro",
      "The Prestige|8.5|the prestige",
      "Ford v Ferrari|8.1|ford v ferrari|le mans 66",
      "The Fighter|7.8|the fighter",
      "American Psycho|7.6|american psycho"
    ] },
    { name: "Charlize Theron", type: "imdb", items: [
      "Mad Max: Fury Road|8.1|mad max fury road",
      "Monster|7.4|monster",
      "The Italian Job|6.9|the italian job",
      "Atomic Blonde|6.7|atomic blonde",
      "Young Adult|6.5|young adult"
    ] },
    { name: "Nicole Kidman", type: "imdb", items: [
      "Lion|7.9|lion",
      "Moulin Rouge!|7.6|moulin rouge",
      "The Others|7.6|the others",
      "Eyes Wide Shut|7.5|eyes wide shut",
      "Cold Mountain|7.3|cold mountain"
    ] },
    { name: "Joaquin Phoenix", type: "imdb", items: [
      "Gladiator|8.5|gladiator|il gladiatore",
      "Joker|8.4|joker",
      "Her|8|her",
      "Walk the Line|7.8|walk the line",
      "The Master|7.2|the master"
    ] },
    { name: "Julia Roberts", type: "imdb", items: [
      "Ocean's Eleven|7.7|oceans eleven|ocean's eleven",
      "Erin Brockovich|7.4|erin brockovich",
      "Pretty Woman|7|pretty woman",
      "Notting Hill|7|notting hill",
      "My Best Friend's Wedding|6.7|my best friends wedding"
    ] },
    { name: "Cillian Murphy", type: "imdb", items: [
      "Oppenheimer|8.9|oppenheimer",
      "Inception|8.8|inception",
      "Batman Begins|8.2|batman begins",
      "28 Days Later|7.6|28 days later",
      "In Time|6.7|in time"
    ] },
    { name: "Emma Stone", type: "imdb", items: [
      "The Help|8.1|the help",
      "La La Land|8|la la land",
      "Poor Things|7.9|poor things",
      "Birdman|7.7|birdman",
      "Easy A|7|easy a"
    ] },
    { name: "Ryan Gosling", type: "imdb", items: [
      "La La Land|8|la la land",
      "Blade Runner 2049|7.9|blade runner 2049",
      "Drive|7.8|drive",
      "The Notebook|7.8|the notebook",
      "Barbie|6.8|barbie"
    ] },
    { name: "Zendaya", type: "imdb", items: [
      "Dune: Part Two|8.5|dune part two|dune 2",
      "Spider-Man: No Way Home|8.2|spider man no way home",
      "Dune|8|dune",
      "The Greatest Showman|7.5|the greatest showman",
      "Challengers|7.1|challengers"
    ] },
    { name: "Timothée Chalamet", type: "imdb", items: [
      "Dune: Part Two|8.5|dune part two|dune 2",
      "Dune|8|dune",
      "Call Me by Your Name|7.9|call me by your name",
      "Little Women|7.8|little women",
      "Wonka|7|wonka"
    ] },
    { name: "Monica Bellucci", type: "imdb", items: [
      "Irréversible|7.3|irreversible",
      "Malèna|7|malena",
      "Brotherhood of the Wolf|7.1|brotherhood of the wolf|il patto dei lupi",
      "The Matrix Reloaded|7.2|matrix reloaded|the matrix reloaded",
      "Spectre|6.8|spectre"
    ] },
    { name: "Jacob Elordi", type: "imdb", items: [
      "Saltburn|7.1|saltburn",
      "Priscilla|6.7|priscilla",
      "Deep Water|5.6|deep water",
      "The Kissing Booth|5.2|the kissing booth",
      "The Kissing Booth 2|4.9|the kissing booth 2"
    ] },
    { name: "Ben Affleck", type: "imdb", items: [
      "Good Will Hunting|8.3|good will hunting",
      "Gone Girl|8.1|gone girl|l'amore bugiardo",
      "Argo|7.7|argo",
      "Dazed and Confused|7.6|dazed and confused",
      "The Town|7.5|the town"
    ] },
    { name: "Matt Damon", type: "imdb", items: [
      "Interstellar|8.7|interstellar",
      "Saving Private Ryan|8.6|saving private ryan|salvate il soldato ryan",
      "Good Will Hunting|8.3|good will hunting",
      "The Martian|8|the martian|sopravvissuto - the martian",
      "The Bourne Identity|7.9|the bourne identity"
    ] },
    { name: "Edward Norton", type: "imdb", items: [
      "Fight Club|8.8|fight club",
      "American History X|8.5|american history x",
      "The Grand Budapest Hotel|8.1|the grand budapest hotel",
      "Birdman|7.7|birdman",
      "Primal Fear|7.7|primal fear"
    ] },
    { name: "Uma Thurman", type: "imdb", items: [
      "Pulp Fiction|8.9|pulp fiction",
      "Kill Bill: Vol. 1|8.2|kill bill vol 1|kill bill",
      "Kill Bill: Vol. 2|8|kill bill vol 2",
      "Gattaca|7.8|gattaca",
      "Batman & Robin|3.7|batman and robin|batman & robin"
    ] },
    { name: "John Travolta", type: "imdb", items: [
      "Pulp Fiction|8.9|pulp fiction",
      "Face/Off|7.3|face off",
      "Grease|7.2|grease",
      "Get Shorty|6.9|get shorty",
      "Saturday Night Fever|6.8|saturday night fever|la febbre del sabato sera"
    ] },
    { name: "Jake Gyllenhaal", type: "imdb", items: [
      "Prisoners|8.1|prisoners",
      "Donnie Darko|8|donnie darko",
      "Nightcrawler|7.8|nightcrawler",
      "Zodiac|7.7|zodiac",
      "Brokeback Mountain|7.7|brokeback mountain|i segreti di brokeback mountain"
    ] },
    { name: "Anne Hathaway", type: "imdb", items: [
      "The Dark Knight Rises|8.4|the dark knight rises|il cavaliere oscuro il ritorno",
      "Les Misérables|7.6|les miserables",
      "Rachel Getting Married|7.4|rachel getting married",
      "The Devil Wears Prada|6.9|the devil wears prada|il diavolo veste prada",
      "The Princess Diaries|6.2|the princess diaries|pretty princess"
    ] },
    { name: "Johnny Depp", type: "imdb", items: [
      "Pirates of the Caribbean: The Curse of the Black Pearl|8.1|pirates of the caribbean the curse of the black pearl|pirates of the caribbean|la maledizione della prima luna",
      "Edward Scissorhands|7.9|edward scissorhands|edward mani di forbice",
      "Donnie Brasco|7.7|donnie brasco",
      "Sweeney Todd|7.3|sweeney todd",
      "Charlie and the Chocolate Factory|6.7|charlie and the chocolate factory|la fabbrica di cioccolato"
    ] },
    { name: "Rachel McAdams", type: "imdb", items: [
      "Spotlight|8.1|spotlight",
      "The Notebook|7.8|the notebook",
      "About Time|7.8|about time",
      "Sherlock Holmes|7.6|sherlock holmes",
      "Mean Girls|7.1|mean girls"
    ] },
    { name: "Ryan Reynolds", type: "imdb", items: [
      "Deadpool|8|deadpool",
      "Deadpool 2|7.7|deadpool 2",
      "Free Guy|7.1|free guy",
      "Definitely, Maybe|7|definitely maybe",
      "The Proposal|6.7|the proposal"
    ] },
    { name: "Cameron Diaz", type: "imdb", items: [
      "Shrek|7.9|shrek",
      "There's Something About Mary|7.1|theres something about mary",
      "The Mask|6.9|the mask",
      "Vanilla Sky|6.9|vanilla sky",
      "Charlie's Angels|5.7|charlies angels"
    ] },
    { name: "Winona Ryder", type: "imdb", items: [
      "Black Swan|8|black swan",
      "Edward Scissorhands|7.9|edward scissorhands|edward mani di forbice",
      "Beetlejuice|7.5|beetlejuice",
      "Girl, Interrupted|7.3|girl interrupted",
      "Heathers|7.2|heathers"
    ] },
    { name: "Anthony Hopkins", type: "imdb", items: [
      "The Silence of the Lambs|8.6|the silence of the lambs|il silenzio degli innocenti",
      "The Father|8|the father",
      "Nixon|7.1|nixon",
      "Thor|7|thor",
      "Hannibal|6.7|hannibal"
    ] },
    { name: "Sandra Bullock", type: "imdb", items: [
      "Gravity|7.7|gravity",
      "The Blind Side|7.6|the blind side",
      "Speed|7.3|speed",
      "While You Were Sleeping|6.9|while you were sleeping",
      "Miss Congeniality|6.4|miss congeniality"
    ] },
    { name: "Angelina Jolie", type: "imdb", items: [
      "Changeling|7.6|changeling",
      "Girl, Interrupted|7.3|girl interrupted",
      "Maleficent|7|maleficent",
      "Wanted|6.7|wanted",
      "Mr. & Mrs. Smith|6.5|mr and mrs smith"
    ] },
    { name: "Robert De Niro", type: "imdb", items: [
      "The Godfather Part II|9|the godfather part 2|the godfather part ii|godfather part 2|il padrino parte 2",
      "Goodfellas|8.7|goodfellas|quei bravi ragazzi",
      "Heat|8.3|heat",
      "Taxi Driver|8.2|taxi driver",
      "Raging Bull|8.2|raging bull|toro scatenato"
    ] },
    { name: "Harrison Ford", type: "imdb", items: [
      "The Empire Strikes Back|8.7|the empire strikes back|empire strikes back|star wars episode 5",
      "Star Wars: A New Hope|8.6|star wars|a new hope|star wars episode 4",
      "Raiders of the Lost Ark|8.4|raiders of the lost ark|i predatori dell'arca perduta",
      "Indiana Jones and the Last Crusade|8.2|indiana jones and the last crusade|last crusade|ultima crociata",
      "Blade Runner|8.1|blade runner"
    ] },
    { name: "Tom Hardy", type: "imdb", items: [
      "Inception|8.8|inception",
      "The Dark Knight Rises|8.4|the dark knight rises|dark knight rises",
      "Mad Max: Fury Road|8.1|mad max fury road|mad max",
      "Dunkirk|7.8|dunkirk",
      "Venom|6.6|venom"
    ] },
    { name: "Hugh Jackman", type: "imdb", items: [
      "The Prestige|8.5|the prestige|prestige",
      "Logan|8.1|logan",
      "X-Men: Days of Future Past|7.9|days of future past|x-men days of future past",
      "Les Misérables|7.6|les miserables|les misérables",
      "The Greatest Showman|7.6|the greatest showman|greatest showman"
    ] },
    { name: "Chris Hemsworth", type: "imdb", items: [
      "Avengers: Endgame|8.4|avengers endgame",
      "Rush|8.1|rush",
      "The Avengers|8|the avengers|avengers",
      "Thor: Ragnarok|7.9|thor ragnarok",
      "Extraction|6.8|extraction"
    ] },
    { name: "Emma Watson", type: "imdb", items: [
      "Harry Potter and the Deathly Hallows: Part 2|8.1|deathly hallows part 2|harry potter and the deathly hallows part 2|reliquie della morte parte 2",
      "The Perks of Being a Wallflower|8|perks of being a wallflower|noi siamo infinito",
      "Harry Potter and the Prisoner of Azkaban|7.9|prisoner of azkaban|il prigioniero di azkaban",
      "Little Women|7.8|little women|piccole donne",
      "Beauty and the Beast|7.1|beauty and the beast|la bella e la bestia"
    ] },
    { name: "Jennifer Lawrence", type: "imdb", items: [
      "Silver Linings Playbook|7.7|silver linings playbook",
      "X-Men: First Class|7.7|x men first class|x-men first class",
      "Winter's Bone|7.3|winters bone|winter's bone",
      "American Hustle|7.2|american hustle",
      "The Hunger Games|7.2|the hunger games|hunger games|hunger games"
    ] },
    { name: "Daniel Day-Lewis", type: "imdb", items: [
      "There Will Be Blood|8.2|there will be blood",
      "In the Name of the Father|7.8|in the name of the father|nel nome del padre",
      "My Left Foot|7.6|my left foot|il mio piede sinistro",
      "Gangs of New York|7.5|gangs of new york",
      "Lincoln|7.4|lincoln"
    ] },
    { name: "Heath Ledger", type: "imdb", items: [
      "The Dark Knight|9|the dark knight|dark knight|il cavaliere oscuro",
      "Brokeback Mountain|7.7|brokeback mountain|i segreti di brokeback mountain",
      "10 Things I Hate About You|7.3|10 things i hate about you",
      "The Patriot|7.2|the patriot|il patriota",
      "A Knight's Tale|7|a knights tale|knights tale"
    ] },
    { name: "Jack Nicholson", type: "imdb", items: [
      "One Flew Over the Cuckoo's Nest|8.7|one flew over the cuckoos nest|cuckoos nest|qualcuno volo sul nido del cuculo",
      "The Shining|8.4|the shining|shining",
      "Chinatown|8.2|chinatown",
      "A Few Good Men|7.7|a few good men|few good men|questioni di onore",
      "Batman|7.5|batman"
    ] },
    { name: "Sylvester Stallone", type: "imdb", items: [
      "Rocky|8.1|rocky",
      "Rambo: First Blood|7.6|first blood|rambo first blood|rambo",
      "Creed|7.6|creed",
      "Rocky Balboa|7.1|rocky balboa",
      "Cop Land|6.8|cop land"
    ] },
    { name: "Arnold Schwarzenegger", type: "imdb", items: [
      "Terminator 2: Judgment Day|8.6|terminator 2|terminator 2 judgment day",
      "The Terminator|8.1|the terminator|terminator",
      "Predator|7.8|predator",
      "Total Recall|7.5|total recall|atto di forza",
      "True Lies|7.2|true lies|true lies mentre bugie"
    ] },
    { name: "Sigourney Weaver", type: "imdb", items: [
      "Alien|8.5|alien",
      "Aliens|8.4|aliens|aliens scontro finale",
      "Avatar|7.9|avatar",
      "Ghostbusters|7.8|ghostbusters|acchiappafantasmi",
      "Working Girl|6.7|working girl"
    ] },
    { name: "Robin Williams", type: "imdb", items: [
      "Good Will Hunting|8.3|good will hunting",
      "Dead Poets Society|8.1|dead poets society|l'attimo fuggente",
      "Aladdin|8|aladdin",
      "Mrs. Doubtfire|7.1|mrs doubtfire|mrs. doubtfire|papà per finta",
      "Jumanji|7|jumanji"
    ] },
    { name: "Kate Winslet", type: "imdb", items: [
      "Eternal Sunshine of the Spotless Mind|8.3|eternal sunshine of the spotless mind|eternal sunshine|se mi lasci ti cancello",
      "Titanic|7.9|titanic",
      "The Reader|7.5|the reader|the reader a voce alta",
      "Revolutionary Road|7.3|revolutionary road",
      "Steve Jobs|7.2|steve jobs"
    ] },
    { name: "Mark Wahlberg", type: "imdb", items: [
      "The Departed|8.5|the departed|the departed il bene e il male",
      "Boogie Nights|7.9|boogie nights",
      "Lone Survivor|7.6|lone survivor",
      "Deepwater Horizon|7|deepwater horizon",
      "Ted|6.9|ted"
    ] },
    { name: "Viola Davis", type: "imdb", items: [
      "The Help|8.1|the help",
      "Doubt|7.5|doubt|il dubbio",
      "Fences|7.2|fences",
      "Widows|6.6|widows|widows eredita criminale",
      "Suicide Squad|5.9|suicide squad"
    ] },
    { name: "Emma Thompson", type: "imdb", items: [
      "Sense and Sensibility|7.7|sense and sensibility|ragione e sentimento",
      "Love Actually|7.6|love actually|love actually l'amore davvero",
      "Stranger than Fiction|7.6|stranger than fiction",
      "Saving Mr. Banks|7.5|saving mr banks|saving mr. banks",
      "Nanny McPhee|6.5|nanny mcphee|tata matilda"
    ] },
    { name: "Gary Oldman", type: "imdb", items: [
      "The Dark Knight|9|the dark knight|dark knight|il cavaliere oscuro",
      "Inception|8.8|inception",
      "Interstellar|8.7|interstellar",
      "The Prestige|8.5|the prestige|prestige",
      "Léon: The Professional|8.5|leon|the professional|leon the professional"
    ] },
    { name: "Michael Caine", type: "imdb", items: [
      "The Dark Knight|9|the dark knight|dark knight|il cavaliere oscuro",
      "Inception|8.8|inception",
      "Interstellar|8.7|interstellar",
      "The Prestige|8.5|the prestige|prestige",
      "Batman Begins|8.2|batman begins"
    ] },
    { name: "Beyoncé", type: "spotify", items: [
      "Halo|1.7|halo",
      "Crazy in Love|1.3|crazy in love",
      "Single Ladies (Put a Ring on It)|1|single ladies",
      "Break My Soul|0.7|break my soul",
      "Formation|0.6|formation"
    ] },
    { name: "Katy Perry", type: "spotify", items: [
      "Dark Horse|2|dark horse",
      "Roar|1.9|roar",
      "Firework|1.6|firework",
      "California Gurls|1.2|california gurls",
      "Teenage Dream|1|teenage dream"
    ] },
    { name: "Shakira", type: "spotify", items: [
      "Chantaje|1.8|chantaje",
      "Try Everything|1.5|try everything",
      "Hips Don't Lie|1.3|hips dont lie|hips don't lie",
      "Waka Waka (This Time for Africa)|1.2|waka waka",
      "La Bicicleta|0.9|la bicicleta"
    ] },
    { name: "Bad Bunny", type: "spotify", items: [
      "Dákiti|2|dakiti|dákiti",
      "Tití Me Preguntó|1.9|titi me pregunto",
      "Me Porto Bonito|1.8|me porto bonito",
      "Yonaguni|1.7|yonaguni",
      "Callaíta|1.5|callaita"
    ] },
    { name: "The Chainsmokers", type: "spotify", items: [
      "Closer|3|closer",
      "Don't Let Me Down|1.9|dont let me down|don't let me down",
      "Paris|1.4|paris",
      "Roses|1.2|roses",
      "All We Know|0.8|all we know"
    ] },
    { name: "Sia", type: "spotify", items: [
      "Cheap Thrills|1.9|cheap thrills",
      "Chandelier|1.8|chandelier",
      "Unstoppable|1.6|unstoppable",
      "Elastic Heart|1.3|elastic heart",
      "Snowman|1.2|snowman"
    ] },
    { name: "Sam Smith", type: "spotify", items: [
      "Unholy|1.9|unholy",
      "Stay With Me|1.8|stay with me",
      "Too Good at Goodbyes|1.3|too good at goodbyes",
      "I'm Not the Only One|1.2|im not the only one|i'm not the only one",
      "Dancing With a Stranger|1.1|dancing with a stranger"
    ] },
    { name: "Lady Gaga", type: "spotify", items: [
      "Shallow|2.2|shallow",
      "Bad Romance|1.5|bad romance",
      "Poker Face|1.4|poker face",
      "Rain on Me|1.1|rain on me",
      "Just Dance|1|just dance"
    ] },
    { name: "Selena Gomez", type: "spotify", items: [
      "Calm Down|2.3|calm down",
      "Wolves|1.3|wolves",
      "Lose You to Love Me|1.2|lose you to love me",
      "Same Old Love|0.9|same old love",
      "Bad Liar|0.8|bad liar"
    ] },
    { name: "Charlie Puth", type: "spotify", items: [
      "See You Again|2.8|see you again",
      "Attention|2|attention",
      "We Don't Talk Anymore|1.7|we dont talk anymore|we don't talk anymore",
      "One Call Away|1.1|one call away",
      "Light Switch|0.6|light switch"
    ] }
  ]
};
