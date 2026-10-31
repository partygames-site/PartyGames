/* ODD ONE OUT — English content.
   An international selection: Italy-specific questions are only in
   the Italian set. The question describes what 9 cards out of 10
   have in common: the odd one out is the only card that does NOT fit.
   Cards: "Name|value|info|emoji". t: "min" → the odd one has the
   lowest value · t: "max" → the highest. "y1996" = age from birth year.
   Logic questions: value 1 = fits, 0 = odd one out.
   Values are real figures or estimates as of around 2025. */

export default {
  locale: "en-US",
  ui: {
    modeLabel: "Question type",
    modes: { all: "🎲 All", numbers: "📊 Numbers", logic: "🧩 Logic" },
    typeNumbers: "📊 Numbers",
    typeLogic: "🧩 Logic",
    counter: "Question {n}",
    hint: "✅ 9 cards out of 10 fit the question · 💣 the only one that does NOT is the odd one out: avoid it!",
    turn: "🎯 {name}'s turn: pick a card",
    safeNext: "✅ Safe! Now it's {name}'s turn",
    forced: "😬 Only the odd one out is left… it's {name}'s turn!",
    found: "💥 {name} found the odd one out! +1 to {winners}",
    forcedFound: "💥 {name} is forced to take the odd one out! +1 to {winners}",
    skipped: "⏭ Question skipped: no points awarded",
    joiner: ", ",
    tap: "❔ tap to reveal",
    safe: "✓ SAFE",
    intruder: "💣 ODD ONE OUT",
    by: "picked by {name}",
    years: "{n} years",
    showAll: "👁 Show all cards",
    next: "➡ Next question",
    skip: "⏭ Skip question (no points)",
    end: "End game",
    resultTitle: "Final leaderboard",
    resultLine: "You played {n} questions.",
    restart: "New game"
  },
  questions: [
    { q: "Which fruit has MORE than 45 kcal per 100 g?", t: "min", icon: "🍌", unit: "kcal/100 g", items: [
      "Avocado|160||🥑", "Banana|89||🍌", "Pomegranate|83||🔴", "Fig|74||🟣", "Persimmon|70||🟠",
      "Grapes|69||🍇", "Cherries|63||🍒", "Mango|60||🥭", "Pineapple|50||🍍", "Watermelon|30||🍉"] },
    { q: "Which of these countries has FEWER than 50 million people?", t: "max", icon: "👥", unit: "million people", items: [
      "Iraq|46|about 46 million|🇮🇶", "Canada|41.5|about 41.5 million|🇨🇦", "Angola|37.9|about 38 million|🇦🇴", "Morocco|37.1|about 37 million|🇲🇦", "Uzbekistan|37|about 37 million|🇺🇿",
      "Poland|36.6|about 36.6 million|🇵🇱", "Malaysia|35.6|about 35.6 million|🇲🇾", "Saudi Arabia|35.3|about 35 million|🇸🇦", "Peru|34.4|about 34 million|🇵🇪", "Japan|123.4|about 123 million|🇯🇵"] },
    { q: "Which of these films runs LONGER than 2 hours 50 minutes?", t: "min", icon: "🎬", unit: "min", items: [
      "Killers of the Flower Moon|206||🤠", "The Godfather Part II|202||🎩", "The Return of the King|201||💍", "Titanic|194||🚢", "Avatar: The Way of Water|192||🌊",
      "Avengers: Endgame|181||🦸", "Oppenheimer|180||⚛️", "The Wolf of Wall Street|180||📈", "The Batman|176||🦇", "Jurassic Park|127||🦖"] },
    { q: "Which song has passed 2.5 billion streams on Spotify?", t: "min", icon: "🎧", unit: "billion streams", items: [
      "Blinding Lights|5|over 5 billion|🕶️", "Shape of You|4.3|over 4 billion|🎸", "Someone You Loved|3.9|almost 4 billion|🎹", "Sunflower|3.8|over 3.5 billion|🌻", "Starboy|3.5|over 3.5 billion|⭐",
      "As It Was|3.2|over 3 billion|🕺", "One Dance|3.4|over 3 billion|💃", "Stay (The Kid Laroi & Justin Bieber)|3.5|over 3 billion|🎙️", "Dance Monkey|3.3|over 3 billion|🐒", "Song 2|0.9|about 1 billion|🎸"] },
    { q: "Which of these stars was born BEFORE 2000?", t: "min", icon: "🎂", unit: "years", items: [
      "Margot Robbie|y1990|born in 1990|", "Jennifer Lawrence|y1990|born in 1990|", "Austin Butler|y1991|born in 1991|", "Timothée Chalamet|y1995|born in 1995|", "Zendaya|y1996|born in 1996|",
      "Tom Holland|y1996|born in 1996|", "Florence Pugh|y1996|born in 1996|", "Anya Taylor-Joy|y1996|born in 1996|", "Sydney Sweeney|y1997|born in 1997|", "Jenna Ortega|y2002|born in 2002|"] },
    { q: "Which TV series has AT LEAST 200 episodes?", t: "min", icon: "📺", unit: "episodes", items: [
      "Supernatural|327||", "Criminal Minds|324|over 320 episodes|", "The Big Bang Theory|279||", "Modern Family|250||", "Bones|246||",
      "Friends|236||", "Smallville|217||", "How I Met Your Mother|208||", "The Office|201|201 episodes (US version)|", "Breaking Bad|62||"] },
    { q: "Which Disney or Pixar animated film grossed MORE than $1 billion?", t: "min", icon: "🏰", unit: "$ million", items: [
      "Inside Out 2|1699|about $1.7 billion|", "Frozen II|1453|about $1.45 billion|", "Frozen|1290|about $1.29 billion|", "Incredibles 2|1243|about $1.24 billion|", "Toy Story 4|1073|about $1.07 billion|",
      "Toy Story 3|1067|about $1.07 billion|", "Moana 2|1059|about $1.06 billion|", "Finding Dory|1029|about $1.03 billion|", "Zootopia|1024|about $1.02 billion|", "Encanto|256|about $256 million|"] },
    { q: "Which video game has sold MORE than 50 million copies?", t: "min", icon: "🎮", unit: "million copies", items: [
      "Minecraft|300|over 300 million|", "GTA V|215|over 215 million|", "Wii Sports|83|about 83 million|", "Red Dead Redemption 2|75|over 70 million|", "PUBG|75|over 75 million|",
      "Mario Kart 8 Deluxe|70|over 70 million|", "Terraria|60|over 60 million|", "The Witcher 3|60|about 60 million|", "Super Mario Bros.|58|about 58 million|", "The Legend of Zelda: Ocarina of Time|7.6|about 7.6 million|"] },
    { q: "Which film won AT LEAST 5 Academy Awards?", t: "min", icon: "🏆", unit: "Oscars", items: [
      "Titanic|11||", "West Side Story (1961)|10||", "Schindler's List|7||", "Oppenheimer|7||", "Everything Everywhere All at Once|7||",
      "Forrest Gump|6||", "La La Land|6||", "Gladiator|5||", "The Silence of the Lambs|5||", "The Godfather|3||"] },
    { q: "Which fictional character is a billionaire according to Forbes?", t: "min", icon: "💰", unit: "$ billion", items: [
      "Scrooge McDuck|65.4||", "Smaug|54.1||", "Carlisle Cullen|46||", "Tony Stark|12.4||", "Charles Foster Kane|11.2||",
      "Richie Rich|10.3||", "Bruce Wayne|9.2||", "Christian Grey|2.5||", "Mr. Burns|1.5||", "Donald Duck|0|Broke (and in debt to his uncle)|🦆"] },
    { q: "Which capital city lies NORTH of the 55th parallel?", t: "min", icon: "🧭", unit: "° N", items: [
      "Nuuk|64.2|64.2° N (Greenland)|🇬🇱", "Reykjavík|64.1||🇮🇸", "Helsinki|60.2||🇫🇮", "Oslo|59.9||🇳🇴", "Tallinn|59.4||🇪🇪",
      "Stockholm|59.3||🇸🇪", "Riga|57||🇱🇻", "Moscow|55.8||🇷🇺", "Copenhagen|55.7||🇩🇰", "Ottawa|45.4|45.4° N: further south than Venice!|🇨🇦"] },
    { q: "Which country has an area of MORE than 1.5 million km²?", t: "min", icon: "🗺️", unit: "km²", items: [
      "Kazakhstan|2724900||🇰🇿", "Algeria|2381741||🇩🇿", "DR Congo|2344858||🇨🇩", "Saudi Arabia|2149690||🇸🇦", "Mexico|1964375||🇲🇽",
      "Indonesia|1904569||🇮🇩", "Sudan|1886068||🇸🇩", "Libya|1759540||🇱🇾", "Iran|1648195||🇮🇷", "Turkey|783562||🇹🇷"] },
    { q: "Which city gets MORE than 700 mm of rain a year?", t: "min", icon: "🌧️", unit: "mm/year", items: [
      "Bergen|2250||🇳🇴", "Genoa|1300||🇮🇹", "Glasgow|1250||🇬🇧", "Milan|1000||🇮🇹", "Manchester|870||🇬🇧",
      "Brussels|850||🇧🇪", "Amsterdam|840||🇳🇱", "Rome|800||🇮🇹", "Dublin|760||🇮🇪", "London|600|about 600 mm: less than Rome!|🇬🇧"] },
    { q: "Which animal has a bite stronger than 1,000 PSI?", t: "min", icon: "🦷", unit: "PSI", items: [
      "Saltwater crocodile|3700||🐊", "American alligator|2125||🐊", "Hippopotamus|1800||🦛", "Jaguar|1500||🐆", "Gorilla|1300||🦍",
      "Grizzly bear|1200||🐻", "Polar bear|1200||🐻‍❄️", "Hyena|1100||🐺", "Tiger|1050||🐅", "Lion|650|about 650 PSI: less than a tiger!|🦁"] },
    { q: "Which event happened BEFORE the year 1 AD?", t: "max", icon: "📜", unit: "", items: [
      "Building of the Great Pyramid|-2560|about 2560 BC|", "Code of Hammurabi|-1754|about 1754 BC|", "First Olympic Games|-776|776 BC|", "Founding of Rome|-753|753 BC|", "Battle of Marathon|-490|490 BC|",
      "Death of Alexander the Great|-323|323 BC|", "Battle of Cannae|-216|216 BC|", "Spartacus's revolt|-73|73 BC|", "Assassination of Julius Caesar|-44|44 BC|", "Eruption of Vesuvius at Pompeii|79|79 AD|"] },
    { q: "Which invention already existed BEFORE the year 1000?", t: "max", icon: "💡", unit: "", items: [
      "Pottery|-18000|about 18,000 BC|", "The wheel|-3500|about 3500 BC|", "Writing|-3200|about 3200 BC|", "Soap|-2800|about 2800 BC|", "Abacus|-2700|about 2700 BC|",
      "Glass|-2500|about 2500 BC|", "Coins|-600|about 600 BC|", "Paper|105|105 AD|", "Gunpowder|850|about 850 AD|", "Eyeglasses|1286|about 1286|"] },
    { q: "Which city was founded BEFORE the year 1 AD?", t: "max", icon: "🏛️", unit: "", items: [
      "Jericho|-9000|about 9000 BC|", "Carthage|-814|814 BC|", "Rome|-753|753 BC|", "Byzantium (Istanbul)|-667|667 BC|", "Marseille|-600|about 600 BC|",
      "Naples|-470|about 470 BC (Neapolis)|", "Alexandria|-331|331 BC|", "Florence|-59|59 BC|", "Lyon|-43|43 BC|", "Venice|421|421 AD (by tradition)|"] },
    { q: "Which athlete has won AT LEAST 7 Olympic gold medals?", t: "min", icon: "🥇", unit: "golds", items: [
      "Michael Phelps|23||", "Larisa Latynina|9||", "Paavo Nurmi|9||", "Carl Lewis|9||", "Mark Spitz|9||",
      "Katie Ledecky|9||", "Usain Bolt|8||", "Birgit Fischer|8||", "Simone Biles|7||", "Federica Pellegrini|1|1 gold (Beijing 2008)|🏊‍♀️"] },
    { q: "Which social platform has MORE than 500 million monthly active users?", t: "min", icon: "📱", unit: "billion users", items: [
      "Facebook|3|about 3 billion|", "WhatsApp|3|about 3 billion|💬", "YouTube|2.5|about 2.5 billion|", "Instagram|2|about 2 billion|", "TikTok|1.6|about 1.6 billion|",
      "WeChat|1.4|about 1.4 billion|💬", "Telegram|1|about 1 billion|", "Snapchat|0.9|over 900 million|", "Pinterest|0.57|about 570 million|", "Twitch|0.24|about 240 million|🟣"] },
    { q: "Which language has MORE than 70 million native speakers?", t: "min", icon: "🗣️", unit: "million", items: [
      "Russian|148||", "Japanese|123||", "Vietnamese|86||", "Turkish|84||", "Telugu|83||",
      "Marathi|83||", "Korean|81||", "Tamil|79||", "German|76||", "Italian|64|about 64 million|"] },
    { q: "Which mountain is taller than 4,000 metres?", t: "min", icon: "🏔️", unit: "m", items: [
      "Kilimanjaro|5895||", "Elbrus|5642||", "Mount Ararat|5137||", "Mont Blanc|4806||", "Monte Rosa|4634||",
      "Matterhorn|4478||", "Mount Rainier|4392||", "Jungfrau|4158||", "Gran Paradiso|4061||", "Mount Fuji|3776||"] },
    { q: "Which animal can run faster than 65 km/h?", t: "min", icon: "⚡", unit: "km/h", items: [
      "Cheetah|110||🐆", "Sailfish|110||🐟", "Horse|88||🐎", "Pronghorn|88||🦌", "Wildebeest|80||🐃",
      "Lion|80||🦁", "Mako shark|74||🦈", "Greyhound|72||🐕", "Hare|72||🐇", "Human (Usain Bolt)|44.7|44.7 km/h at peak|🏃"] },
    { q: "Which celestial body has a diameter of more than 3,000 km?", t: "min", icon: "🪐", unit: "km diameter", items: [
      "Venus|12104||🟠", "Mars|6779||🔴", "Ganymede|5268||🌑", "Titan|5150||🟤", "Mercury|4879||⚫",
      "Callisto|4821||🌑", "Io|3643||🟡", "The Moon|3474||🌕", "Europa|3122||⚪", "Pluto|2377||⚪"] },
    { q: "Which building is taller than 400 metres?", t: "min", icon: "🏢", unit: "m", items: [
      "Lotte World Tower|555||", "One World Trade Center|541||", "Taipei 101|508||", "Shanghai World Financial Center|492||", "International Commerce Centre|484||",
      "Petronas Towers|452||", "Empire State Building|443||", "Willis Tower|442||", "Jin Mao Tower|421||", "Eiffel Tower|330||"] },
    { q: "Which footballer has won AT LEAST 2 Ballon d'Or awards?", t: "min", icon: "⚽", unit: "Ballon d'Or", items: [
      "Lionel Messi|8||", "Cristiano Ronaldo|5||", "Michel Platini|3||", "Johan Cruyff|3||", "Marco van Basten|3||",
      "Ronaldo (R9)|2||", "Franz Beckenbauer|2||", "Alfredo Di Stéfano|2||", "Kevin Keegan|2||", "Diego Maradona|0|Never: until 1994 it was for European players only|"] },
    { q: "Which artist has won AT LEAST 20 Grammy Awards?", t: "min", icon: "🎤", unit: "Grammys", items: [
      "Beyoncé|35||", "Georg Solti|31||", "Quincy Jones|28||", "Alison Krauss|27||", "Jay-Z|25||",
      "Stevie Wonder|25||", "Kanye West|24||", "U2|22||", "Bruce Springsteen|20||", "Madonna|7||"] },
    { q: "Which animal can live MORE than 70 years?", t: "min", icon: "⏳", unit: "years", items: [
      "Greenland shark|400|up to about 400 years|🦈", "Bowhead whale|211|over 200 years|🐋", "Giant tortoise|190|record: 190 years (Jonathan)|🐢", "Sturgeon|152|up to about 150 years|🐟", "Human|122|record: 122 years|🧓",
      "Orca|100|females up to about 100 years|🐋", "Elephant|86|record: about 86 years|🐘", "Cockatoo|83|record: 83 years (Cookie)|🦜", "Macaw|80|up to about 80 years|🦜", "Cat|38|record: 38 years|🐈"] },
    { q: "Which country has MORE than 140 million people?", t: "min", icon: "👥", unit: "million", items: [
      "India|1440|about 1.44 billion|🇮🇳", "China|1410|about 1.41 billion|🇨🇳", "United States|340|about 340 million|🇺🇸", "Indonesia|280|about 280 million|🇮🇩", "Pakistan|245|about 245 million|🇵🇰",
      "Nigeria|225|about 225 million|🇳🇬", "Brazil|216|about 216 million|🇧🇷", "Bangladesh|173|about 173 million|🇧🇩", "Russia|144|about 144 million|🇷🇺", "Germany|84|about 84 million|🇩🇪"] },
    { q: "Which song is LONGER than 6 minutes (studio version)?", t: "min", icon: "⏱️", unit: "s", items: [
      "Free Bird|548|9:08|🦅", "November Rain|537|8:57|🌧️", "Stairway to Heaven|482|8:02|🪜", "Hey Jude|431|7:11|🎸", "Light My Fire|426|7:06|🔥",
      "Hotel California|390|6:30|🏨", "Paranoid Android|387|6:27|🤖", "Comfortably Numb|382|6:22|🧱", "Like a Rolling Stone|373|6:13|🪨", "Bohemian Rhapsody|355|5:55: just 5 seconds short!|👑"] },
    { q: "Which animal weighs MORE than 500 kg as an adult?", t: "min", icon: "⚖️", unit: "kg", items: [
      "African elephant|6000|up to 6 tonnes|🐘", "White rhino|2300||🦏", "Hippopotamus|1500||🦛", "Giraffe|1200||🦒", "Walrus|1200||🦭",
      "Great white shark|1100||🦈", "Gaur|1000||🐂", "Saltwater crocodile|1000|males over 1,000 kg|🐊", "American bison|900||🦬", "Gorilla|180|males about 180-200 kg|🦍"] },
    { q: "Which monument was completed BEFORE 1700?", t: "max", icon: "🏰", unit: "", items: [
      "Colosseum|80|80 AD|", "Pantheon|125|about 125 AD|", "Notre-Dame de Paris|1345|1345|", "Leaning Tower of Pisa|1372|1372|", "Alhambra|1390|Nasrid palaces, 14th century|",
      "Brunelleschi's Dome|1436|1436|", "Machu Picchu|1450|about 1450|", "St. Peter's Basilica|1626|1626|", "Taj Mahal|1653|1653|", "Trevi Fountain|1762|1762|"] },
    { q: "Which cartoon character debuted BEFORE 1970?", t: "max", icon: "📺", unit: "", items: [
      "Mickey Mouse|1928|1928|", "Popeye|1929|1929|", "Betty Boop|1930|1930|", "Donald Duck|1934|1934|", "Bugs Bunny|1940|1940|",
      "Tom (Tom & Jerry)|1940|1940|", "Snoopy|1950|1950|", "Fred Flintstone|1960|1960|", "The Pink Panther|1963|1963|", "Garfield|1978|1978|"] },
    { q: "Which film grossed MORE than $1.5 billion worldwide?", t: "min", icon: "🎟️", unit: "$ billion", items: [
      "Avatar|2.92|about $2.92 billion|", "Avengers: Endgame|2.8|about $2.8 billion|", "Avatar: The Way of Water|2.32|about $2.32 billion|", "Titanic|2.26|about $2.26 billion|", "Star Wars: The Force Awakens|2.07|about $2.07 billion|",
      "Avengers: Infinity War|2.05|about $2.05 billion|", "Jurassic World|1.67|about $1.67 billion|", "The Lion King (2019)|1.66|about $1.66 billion|", "The Avengers|1.52|about $1.52 billion|", "The Dark Knight|1.0|about $1 billion|"] },
    { q: "Which tennis player has won AT LEAST 10 Grand Slam singles titles?", t: "min", icon: "🎾", unit: "Slams", items: [
      "Novak Djokovic|24||", "Serena Williams|23||", "Rafael Nadal|22||", "Steffi Graf|22||", "Roger Federer|20||",
      "Martina Navratilova|18||", "Chris Evert|18||", "Pete Sampras|14||", "Björn Borg|11||", "Andre Agassi|8||"] },
    { q: "Which driver has won AT LEAST 3 Formula 1 World Championships?", t: "min", icon: "🏎️", unit: "titles", items: [
      "Lewis Hamilton|7||", "Michael Schumacher|7||", "Juan Manuel Fangio|5||", "Alain Prost|4||", "Sebastian Vettel|4||",
      "Max Verstappen|4||", "Ayrton Senna|3||", "Niki Lauda|3||", "Jackie Stewart|3||", "Fernando Alonso|2||"] },
    { q: "Which console has sold MORE than 80 million units?", t: "min", icon: "🕹️", unit: "million units", items: [
      "PlayStation 2|160|over 160 million|", "Nintendo DS|154|about 154 million|", "Nintendo Switch|150|over 150 million|", "Game Boy|119|about 119 million|", "PlayStation 4|117|over 117 million|",
      "PlayStation|102|about 102 million|", "Wii|101|about 101 million|", "Xbox 360|84|about 84 million|", "Game Boy Advance|81.5|about 81.5 million|", "Nintendo 64|33|about 33 million|"] },
    { q: "Which of these actors has won an Oscar?", t: "min", icon: "🎭", unit: "", items: [
      "Leonardo DiCaprio|1|1 Oscar · The Revenant (2016)|", "Tom Hanks|1|2 Oscars|", "Meryl Streep|1|3 Oscars|", "Anthony Hopkins|1|2 Oscars|", "Denzel Washington|1|2 Oscars|",
      "Cate Blanchett|1|2 Oscars|", "Emma Stone|1|2 Oscars|", "Jack Nicholson|1|3 Oscars|", "Natalie Portman|1|1 Oscar · Black Swan|", "Johnny Depp|0|0 Oscars (3 nominations)|"] },
    { q: "Which of these countries is in the European Union?", t: "min", icon: "🇪🇺", unit: "", items: [
      "Italy|1|Member since 1957 (founder)|🇮🇹", "France|1|Member since 1957 (founder)|🇫🇷", "Germany|1|Member since 1957 (founder)|🇩🇪", "Greece|1|Member since 1981|🇬🇷", "Spain|1|Member since 1986|🇪🇸",
      "Portugal|1|Member since 1986|🇵🇹", "Austria|1|Member since 1995|🇦🇹", "Sweden|1|Member since 1995|🇸🇪", "Croatia|1|Member since 2013|🇭🇷", "Norway|0|Not a member (EEA only)|🇳🇴"] },
    { q: "Which of these animals is a mammal?", t: "min", icon: "🐾", unit: "", items: [
      "Dolphin|1|Mammal (cetacean)|🐬", "Whale|1|Mammal (cetacean)|🐋", "Orca|1|Mammal (cetacean)|🐋", "Bat|1|Mammal (chiropteran)|🦇", "Manatee|1|Mammal (sirenian)|🦭",
      "Seal|1|Mammal (pinniped)|🦭", "Walrus|1|Mammal (pinniped)|🦭", "Platypus|1|Mammal (monotreme, lays eggs)|🦫", "Narwhal|1|Mammal (cetacean)|🐋", "Shark|0|Cartilaginous fish|🦈"] },
    { q: "Which of these elements is a gas at room temperature?", t: "min", icon: "⚗️", unit: "", items: [
      "Helium|1|Noble gas|", "Neon|1|Noble gas|", "Argon|1|Noble gas|", "Krypton|1|Noble gas|", "Xenon|1|Noble gas|",
      "Radon|1|Noble gas|", "Hydrogen|1|Gas|", "Oxygen|1|Gas|", "Nitrogen|1|Gas|", "Bromine|0|Liquid at 20 °C|"] },
    { q: "Which of these brands was founded in the United States?", t: "min", icon: "🏷️", unit: "", items: [
      "Apple|1|USA · Cupertino, 1976|", "Nike|1|USA · Oregon, 1964|", "Coca-Cola|1|USA · Atlanta, 1886|", "McDonald's|1|USA · California, 1940|", "Google|1|USA · California, 1998|",
      "Amazon|1|USA · Seattle, 1994|", "Microsoft|1|USA · Albuquerque, 1975|", "Starbucks|1|USA · Seattle, 1971|", "Levi's|1|USA · San Francisco, 1853|", "Adidas|0|Germany · Herzogenaurach, 1949|"] },
    { q: "Which of these is a moon?", t: "min", icon: "🌙", unit: "", items: [
      "The Moon|1|Earth's satellite|", "Titan|1|Moon of Saturn|", "Europa|1|Moon of Jupiter|", "Io|1|Moon of Jupiter|", "Ganymede|1|Moon of Jupiter|",
      "Callisto|1|Moon of Jupiter|", "Phobos|1|Moon of Mars|", "Deimos|1|Moon of Mars|", "Triton|1|Moon of Neptune|", "Ceres|0|Dwarf planet (asteroid belt)|"] },
    { q: "Which character has appeared in a Marvel (MCU) film?", t: "min", icon: "🦹", unit: "", items: [
      "Iron Man|1|Debut: Iron Man (2008)|", "Hulk|1|Debut: The Incredible Hulk (2008)|", "Black Widow|1|Debut: Iron Man 2 (2010)|", "Thor|1|Debut: Thor (2011)|", "Star-Lord|1|Debut: Guardians of the Galaxy (2014)|",
      "Scarlet Witch|1|Debut: Captain America: The Winter Soldier (2014)|", "Black Panther|1|Debut: Captain America: Civil War (2016)|", "Spider-Man|1|MCU debut: Captain America: Civil War (2016)|", "Doctor Strange|1|Debut: Doctor Strange (2016)|", "Hellboy|0|Dark Horse Comics: never in the MCU|"] },
    { q: "Which of these cities is a capital?", t: "min", icon: "🏛️", unit: "", items: [
      "Paris|1|Capital of France|🇫🇷", "Madrid|1|Capital of Spain|🇪🇸", "Lisbon|1|Capital of Portugal|🇵🇹", "Vienna|1|Capital of Austria|🇦🇹", "Prague|1|Capital of the Czech Republic|🇨🇿",
      "Warsaw|1|Capital of Poland|🇵🇱", "Athens|1|Capital of Greece|🇬🇷", "Dublin|1|Capital of Ireland|🇮🇪", "Budapest|1|Capital of Hungary|🇭🇺", "Istanbul|0|Not the capital: Turkey's capital is Ankara|🇹🇷"] },
    { q: "Which of these works is by Leonardo da Vinci?", t: "min", icon: "🎨", unit: "", items: [
      "Mona Lisa|1|Leonardo da Vinci|", "The Last Supper|1|Leonardo da Vinci|", "Lady with an Ermine|1|Leonardo da Vinci|", "Annunciation|1|Leonardo da Vinci|", "Virgin of the Rocks|1|Leonardo da Vinci|",
      "Vitruvian Man|1|Leonardo da Vinci|", "Saint Jerome in the Wilderness|1|Leonardo da Vinci|", "Ginevra de' Benci|1|Leonardo da Vinci|", "The Baptism of Christ|1|Verrocchio and Leonardo|", "The Birth of Venus|0|Sandro Botticelli|"] },
    { q: "Which of these films is by Christopher Nolan?", t: "min", icon: "🌀", unit: "", items: [
      "Inception|1|Christopher Nolan (2010)|", "Interstellar|1|Christopher Nolan (2014)|", "Memento|1|Christopher Nolan (2000)|", "Tenet|1|Christopher Nolan (2020)|", "Dunkirk|1|Christopher Nolan (2017)|",
      "Oppenheimer|1|Christopher Nolan (2023)|", "The Prestige|1|Christopher Nolan (2006)|", "Insomnia|1|Christopher Nolan (2002)|", "Batman Begins|1|Christopher Nolan (2005)|", "Arrival|0|Denis Villeneuve (2016)|"] },
    { q: "Which of these songs is by Queen?", t: "min", icon: "👑", unit: "", items: [
      "Bohemian Rhapsody|1|Queen (1975)|", "We Will Rock You|1|Queen (1977)|", "We Are the Champions|1|Queen (1977)|", "Don't Stop Me Now|1|Queen (1978)|", "Another One Bites the Dust|1|Queen (1980)|",
      "Somebody to Love|1|Queen (1976)|", "Radio Ga Ga|1|Queen (1984)|", "I Want to Break Free|1|Queen (1984)|", "Under Pressure|1|Queen and David Bowie (1981)|", "Stairway to Heaven|0|Led Zeppelin (1971)|"] },
    { q: "Which character appears in Harry Potter?", t: "min", icon: "⚡", unit: "", items: [
      "Hermione Granger|1|Harry Potter|", "Ron Weasley|1|Harry Potter|", "Albus Dumbledore|1|Harry Potter|", "Severus Snape|1|Harry Potter|", "Rubeus Hagrid|1|Harry Potter|",
      "Lord Voldemort|1|Harry Potter|", "Draco Malfoy|1|Harry Potter|", "Luna Lovegood|1|Harry Potter|", "Sirius Black|1|Harry Potter|", "Gandalf|0|The Lord of the Rings|"] },
    { q: "Which of these is a classic Disney animated film?", t: "min", icon: "🏰", unit: "", items: [
      "The Lion King|1|Disney (1994)|", "The Little Mermaid|1|Disney (1989)|", "Aladdin|1|Disney (1992)|", "Beauty and the Beast|1|Disney (1991)|", "Frozen|1|Disney (2013)|",
      "Mulan|1|Disney (1998)|", "Pocahontas|1|Disney (1995)|", "Hercules|1|Disney (1997)|", "Tangled|1|Disney (2010)|", "Shrek|0|DreamWorks (2001)|"] },
    { q: "Which of these footballers has won a World Cup?", t: "min", icon: "🏆", unit: "", items: [
      "Lionel Messi|1|World champion 2022|", "Pelé|1|World champion 1958, 1962, 1970|", "Diego Maradona|1|World champion 1986|", "Zinedine Zidane|1|World champion 1998|", "Gianluigi Buffon|1|World champion 2006|",
      "Fabio Cannavaro|1|World champion 2006|", "Ronaldo (R9)|1|World champion 1994, 2002|", "Kylian Mbappé|1|World champion 2018|", "Andrés Iniesta|1|World champion 2010|", "Cristiano Ronaldo|0|Never won a World Cup|"] },
    { q: "Which of these is a Pixar film?", t: "min", icon: "💡", unit: "", items: [
      "Toy Story|1|Pixar (1995)|", "Up|1|Pixar (2009)|", "Coco|1|Pixar (2017)|", "Inside Out|1|Pixar (2015)|", "Ratatouille|1|Pixar (2007)|",
      "WALL•E|1|Pixar (2008)|", "Finding Nemo|1|Pixar (2003)|", "Monsters, Inc.|1|Pixar (2001)|", "The Incredibles|1|Pixar (2004)|", "Despicable Me|0|Illumination (2010)|"] },
    { q: "Which of these songs is by the Beatles?", t: "min", icon: "🎸", unit: "", items: [
      "Hey Jude|1|The Beatles (1968)|", "Yesterday|1|The Beatles (1965)|", "Let It Be|1|The Beatles (1970)|", "Help!|1|The Beatles (1965)|", "Yellow Submarine|1|The Beatles (1966)|",
      "Come Together|1|The Beatles (1969)|", "Something|1|The Beatles (1969)|", "Penny Lane|1|The Beatles (1967)|", "Here Comes the Sun|1|The Beatles (1969)|", "Imagine|0|John Lennon solo (1971)|"] },
    { q: "Which of these characters is from The Simpsons?", t: "min", icon: "🍩", unit: "", items: [
      "Homer Simpson|1|The Simpsons|", "Marge Simpson|1|The Simpsons|", "Bart Simpson|1|The Simpsons|", "Lisa Simpson|1|The Simpsons|", "Maggie Simpson|1|The Simpsons|",
      "Montgomery Burns|1|The Simpsons|", "Ned Flanders|1|The Simpsons|", "Moe Szyslak|1|The Simpsons|", "Krusty the Clown|1|The Simpsons|", "Stewie Griffin|0|Family Guy|"] },
    { q: "Which of these Pokémon is from the first generation?", t: "min", icon: "⚡", unit: "", items: [
      "Pikachu|1|Generation 1 (#025)|", "Charmander|1|Generation 1 (#004)|", "Bulbasaur|1|Generation 1 (#001)|", "Squirtle|1|Generation 1 (#007)|", "Mewtwo|1|Generation 1 (#150)|",
      "Snorlax|1|Generation 1 (#143)|", "Jigglypuff|1|Generation 1 (#039)|", "Gengar|1|Generation 1 (#094)|", "Eevee|1|Generation 1 (#133)|", "Lucario|0|Generation 4 (#448)|"] },
    { q: "Which of these superheroes is from Marvel?", t: "min", icon: "🦸", unit: "", items: [
      "Iron Man|1|Marvel|", "Spider-Man|1|Marvel|", "Thor|1|Marvel|", "Hulk|1|Marvel|", "Captain America|1|Marvel|",
      "Wolverine|1|Marvel|", "Black Panther|1|Marvel|", "Doctor Strange|1|Marvel|", "Deadpool|1|Marvel|", "The Flash|0|DC Comics|"] },
    { q: "Which of these animals is a feline?", t: "min", icon: "🐾", unit: "", items: [
      "Lion|1|Feline|🦁", "Tiger|1|Feline|🐅", "Cheetah|1|Feline|🐆", "Leopard|1|Feline|🐆", "Jaguar|1|Feline|🐆",
      "Lynx|1|Feline|🐈", "Puma|1|Feline|🐈", "House cat|1|Feline|🐈", "Ocelot|1|Feline|🐈", "Hyena|0|Hyaenid (closer to mongooses than to cats)|🐺"] },
    { q: "Which of these films won the Oscar for Best Picture?", t: "min", icon: "🎬", unit: "", items: [
      "The Godfather|1|Best Picture 1973|", "Titanic|1|Best Picture 1998|", "Forrest Gump|1|Best Picture 1995|", "Gladiator|1|Best Picture 2001|", "Oppenheimer|1|Best Picture 2024|",
      "Schindler's List|1|Best Picture 1994|", "Parasite|1|Best Picture 2020|", "The Silence of the Lambs|1|Best Picture 1992|", "The Shape of Water|1|Best Picture 2018|", "Pulp Fiction|0|Only nominated (Forrest Gump won)|"] },
    { q: "Which of these bands is from England?", t: "min", icon: "🎤", unit: "", items: [
      "The Beatles|1|Liverpool, England|", "The Rolling Stones|1|London, England|", "Queen|1|London, England|", "Coldplay|1|London, England|", "Oasis|1|Manchester, England|",
      "Pink Floyd|1|London, England|", "Radiohead|1|Abingdon, England|", "Arctic Monkeys|1|Sheffield, England|", "Led Zeppelin|1|London, England|", "U2|0|Dublin, Ireland|"] },
    { q: "Which of these actors has played Batman or the Joker on film?", t: "min", icon: "🦇", unit: "", items: [
      "Michael Keaton|1|Batman (1989)|", "Christian Bale|1|Batman Begins (2005)|", "Ben Affleck|1|Batman v Superman (2016)|", "Robert Pattinson|1|The Batman (2022)|", "George Clooney|1|Batman & Robin (1997)|",
      "Val Kilmer|1|Batman Forever (1995)|", "Jack Nicholson|1|The Joker in Batman (1989)|", "Heath Ledger|1|The Joker in The Dark Knight (2008)|", "Joaquin Phoenix|1|Joker (2019)|", "Christopher Reeve|0|Neither: he played Superman|"] },
    { q: "Which of these animals lays eggs?", t: "min", icon: "🥚", unit: "", items: [
      "Platypus|1|Lays eggs (monotreme mammal)|", "Echidna|1|Lays eggs (monotreme mammal)|", "Turtle|1|Lays eggs|🐢", "Crocodile|1|Lays eggs|🐊", "Hen|1|Lays eggs|🐔",
      "Penguin|1|Lays eggs|🐧", "Frog|1|Lays eggs|🐸", "Octopus|1|Lays eggs|🐙", "Butterfly|1|Lays eggs|🦋", "Dolphin|0|Gives birth to live young|🐬"] },
    { q: "Which of these countries drives on the left?", t: "min", icon: "🚗", unit: "", items: [
      "United Kingdom|1|Drives on the left|🇬🇧", "Japan|1|Drives on the left|🇯🇵", "Australia|1|Drives on the left|🇦🇺", "India|1|Drives on the left|🇮🇳", "Jamaica|1|Drives on the left|🇯🇲",
      "Ireland|1|Drives on the left|🇮🇪", "New Zealand|1|Drives on the left|🇳🇿", "Malta|1|Drives on the left|🇲🇹", "Thailand|1|Drives on the left|🇹🇭", "Sweden|0|Drives on the right since 1967 (on the left before!)|🇸🇪"] },
    { q: "Which of these is a fruit (botanically speaking)?", t: "min", icon: "🍅", unit: "", items: [
      "Tomato|1|A berry: it's a fruit|🍅", "Courgette|1|A fruit (pepo)|🥒", "Aubergine|1|A berry: it's a fruit|🍆", "Pepper|1|A berry: it's a fruit|🫑", "Cucumber|1|A fruit (pepo)|🥒",
      "Avocado|1|A berry with one big seed|🥑", "Olive|1|A drupe: it's a fruit|🫒", "Pumpkin|1|A fruit (pepo)|🎃", "Green bean|1|A pod: it's a fruit|🫛", "Asparagus|0|A shoot, not a fruit|🌱"] },
    { q: "Which of these animals is an insect?", t: "min", icon: "🐞", unit: "", items: [
      "Ant|1|Insect (6 legs)|🐜", "Bee|1|Insect (6 legs)|🐝", "Butterfly|1|Insect (6 legs)|🦋", "Ladybird|1|Insect (6 legs)|🐞", "Dragonfly|1|Insect (6 legs)|🪰",
      "Mosquito|1|Insect (6 legs)|🦟", "Grasshopper|1|Insect (6 legs)|🦗", "Cockroach|1|Insect (6 legs)|🪳", "Praying mantis|1|Insect (6 legs)|🦗", "Spider|0|Arachnid: 8 legs|🕷️"] },
    { q: "Which of these superheroes has superpowers?", t: "min", icon: "🦸", unit: "", items: [
      "Superman|1|Strength, flight, heat vision|🦸", "Spider-Man|1|Spider powers|🕷️", "Hulk|1|Superhuman strength|💚", "Thor|1|God of thunder|🔨", "Wolverine|1|Healing factor|🐺",
      "The Flash|1|Super speed|⚡", "Wonder Woman|1|Amazon demigoddess|🛡️", "Scarlet Witch|1|Chaos magic|🔮", "Aquaman|1|Breathes underwater, talks to fish|🔱", "Batman|0|No superpowers: just training and gadgets|🦇"] },
    { q: "Which of these prehistoric animals is a dinosaur?", t: "min", icon: "🦕", unit: "", items: [
      "Tyrannosaurus rex|1|Dinosaur (theropod)|🦖", "Triceratops|1|Dinosaur (ceratopsian)|🦕", "Velociraptor|1|Dinosaur (theropod)|🦖", "Stegosaurus|1|Dinosaur (thyreophoran)|🦕", "Brachiosaurus|1|Dinosaur (sauropod)|🦕",
      "Diplodocus|1|Dinosaur (sauropod)|🦕", "Spinosaurus|1|Dinosaur (theropod)|🦖", "Ankylosaurus|1|Dinosaur (thyreophoran)|🦕", "Iguanodon|1|Dinosaur (ornithopod)|🦕", "Pterodactyl|0|Pterosaur: a flying reptile, not a dinosaur|🪽"] },
    { q: "Which of these cities has hosted the SUMMER Olympics?", t: "min", icon: "🏟️", unit: "", items: [
      "Rome|1|1960|🇮🇹", "Athens|1|1896 and 2004|🇬🇷", "Paris|1|1900, 1924 and 2024|🇫🇷", "London|1|1908, 1948 and 2012|🇬🇧", "Los Angeles|1|1932 and 1984|🇺🇸",
      "Barcelona|1|1992|🇪🇸", "Sydney|1|2000|🇦🇺", "Beijing|1|2008|🇨🇳", "Tokyo|1|1964 and 2021|🇯🇵", "Turin|0|Winter Olympics only (2006)|🇮🇹"] },
    { q: "Which of these foods originally comes from the Americas?", t: "min", icon: "🌎", unit: "", items: [
      "Tomato|1|From the Americas|🍅", "Potato|1|From the Andes|🥔", "Corn|1|From Mexico|🌽", "Cocoa|1|From Central and South America|🍫", "Chilli pepper|1|From the Americas|🌶️",
      "Turkey|1|From North America|🦃", "Peanut|1|From South America|🥜", "Vanilla|1|From Mexico|🌼", "Pumpkin|1|From the Americas|🎃", "Aubergine|0|From Asia (India)|🍆"] },
    { q: "Which of these numbers is prime?", t: "min", icon: "🔢", unit: "", items: [
      "17|1|Prime|🔢", "29|1|Prime|🔢", "37|1|Prime|🔢", "41|1|Prime|🔢", "53|1|Prime|🔢",
      "61|1|Prime|🔢", "73|1|Prime|🔢", "83|1|Prime|🔢", "97|1|Prime|🔢", "91|0|Not prime: 7 × 13|🔢"] },
    { q: "Which of these countries is crossed by the Equator?", t: "min", icon: "🌐", unit: "", items: [
      "Ecuador|1|Crossed by the Equator|🇪🇨", "Colombia|1|Crossed by the Equator|🇨🇴", "Brazil|1|Crossed by the Equator|🇧🇷", "Gabon|1|Crossed by the Equator|🇬🇦", "DR Congo|1|Crossed by the Equator|🇨🇩",
      "Uganda|1|Crossed by the Equator|🇺🇬", "Kenya|1|Crossed by the Equator|🇰🇪", "Somalia|1|Crossed by the Equator|🇸🇴", "Indonesia|1|Crossed by the Equator|🇮🇩", "Peru|0|Entirely south of the Equator (only just)|🇵🇪"] },
    { q: "Which of these countries has Spanish as an official language?", t: "min", icon: "🗣️", unit: "", items: [
      "Mexico|1|Spanish|🇲🇽", "Colombia|1|Spanish|🇨🇴", "Argentina|1|Spanish|🇦🇷", "Chile|1|Spanish|🇨🇱", "Peru|1|Spanish (with Quechua and Aymara)|🇵🇪",
      "Cuba|1|Spanish|🇨🇺", "Venezuela|1|Spanish|🇻🇪", "Uruguay|1|Spanish|🇺🇾", "Equatorial Guinea|1|Spanish (with French and Portuguese)|🇬🇶", "Belize|0|English|🇧🇿"] }
  ]
};
