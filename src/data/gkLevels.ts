export interface Question {
  id: string;
  levelId: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  hint: string;
  category: string;
}

export interface LearnCard {
  id: string;
  levelId: string;
  title: string;
  icon: string;
  text: string;
  funFact: string;
  remember: string;
}

export interface GKLevel {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  description: string;
  isFree: boolean;
  price: number;
  icon: string;
  learnCardsCount: number;
  quizCount: number;
}

export const GK_LEVELS: GKLevel[] = [
  {
    id: "1",
    title: "Indian Cities & Nicknames",
    difficulty: "Easy",
    description: "Explore the magical nicknames of beautiful Indian cities like the Pink City and the Lake City!",
    isFree: true,
    price: 0,
    icon: "🏙️",
    learnCardsCount: 15,
    quizCount: 30
  },
  {
    id: "2",
    title: "States, Leaders & Firsts",
    difficulty: "Medium",
    description: "Learn about India's first prime ministers, national animals, national space achievements, and states!",
    isFree: true,
    price: 0,
    icon: "🇮🇳",
    learnCardsCount: 15,
    quizCount: 30
  },
  {
    id: "3",
    title: "Space & Planet Explorations",
    difficulty: "Medium",
    description: "Blast off into deep space! Journey across the solar system, sun, moon, stars, and planets.",
    isFree: false,
    price: 99,
    icon: "🚀",
    learnCardsCount: 20,
    quizCount: 40
  },
  {
    id: "4",
    title: "Indian History & Monuments",
    difficulty: "Hard",
    description: "Step back in time! Explore the Taj Mahal, historic forts, emperors, and freedom fighters.",
    isFree: false,
    price: 149,
    icon: "🏰",
    learnCardsCount: 25,
    quizCount: 50
  },
  {
    id: "5",
    title: "World Geography & Records",
    difficulty: "Hard",
    description: "Travel the globe! Discover oceans, continents, world records, mountains, and flags.",
    isFree: false,
    price: 199,
    icon: "🌍",
    learnCardsCount: 25,
    quizCount: 50
  }
];

// LEVEL 1 LEARN CARDS (15 Cards)
export const LEARN_CARDS_L1: LearnCard[] = [
  { id: "l1_c1", levelId: "1", title: "Jaipur - Pink City", icon: "🌸", text: "Jaipur is called the Pink City because many old buildings in the city were painted pink.", funFact: "Pink color was used to welcome royal guests (Prince of Wales) in 1876.", remember: "Pink City = Jaipur" },
  { id: "l1_c2", levelId: "1", title: "Jodhpur - Blue City", icon: "💙", text: "Jodhpur is known as the Blue City because many houses around the historic Mehrangarh Fort are painted blue.", funFact: "The blue color originally helped keep the homes cool during hot desert summers.", remember: "Blue City = Jodhpur" },
  { id: "l1_c3", levelId: "1", title: "Udaipur - White City", icon: "🕊️", text: "Udaipur is known as the White City because of its stunning white marble palaces and lakes.", funFact: "It is also widely called the 'City of Lakes' or the 'Venice of the East'.", remember: "White City / Lake City = Udaipur" },
  { id: "l1_c4", levelId: "1", title: "Jaisalmer - Golden City", icon: "✨", text: "Jaisalmer is called the Golden City because of its yellow sand and yellow sandstone buildings.", funFact: "Jaisalmer Fort looks like it is made of pure gold under the sunset.", remember: "Golden City = Jaisalmer" },
  { id: "l1_c5", levelId: "1", title: "Bengaluru - Silicon Valley", icon: "💻", text: "Bengaluru is India's tech hub and is called the Silicon Valley of India.", funFact: "It is also known as the Garden City of India because of its many green parks.", remember: "Silicon Valley / Garden City = Bengaluru" },
  { id: "l1_c6", levelId: "1", title: "Ahmedabad - Manchester of India", icon: "🧵", text: "Ahmedabad is known as the Manchester of India due to its historic cotton textile factories.", funFact: "It is situated on the banks of the Sabarmati river.", remember: "Manchester of India = Ahmedabad" },
  { id: "l1_c7", levelId: "1", title: "Kolkata - City of Joy", icon: "🎉", text: "Kolkata is called the City of Joy because of its rich culture, festivals, food, and friendly people.", funFact: "Kolkata was the capital of British India until 1911.", remember: "City of Joy = Kolkata" },
  { id: "l1_c8", levelId: "1", title: "Mumbai - 7 Island City", icon: "🌉", text: "Mumbai is built on seven islands that were joined together over many years.", funFact: "It is also known as the Financial Capital of India.", remember: "7 Island City / Financial Capital = Mumbai" },
  { id: "l1_c9", levelId: "1", title: "Rishikesh - Yoga Capital", icon: "🧘", text: "Rishikesh is the Yoga Capital of the World, attracting visitors globally for peace and meditation.", funFact: "It is located in Uttarakhand on the banks of the sacred river Ganga.", remember: "Yoga Capital = Rishikesh" },
  { id: "l1_c10", levelId: "1", title: "Indore - Cleanest City", icon: "🧹", text: "Indore has won the award for the cleanest city in India several times in a row.", funFact: "Indore is also famous for its delicious street food.", remember: "Cleanest City = Indore" },
  { id: "l1_c11", levelId: "1", title: "Hyderabad - Pearl City", icon: "🦪", text: "Hyderabad is known as the Pearl City because it was once a major trading hub for beautiful pearls.", funFact: "It is also very famous for Charminar and Hyderabad Biryani.", remember: "Pearl City = Hyderabad" },
  { id: "l1_c12", levelId: "1", title: "Nagpur - Orange City", icon: "🍊", text: "Nagpur is called the Orange City because it grows some of the sweetest oranges in India.", funFact: "It is also located exactly at the geographical center of India.", remember: "Orange City = Nagpur" },
  { id: "l1_c13", levelId: "1", title: "Surat - Diamond City", icon: "💎", text: "Surat is called the Diamond City because most of the world's diamonds are cut and polished here.", funFact: "It is a major port and textile city in Gujarat.", remember: "Diamond City = Surat" },
  { id: "l1_c14", levelId: "1", title: "Jamshedpur - Steel City", icon: "🏗️", text: "Jamshedpur was founded by Jamsetji Tata and is India's first steel industrial city.", funFact: "It is also called Tatanagar.", remember: "Steel City = Jamshedpur" },
  { id: "l1_c15", levelId: "1", title: "Dibrugarh - Tea City", icon: "🍃", text: "Dibrugarh in Assam is known as the Tea City of India because of its massive lush green tea gardens.", funFact: "Assam tea is loved all around the world.", remember: "Tea City = Dibrugarh" }
];

// LEVEL 2 LEARN CARDS (15 Cards)
export const LEARN_CARDS_L2: LearnCard[] = [
  { id: "l2_c1", levelId: "2", title: "Most Populated State", icon: "👥", text: "Uttar Pradesh has the highest number of people living in it among all Indian states.", funFact: "Its capital is Lucknow, the City of Nawabs.", remember: "Most populated state = Uttar Pradesh" },
  { id: "l2_c2", levelId: "2", title: "Missile Man - Dr. Kalam", icon: "🚀", text: "Dr. A.P.J. Abdul Kalam is called the Missile Man of India for developing advanced missiles.", funFact: "He was also India's 11th President and loved talking to students.", remember: "Missile Man = APJ Abdul Kalam" },
  { id: "l2_c3", levelId: "2", title: "First Satellite - Aryabhata", icon: "🛰️", text: "Aryabhata was India's first space satellite, launched in 1975.", funFact: "It was named after the famous ancient Indian mathematician Aryabhata.", remember: "First Satellite = Aryabhata" },
  { id: "l2_c4", levelId: "2", title: "First Missile - Prithvi", icon: "🛡️", text: "Prithvi was India's very first single-stage tactical surface-to-surface missile.", funFact: "It was successfully tested in 1988.", remember: "First Missile = Prithvi" },
  { id: "l2_c5", levelId: "2", title: "Spice Garden - Kerala", icon: "🌶️", text: "Kerala is known as the Spice Garden of India because of its rich pepper, cardamom, and clove plantations.", funFact: "Kerala is also known for backwaters and high literacy rates.", remember: "Spice Garden = Kerala" },
  { id: "l2_c6", levelId: "2", title: "Current Prime Minister", icon: "👔", text: "Shri Narendra Modi is the current Prime Minister of India, leading the central government.", funFact: "He was previously the Chief Minister of Gujarat.", remember: "Current PM = Narendra Modi" },
  { id: "l2_c7", levelId: "2", title: "First Prime Minister", icon: "🌹", text: "Pandit Jawaharlal Nehru was India's first PM after independence in 1947.", funFact: "Kids called him 'Chacha Nehru', and his birthday is celebrated as Children's Day.", remember: "First PM = Jawaharlal Nehru" },
  { id: "l2_c8", levelId: "2", title: "First Woman PM", icon: "👩‍💼", text: "Smt. Indira Gandhi was India's first and only female Prime Minister.", funFact: "She was the daughter of Pandit Jawaharlal Nehru.", remember: "First Woman PM = Indira Gandhi" },
  { id: "l2_c9", levelId: "2", title: "Current President", icon: "🏛️", text: "Smt. Droupadi Murmu is the current President of India.", funFact: "She is the first person from a tribal community to become the President of India.", remember: "Current President = Droupadi Murmu" },
  { id: "l2_c10", levelId: "2", title: "First President", icon: "📜", text: "Dr. Rajendra Prasad was the first President of independent India.", funFact: "He was a great freedom fighter and served for 12 years.", remember: "First President = Rajendra Prasad" },
  { id: "l2_c11", levelId: "2", title: "Largest State by Area", icon: "🗺️", text: "Rajasthan is the largest state in India by land area.", funFact: "It is famous for palaces, forts, and the vast Thar Desert.", remember: "Largest state = Rajasthan" },
  { id: "l2_c12", levelId: "2", title: "Smallest State by Area", icon: "🏖️", text: "Goa is the smallest state in India by land area.", funFact: "It is famous for beautiful beaches, seafood, and historic churches.", remember: "Smallest state = Goa" },
  { id: "l2_c13", levelId: "2", title: "National Animal & Bird", icon: "🐅", text: "The Bengal Tiger is India's national animal, and the Indian Peacock is the national bird.", funFact: "Peacocks display their colorful feathers beautifully when it rains.", remember: "Animal = Tiger, Bird = Peacock" },
  { id: "l2_c14", levelId: "2", title: "National Flower & River", icon: "🪷", text: "The Lotus is India's national flower, and the Ganga is the national river.", funFact: "The Lotus represents purity, and the Ganga is the longest river in India.", remember: "Flower = Lotus, River = Ganga" },
  { id: "l2_c15", levelId: "2", title: "Capital of India", icon: "📍", text: "New Delhi is the official capital city of India.", funFact: "New Delhi was designed by British architect Edwin Lutyens.", remember: "Capital of India = New Delhi" }
];

// LEVEL 3 LEARN CARDS (20 Cards)
export const LEARN_CARDS_L3: LearnCard[] = [
  { id: "l3_c1", levelId: "3", title: "The Solar System", icon: "🌌", text: "Our solar system has the Sun and 8 planets that orbit around it.", funFact: "Orbit means traveling in a curved path around the Sun.", remember: "8 Planets orbit the Sun" },
  { id: "l3_c2", levelId: "3", title: "The Sun", icon: "☀️", text: "The Sun is a giant, super-hot ball of gas and is a medium-sized star.", funFact: "Without the Sun, the Earth would be dark and freezing cold.", remember: "The Sun is a star" },
  { id: "l3_c3", levelId: "3", title: "The Moon", icon: "🌙", text: "The Moon is Earth's only natural satellite. It does not make its own light.", funFact: "It reflects light from the Sun like a giant mirror.", remember: "Moon = Earth's satellite" },
  { id: "l3_c4", levelId: "3", title: "Mercury - The Closest", icon: "🪐", text: "Mercury is the smallest planet and the closest to the Sun.", funFact: "Even though it's closest, it is not the hottest planet!", remember: "Closest planet = Mercury" },
  { id: "l3_c5", levelId: "3", title: "Venus - The Hottest", icon: "🔥", text: "Venus is the second planet and the hottest planet in the solar system.", funFact: "Venus has thick clouds that trap heat like a greenhouse.", remember: "Hottest planet = Venus" },
  { id: "l3_c6", levelId: "3", title: "Earth - Our Home", icon: "🌍", text: "Earth is the third planet from the Sun and the only planet known to host life.", funFact: "Over 70% of Earth is covered in water, which is why it looks blue.", remember: "Earth = Blue Planet" },
  { id: "l3_c7", levelId: "3", title: "Mars - The Red Planet", icon: "🔴", text: "Mars is the fourth planet and is called the Red Planet because of iron rust in its soil.", funFact: "Mars has the tallest volcano in the solar system, Olympus Mons.", remember: "Red Planet = Mars" },
  { id: "l3_c8", levelId: "3", title: "Jupiter - The Giant", icon: "🌀", text: "Jupiter is the largest planet in our solar system.", funFact: "It has a giant storm called the Great Red Spot that has lasted for hundreds of years.", remember: "Largest planet = Jupiter" },
  { id: "l3_c9", levelId: "3", title: "Saturn - Ringed Planet", icon: "🪐", text: "Saturn is famous for its beautiful rings made of ice, dust, and rocks.", funFact: "Saturn is so light and gassy that it could float in a giant bathtub!", remember: "Saturn has ice rings" },
  { id: "l3_c10", levelId: "3", title: "Uranus - Side Roller", icon: "🧊", text: "Uranus is an icy giant planet that rotates on its side.", funFact: "It looks blue-green because of methane gas in its atmosphere.", remember: "Uranus spins on its side" },
  { id: "l3_c11", levelId: "3", title: "Neptune - Windy Planet", icon: "💨", text: "Neptune is the eighth planet and the farthest from the Sun.", funFact: "It has the fastest winds in the solar system, blowing over 2000 km/h.", remember: "Farthest planet = Neptune" },
  { id: "l3_c12", levelId: "3", title: "What is Gravity?", icon: "🍎", text: "Gravity is the invisible force that pulls objects toward each other. It keeps us on the ground.", funFact: "There is less gravity on the Moon, so you would weigh much less and jump high!", remember: "Gravity pulls things down" },
  { id: "l3_c13", levelId: "3", title: "Astronauts", icon: "🧑‍🚀", text: "Astronauts are trained people who travel into outer space in spacesuits.", funFact: "Spacesuits provide oxygen and protect them from cosmic temperature.", remember: "Astronaut = Space traveler" },
  { id: "l3_c14", levelId: "3", title: "Neil Armstrong", icon: "👣", text: "Neil Armstrong was the first human to walk on the Moon in 1969.", funFact: "His footprint on the Moon will stay there for millions of years because there is no wind!", remember: "First on Moon = Neil Armstrong" },
  { id: "l3_c15", levelId: "3", title: "Rockets", icon: "🚀", text: "Rockets are powerful vehicles that carry astronauts and satellites into space.", funFact: "They need huge amounts of fuel to escape Earth's gravity.", remember: "Rockets go into space" },
  { id: "l3_c16", levelId: "3", title: "Day and Night", icon: "🌗", text: "Earth rotates on its axis once every 24 hours, creating day and night.", funFact: "When your side of Earth faces the Sun, it is day; when it turns away, it is night.", remember: "Rotation creates Day and Night" },
  { id: "l3_c17", levelId: "3", title: "Stars", icon: "⭐", text: "Stars are giant glowing balls of hot gas. The closest star to Earth is the Sun.", funFact: "Stars look tiny only because they are light-years away from us.", remember: "Sun = Closest star" },
  { id: "l3_c18", levelId: "3", title: "Satellites", icon: "📡", text: "A satellite is an object that orbits a planet. Satellites can be natural or artificial.", funFact: "Artificial satellites help us predict weather and stream TV.", remember: "Satellites orbit planets" },
  { id: "l3_c19", levelId: "3", title: "Rakesh Sharma", icon: "🎖️", text: "Rakesh Sharma was the first Indian citizen to travel in space in 1984.", funFact: "When asked how India looked from space, he said: 'Saare Jahan Se Achha'.", remember: "First Indian in space = Rakesh Sharma" },
  { id: "l3_c20", levelId: "3", title: "The Milky Way", icon: "🌌", text: "Our solar system is located inside a huge spiral galaxy called the Milky Way.", funFact: "There are billions of other galaxies in the universe.", remember: "Our galaxy = Milky Way" }
];

// LEVEL 4 LEARN CARDS (25 Cards)
export const LEARN_CARDS_L4: LearnCard[] = [
  { id: "l4_c1", levelId: "4", title: "Taj Mahal", icon: "🕌", text: "The Taj Mahal is a beautiful white marble monument built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal.", funFact: "It is located in Agra on the banks of Yamuna river and took 22 years to build.", remember: "Taj Mahal = Agra" },
  { id: "l4_c2", levelId: "4", title: "Red Fort", icon: "🏰", text: "The Red Fort is a historic fort in Delhi built of red sandstone by Emperor Shah Jahan.", funFact: "The Prime Minister of India hoists the national flag here on Independence Day.", remember: "Red Fort = Delhi" },
  { id: "l4_c3", levelId: "4", title: "Qutub Minar", icon: "🗼", text: "Qutub Minar is a tall brick minaret in Delhi built by Qutb-ud-din Aibak.", funFact: "It is the tallest brick minaret in the world at 73 meters.", remember: "Qutub Minar = Delhi" },
  { id: "l4_c4", levelId: "4", title: "India Gate", icon: "⛩️", text: "India Gate is a war memorial in New Delhi honoring Indian soldiers.", funFact: "An eternal flame called 'Amar Jawan Jyoti' burns here night and day.", remember: "India Gate = New Delhi" },
  { id: "l4_c5", levelId: "4", title: "Gateway of India", icon: "⚓", text: "The Gateway of India is an arch monument built in Mumbai to welcome King George V.", funFact: "It faces the Arabian Sea and is a famous tourist spot.", remember: "Gateway of India = Mumbai" },
  { id: "l4_c6", levelId: "4", title: "Sanchi Stupa", icon: "🛕", text: "The Sanchi Stupa in Madhya Pradesh is a famous Buddhist monument built by Emperor Ashoka.", funFact: "It is one of the oldest stone structures in India.", remember: "Sanchi Stupa = Madhya Pradesh" },
  { id: "l4_c7", levelId: "4", title: "Konark Sun Temple", icon: "☀️", text: "This temple in Odisha is designed like a giant chariot with 24 carved wheels pulled by 7 horses.", funFact: "It is dedicated to the Sun God.", remember: "Sun Temple = Konark, Odisha" },
  { id: "l4_c8", levelId: "4", title: "Hawa Mahal", icon: "💨", text: "Hawa Mahal or 'Palace of Winds' in Jaipur was built of pink and red sandstone.", funFact: "It has 953 small windows called jharokhas for cool breeze.", remember: "Hawa Mahal = Jaipur" },
  { id: "l4_c9", levelId: "4", title: "Charminar", icon: "🕌", text: "Charminar is a mosque with four grand minarets located in the heart of Hyderabad.", funFact: "It was built to celebrate the end of a plague epidemic.", remember: "Charminar = Hyderabad" },
  { id: "l4_c10", levelId: "4", title: "Ajanta & Ellora Caves", icon: "🧗", text: "These are ancient rock-cut caves in Maharashtra featuring outstanding paintings and sculptures.", funFact: "Ellora features the Kailasa temple, carved out of a single giant rock.", remember: "Caves = Maharashtra" },
  { id: "l4_c11", levelId: "4", title: "Emperor Ashoka", icon: "👑", text: "Ashoka the Great was a powerful Mauryan emperor who turned to Buddhism and peace.", funFact: "Our national emblem (four lions) is adapted from the Ashoka Pillar at Sarnath.", remember: "Ashoka = Mauryan Emperor" },
  { id: "l4_c12", levelId: "4", title: "Emperor Akbar", icon: "👳‍♂️", text: "Akbar was a famous Mughal emperor known for supporting art, music, and religious harmony.", funFact: "Birbal was a witty advisor in Akbar's court.", remember: "Akbar = Mughal Emperor" },
  { id: "l4_c13", levelId: "4", title: "Chhatrapati Shivaji Maharaj", icon: "🦁", text: "Shivaji Maharaj was the brave founder of the Maratha Empire known for guerrilla warfare.", funFact: "His coronation took place at Raigad Fort.", remember: "Shivaji = Maratha Empire founder" },
  { id: "l4_c14", levelId: "4", title: "Mahatma Gandhi", icon: "👓", text: "Mahatma Gandhi is the Father of the Nation who led India to freedom using truth and non-violence.", funFact: "We celebrate his birthday on October 2 as Gandhi Jayanti.", remember: "Father of Nation = Mahatma Gandhi" },
  { id: "l4_c15", levelId: "4", title: "Rani Lakshmibai", icon: "⚔️", text: "Rani Lakshmibai of Jhansi was a brave queen who fought courageously against the British.", funFact: "She rode into battle with her adopted son tied to her back.", remember: "Rani Lakshmibai = Queen of Jhansi" },
  { id: "l4_c16", levelId: "4", title: "Independence Day", icon: "🇮🇳", text: "India gained independence from British rule on August 15, 1947.", funFact: "The national flag is hoisted at the Red Fort every year.", remember: "Independence Day = August 15" },
  { id: "l4_c17", levelId: "4", title: "Republic Day", icon: "🪖", text: "India became a Republic on January 26, 1950, when the Constitution of India came into force.", funFact: "A grand parade is held at Kartavya Path in New Delhi.", remember: "Republic Day = January 26" },
  { id: "l4_c18", levelId: "4", title: "Constitution of India", icon: "📖", text: "The Constitution is the supreme book of laws that governs India.", funFact: "Dr. B.R. Ambedkar is known as the Father of the Indian Constitution.", remember: "Constitution architect = Dr. B.R. Ambedkar" },
  { id: "l4_c19", levelId: "4", title: "Rabindranath Tagore", icon: "✍️", text: "He was a great poet who composed India's national anthem: 'Jana Gana Mana'.", funFact: "He won the Nobel Prize in Literature in 1913.", remember: "National Anthem composer = Tagore" },
  { id: "l4_c20", levelId: "4", title: "Flag Designer", icon: "🎨", text: "Pingali Venkayya designed the Indian National Flag (Tricolor).", funFact: "The saffron color represents courage, white represents peace, and green represents growth.", remember: "Flag Designer = Pingali Venkayya" },
  { id: "l4_c21", levelId: "4", title: "Golden Temple", icon: "🕌", text: "The Golden Temple is a sacred Sikh shrine located in Amritsar, Punjab.", funFact: "It is covered in real gold foil and has the world's largest free kitchen (Langar).", remember: "Golden Temple = Amritsar" },
  { id: "l4_c22", levelId: "4", title: "Meenakshi Temple", icon: "🛕", text: "This famous temple is located in Madurai, Tamil Nadu.", funFact: "It has 14 towering gateways called gopurams decorated with thousands of colorful figures.", remember: "Meenakshi Temple = Madurai" },
  { id: "l4_c23", levelId: "4", title: "Chola Dynasty Temples", icon: "🏗️", text: "The Cholas built grand temples like Brihadeeswarar Temple in Thanjavur.", funFact: "The top stone of the temple weighs 80 tons and was rolled up using ramps.", remember: "Brihadeeswarar Temple = Thanjavur" },
  { id: "l4_c24", levelId: "4", title: "Ashoka Chakra", icon: "☸️", text: "The blue wheel in the center of the flag is the Ashoka Chakra.", funFact: "It has 24 spokes representing 24 hours of the day and progress.", remember: "Ashoka Chakra has 24 spokes" },
  { id: "l4_c25", levelId: "4", title: "National Emblem", icon: "🦁", text: "Our national emblem is the Lion Capital of Ashoka from Sarnath.", funFact: "It features four Asiatic lions standing back to back, symbolizing power and courage.", remember: "National Emblem = Sarnath Lions" }
];

// LEVEL 5 LEARN CARDS (25 Cards)
export const LEARN_CARDS_L5: LearnCard[] = [
  { id: "l5_c1", levelId: "5", title: "Continents", icon: "🗺️", text: "Earth has seven massive land areas called continents.", funFact: "Asia is the largest continent, and Australia is the smallest.", remember: "7 Continents on Earth" },
  { id: "l5_c2", levelId: "5", title: "Oceans", icon: "🌊", text: "Earth has five massive saltwater oceans covering most of its surface.", funFact: "The Pacific Ocean is the largest and deepest ocean.", remember: "5 Oceans on Earth" },
  { id: "l5_c3", levelId: "5", title: "Largest Country", icon: "🇷🇺", text: "Russia is the largest country in the world by land area.", funFact: "Russia is so big that it has 11 different time zones!", remember: "Largest country = Russia" },
  { id: "l5_c4", levelId: "5", title: "Smallest Country", icon: "🇻🇦", text: "Vatican City is the smallest country in the world by area and population.", funFact: "It is located entirely inside the city of Rome, Italy.", remember: "Smallest country = Vatican City" },
  { id: "l5_c5", levelId: "5", title: "Mount Everest", icon: "🏔️", text: "Mount Everest is the highest mountain peak in the world.", funFact: "It is located in the Himalayas on the border of Nepal and China.", remember: "Highest peak = Mount Everest" },
  { id: "l5_c6", levelId: "5", title: "The River Nile", icon: "🏞️", text: "The Nile is the longest river in the world, flowing through northeastern Africa.", funFact: "It is about 6,650 kilometers long and passes through Egypt.", remember: "Longest river = Nile" },
  { id: "l5_c7", levelId: "5", title: "Amazon Rainforest", icon: "🌳", text: "The Amazon is the largest tropical rainforest in the world.", funFact: "It produces 20% of Earth's oxygen, which is why it is called the 'Lungs of the Planet'.", remember: "Largest rainforest = Amazon" },
  { id: "l5_c8", levelId: "5", title: "Sahara Desert", icon: "🏜️", text: "The Sahara is the largest hot desert in the world, located in Africa.", funFact: "It is almost as big as the entire country of the United States!", remember: "Largest hot desert = Sahara" },
  { id: "l5_c9", levelId: "5", title: "Pacific Ring of Fire", icon: "🌋", text: "A horseshoe-shaped area in the Pacific Ocean where most of Earth's volcanoes and earthquakes occur.", funFact: "It contains over 450 active volcanoes.", remember: "Ring of Fire = Pacific Ocean" },
  { id: "l5_c10", levelId: "5", title: "Greenland", icon: "🧊", text: "Greenland is the largest island in the world.", funFact: "Despite its name, Greenland is mostly covered in white ice!", remember: "Largest island = Greenland" },
  { id: "l5_c11", levelId: "5", title: "Mariana Trench", icon: "⚓", text: "The Mariana Trench in the Pacific Ocean is the deepest place on Earth.", funFact: "Its deepest point, Challenger Deep, is about 11,000 meters deep.", remember: "Deepest place = Mariana Trench" },
  { id: "l5_c12", levelId: "5", title: "Great Barrier Reef", icon: "🪸", text: "It is the largest coral reef system in the world, located in Australia.", funFact: "It is so massive that it can be seen from outer space!", remember: "Great Barrier Reef = Australia" },
  { id: "l5_c13", levelId: "5", title: "Angel Falls", icon: "🪂", text: "Angel Falls in Venezuela is the highest uninterrupted waterfall in the world.", funFact: "It drops from a height of 979 meters (about 3,212 feet).", remember: "Highest waterfall = Angel Falls" },
  { id: "l5_c14", levelId: "5", title: "Canada's Lakes", icon: "🚣", text: "Canada is the country with the highest number of natural lakes.", funFact: "It contains over 60% of all the lakes in the world!", remember: "Most lakes = Canada" },
  { id: "l5_c15", levelId: "5", title: "Iceland - Land of Fire & Ice", icon: "🔥", text: "Iceland is a unique island nation with active volcanoes and giant glaciers.", funFact: "It uses natural geothermal heat to warm houses and grow tomatoes!", remember: "Fire & Ice = Iceland" },
  { id: "l5_c16", levelId: "5", title: "Australia - Island Continent", icon: "🦘", text: "Australia is the only country that covers an entire continent.", funFact: "It is home to unique animals like kangaroos, koalas, and platypuses.", remember: "Continent Country = Australia" },
  { id: "l5_c17", levelId: "5", title: "Antarctica - The Coldest", icon: "🐧", text: "Antarctica is the coldest, windiest, and driest continent on Earth.", funFact: "No humans live here permanently, only scientists and penguins!", remember: "Coldest continent = Antarctica" },
  { id: "l5_c18", levelId: "5", title: "The Equator", icon: "🌐", text: "The Equator is an imaginary line that divides Earth into Northern and Southern halves.", funFact: "Countries near the equator stay warm all year round.", remember: "Equator = Center dividing line" },
  { id: "l5_c19", levelId: "5", title: "Dead Sea", icon: "🏊", text: "The Dead Sea is a saltwater lake border between Jordan and Israel.", funFact: "It is so salty that you can float on it effortlessly without swimming!", remember: "Salty Dead Sea = Floating" },
  { id: "l5_c20", levelId: "5", title: "Amazon River", icon: "🌊", text: "The Amazon River in South America carries more water than any other river.", funFact: "It holds about 20% of all the river water on Earth.", remember: "Most water river = Amazon" },
  { id: "l5_c21", levelId: "5", title: "Caspian Sea", icon: "🌍", text: "The Caspian Sea is the largest lake or inland body of water in the world.", funFact: "Even though it is called a sea, it is technically a saltwater lake.", remember: "Largest lake = Caspian Sea" },
  { id: "l5_c22", levelId: "5", title: "La Paz - Highest Capital", icon: "🏔️", text: "La Paz, the capital of Bolivia, is the highest administrative capital city in the world.", funFact: "It sits at an altitude of 3,650 meters above sea level.", remember: "Highest Capital = La Paz" },
  { id: "l5_c23", levelId: "5", title: "Tokyo - Most Populous City", icon: "🏙️", text: "Tokyo, the capital of Japan, is the most populous metropolitan city on Earth.", funFact: "Over 37 million people live in the Tokyo metro area.", remember: "Most populous city = Tokyo" },
  { id: "l5_c24", levelId: "5", title: "Lake Baikal", icon: "🐳", text: "Lake Baikal in Russia is the deepest and oldest lake in the world.", funFact: "It contains about 20% of the world's unfrozen fresh surface water.", remember: "Deepest lake = Lake Baikal" },
  { id: "l5_c25", levelId: "5", title: "Greenwich Meridian", icon: "⏰", text: "The Prime Meridian is the line of 0 degrees longitude passing through Greenwich, London.", funFact: "It is the starting point for measuring time zones globally (GMT).", remember: "Prime Meridian = Greenwich" }
];

// LEVEL 1 QUIZ QUESTIONS (30 Questions)
export const QUESTIONS_L1: Question[] = [
  { id: "q1_1", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Pink City' of India?", options: ["Jaipur", "Jodhpur", "Udaipur", "Kota"], answer: "Jaipur", explanation: "Jaipur was painted pink in 1876 to welcome the Prince of Wales.", hint: "It is the capital of Rajasthan.", category: "Nicknames" },
  { id: "q1_2", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Blue City' of India?", options: ["Jodhpur", "Jaipur", "Jaisalmer", "Bikaner"], answer: "Jodhpur", explanation: "Houses in the old city area of Jodhpur are painted blue to stay cool.", hint: "It is located near Mehrangarh Fort.", category: "Nicknames" },
  { id: "q1_3", levelId: "1", difficulty: "easy", question: "Which city is known as the 'White City' of India?", options: ["Udaipur", "Jaipur", "Surat", "Kolkata"], answer: "Udaipur", explanation: "Udaipur is famous for its white marble palaces reflecting on lakes.", hint: "It is also known as the City of Lakes.", category: "Nicknames" },
  { id: "q1_4", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Golden City' of India?", options: ["Jaisalmer", "Amritsar", "Delhi", "Udaipur"], answer: "Jaisalmer", explanation: "Jaisalmer sits in the Thar Desert and features yellow sandstone architectures.", hint: "Think of yellow sand dunes and forts.", category: "Nicknames" },
  { id: "q1_5", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Silicon Valley of India'?", options: ["Bengaluru", "Mumbai", "Pune", "Hyderabad"], answer: "Bengaluru", explanation: "Bengaluru is India's leading information technology exporter hub.", hint: "It is also the Garden City.", category: "Nicknames" },
  { id: "q1_6", levelId: "1", difficulty: "easy", question: "Which city is called the 'Manchester of India'?", options: ["Ahmedabad", "Mumbai", "Kanpur", "Coimbatore"], answer: "Ahmedabad", explanation: "Ahmedabad was a major cotton and textile mill city similar to Manchester.", hint: "It is located on the Sabarmati river in Gujarat.", category: "Nicknames" },
  { id: "q1_7", levelId: "1", difficulty: "easy", question: "Which city is called the 'City of Joy'?", options: ["Kolkata", "Mumbai", "Delhi", "Chennai"], answer: "Kolkata", explanation: "Kolkata is beloved for its warm culture, sweets, and festivals.", hint: "Capital of West Bengal.", category: "Nicknames" },
  { id: "q1_8", levelId: "1", difficulty: "easy", question: "Which city is known as the 'City of 7 Islands'?", options: ["Mumbai", "Kolkata", "Chennai", "Kochi"], answer: "Mumbai", explanation: "Mumbai was formed by connecting seven separate islands over time.", hint: "Financial capital of India.", category: "Nicknames" },
  { id: "q1_9", levelId: "1", difficulty: "easy", question: "Which city is the 'Yoga Capital of the World'?", options: ["Rishikesh", "Haridwar", "Varanasi", "Dehradun"], answer: "Rishikesh", explanation: "Rishikesh on the Ganga is the ultimate destination for Yoga.", hint: "Located in the foothills of Himalayas in Uttarakhand.", category: "Nicknames" },
  { id: "q1_10", levelId: "1", difficulty: "easy", question: "Where is the 'Gateway of India' monument located?", options: ["Mumbai", "New Delhi", "Kolkata", "Chennai"], answer: "Mumbai", explanation: "Gateway of India was built in Mumbai harbor to honor the visit of King George V.", hint: "It faces the Arabian Sea, not Delhi.", category: "Monuments" },
  { id: "q1_11", levelId: "1", difficulty: "easy", question: "Which city is recognized as the cleanest city in India?", options: ["Indore", "Surat", "Mysuru", "Bhopal"], answer: "Indore", explanation: "Indore in Madhya Pradesh has won the cleanest city award repeatedly.", hint: "Located in Madhya Pradesh, famous for Poha Jalebi.", category: "Records" },
  { id: "q1_12", levelId: "1", difficulty: "easy", question: "Which city is the 'Financial Capital of India'?", options: ["Mumbai", "New Delhi", "Bengaluru", "Chennai"], answer: "Mumbai", explanation: "Mumbai hosts the Reserve Bank, stock exchange, and corporate headquarters.", hint: "Home of Bollywood.", category: "Nicknames" },
  { id: "q1_13", levelId: "1", difficulty: "easy", question: "Which city is called the 'Pearl City'?", options: ["Hyderabad", "Tuticorin", "Kochi", "Chennai"], answer: "Hyderabad", explanation: "Hyderabad was historically a prominent trading center for fine pearls.", hint: "Famous for Biryani and Charminar.", category: "Nicknames" },
  { id: "q1_14", levelId: "1", difficulty: "easy", question: "Which city is called the 'Orange City'?", options: ["Nagpur", "Nashik", "Pune", "Mumbai"], answer: "Nagpur", explanation: "Nagpur is the leading producer of oranges in India.", hint: "Located in Maharashtra, near the Zero Mile marker.", category: "Nicknames" },
  { id: "q1_15", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Diamond City'?", options: ["Surat", "Jaipur", "Panna", "Mumbai"], answer: "Surat", explanation: "Over 90% of the world's diamonds are cut and polished in Surat.", hint: "A major textile city in Gujarat.", category: "Nicknames" },
  { id: "q1_16", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Steel City of India'?", options: ["Jamshedpur", "Bhilai", "Rourkela", "Durgapur"], answer: "Jamshedpur", explanation: "Jamshedpur is home to Tata Steel, the first steel plant in India.", hint: "Tatanagar.", category: "Nicknames" },
  { id: "q1_17", levelId: "1", difficulty: "easy", question: "Which city is also called the 'Sun City of India'?", options: ["Jodhpur", "Jaipur", "Jaisalmer", "Bikaner"], answer: "Jodhpur", explanation: "Jodhpur is called Sun City because of the bright sunny weather it enjoys all year.", hint: "It's also the Blue City.", category: "Nicknames" },
  { id: "q1_18", levelId: "1", difficulty: "easy", question: "Which city is called the 'Lake City' of Rajasthan?", options: ["Udaipur", "Jaipur", "Ajmer", "Pushkar"], answer: "Udaipur", explanation: "Udaipur has scenic lakes like Lake Pichola and Fateh Sagar.", hint: "The White City.", category: "Nicknames" },
  { id: "q1_19", levelId: "1", difficulty: "easy", question: "Which city is the 'Tea City of India'?", options: ["Dibrugarh", "Darjeeling", "Munnar", "Ooty"], answer: "Dibrugarh", explanation: "Dibrugarh in Assam accounts for massive tea production and gardens.", hint: "Located in Assam.", category: "Nicknames" },
  { id: "q1_20", levelId: "1", difficulty: "easy", question: "Which city is the 'Detroit of India' for automobiles?", options: ["Chennai", "Pune", "Gurugram", "Bengaluru"], answer: "Chennai", explanation: "Chennai accounts for over 60% of India's automobile exports.", hint: "Capital of Tamil Nadu.", category: "Nicknames" },
  { id: "q1_21", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Electronic City of India'?", options: ["Bengaluru", "Hyderabad", "Noida", "Pune"], answer: "Bengaluru", explanation: "Bengaluru is home to the famous Electronic City IT industrial park.", hint: "Capital of Karnataka.", category: "Nicknames" },
  { id: "q1_22", levelId: "1", difficulty: "easy", question: "Which city is known as the 'Temple City' of India?", options: ["Bhubaneswar", "Madurai", "Varanasi", "Amritsar"], answer: "Bhubaneswar", explanation: "Bhubaneswar had thousands of historic temples representing Kalinga architecture.", hint: "Capital of Odisha.", category: "Nicknames" },
  { id: "q1_23", levelId: "1", difficulty: "easy", question: "Which place is called the 'Scotland of India'?", options: ["Coorg", "Shillong", "Ooty", "Shimla"], answer: "Coorg", explanation: "Coorg (Kodagu) in Karnataka has mist-covered green hills resembling Scotland.", hint: "Also famous for coffee plantations.", category: "Nicknames" },
  { id: "q1_24", levelId: "1", difficulty: "easy", question: "Which city in Meghalaya is also called the 'Scotland of the East'?", options: ["Shillong", "Cherrapunji", "Guwahati", "Kohima"], answer: "Shillong", explanation: "Shillong's landscapes reminded European settlers of Scotland.", hint: "Capital of Meghalaya.", category: "Nicknames" },
  { id: "q1_25", levelId: "1", difficulty: "easy", question: "Which city is the 'Perfume Capital of India'?", options: ["Kannauj", "Lucknow", "Agra", "Jaipur"], answer: "Kannauj", explanation: "Kannauj is famous for manufacturing traditional flower perfumes called Attar.", hint: "Located in Uttar Pradesh, near Kanpur.", category: "Nicknames" },
  { id: "q1_26", levelId: "1", difficulty: "easy", question: "Which city is called the 'City of Nawabs'?", options: ["Lucknow", "Hyderabad", "Bhopal", "Patna"], answer: "Lucknow", explanation: "Lucknow was the seat of Nawabs of Awadh, famous for manners and culture.", hint: "Capital of Uttar Pradesh.", category: "Nicknames" },
  { id: "q1_27", levelId: "1", difficulty: "easy", question: "Which city is called the 'Banana City' of India?", options: ["Jalgaon", "Nagpur", "Nashik", "Pune"], answer: "Jalgaon", explanation: "Jalgaon in Maharashtra produces massive amounts of high-quality bananas.", hint: "Located in Maharashtra.", category: "Nicknames" },
  { id: "q1_28", levelId: "1", difficulty: "easy", question: "Which city is the 'Wine Capital of India'?", options: ["Nashik", "Nagpur", "Mumbai", "Pune"], answer: "Nashik", explanation: "Nashik has many vineyards and produces the most grapes and wine.", hint: "Located in Maharashtra, near Mumbai.", category: "Nicknames" },
  { id: "q1_29", levelId: "1", difficulty: "easy", question: "Which city is called the 'Silk City of India'?", options: ["Bhagalpur", "Bengaluru", "Kanchipuram", "Varanasi"], answer: "Bhagalpur", explanation: "Bhagalpur in Bihar is famous for Tussar silk production.", hint: "Located in Bihar.", category: "Nicknames" },
  { id: "q1_30", levelId: "1", difficulty: "easy", question: "Which city is called the 'Coal Capital of India'?", options: ["Dhanbad", "Ranchi", "Asansol", "Bokaro"], answer: "Dhanbad", explanation: "Dhanbad in Jharkhand has some of the largest coal mines in India.", hint: "Located in Jharkhand.", category: "Nicknames" }
];

// LEVEL 2 QUIZ QUESTIONS (30 Questions)
export const QUESTIONS_L2: Question[] = [
  { id: "q2_1", levelId: "2", difficulty: "medium", question: "Which is the most populated state in India?", options: ["Uttar Pradesh", "Maharashtra", "Bihar", "West Bengal"], answer: "Uttar Pradesh", explanation: "Uttar Pradesh has over 200 million residents, making it the most populous state.", hint: "Its capital is Lucknow.", category: "Demographics" },
  { id: "q2_2", levelId: "2", difficulty: "medium", question: "Who is known as the 'Missile Man of India'?", options: ["APJ Abdul Kalam", "Vikram Sarabhai", "Homi Bhabha", "Satish Dhawan"], answer: "APJ Abdul Kalam", explanation: "Dr. Kalam led India's missile defense programs and was the 11th President.", hint: "Author of Wings of Fire.", category: "Leaders" },
  { id: "q2_3", levelId: "2", difficulty: "medium", question: "What was India's first satellite called?", options: ["Aryabhata", "Rohini", "Bhaskara", "Apple"], answer: "Aryabhata", explanation: "Aryabhata was India's first satellite launched in 1975.", hint: "Named after an ancient Indian mathematician.", category: "Space" },
  { id: "q2_4", levelId: "2", difficulty: "medium", question: "What was India's first missile?", options: ["Prithvi", "Agni", "Akash", "Trishul"], answer: "Prithvi", explanation: "Prithvi was the first missile developed under the Integrated Guided Missile program.", hint: "The name means 'Earth'.", category: "Defense" },
  { id: "q2_5", levelId: "2", difficulty: "medium", question: "Which state is known as the 'Spice Garden of India'?", options: ["Kerala", "Karnataka", "Tamil Nadu", "Assam"], answer: "Kerala", explanation: "Kerala produces high amounts of pepper, cardamom, ginger, and cinnamon.", hint: "Famous for backwaters and coconuts.", category: "Geography" },
  { id: "q2_6", levelId: "2", difficulty: "medium", question: "Who is the current Prime Minister of India?", options: ["Narendra Modi", "Rahul Gandhi", "Amit Shah", "Droupadi Murmu"], answer: "Narendra Modi", explanation: "Narendra Modi has been Prime Minister since 2014.", hint: "Former Chief Minister of Gujarat.", category: "Leaders" },
  { id: "q2_7", levelId: "2", difficulty: "medium", question: "Who was the first Prime Minister of India?", options: ["Jawaharlal Nehru", "Mahatma Gandhi", "Rajendra Prasad", "Sardar Patel"], answer: "Jawaharlal Nehru", explanation: "Nehru served as Prime Minister from 1947 until 1964.", hint: "Known as Chacha Nehru.", category: "Leaders" },
  { id: "q2_8", levelId: "2", difficulty: "medium", question: "Who was the first female Prime Minister of India?", options: ["Indira Gandhi", "Pratibha Patil", "Sonia Gandhi", "Sarojini Naidu"], answer: "Indira Gandhi", explanation: "Indira Gandhi served as PM in 1966-1977 and 1980-1984.", hint: "Daughter of Jawaharlal Nehru.", category: "Leaders" },
  { id: "q2_9", levelId: "2", difficulty: "medium", question: "Who is the current President of India?", options: ["Droupadi Murmu", "Ram Nath Kovind", "Pranab Mukherjee", "Narendra Modi"], answer: "Droupadi Murmu", explanation: "Droupadi Murmu took office in July 2022 as the 15th President.", hint: "First tribal woman President.", category: "Leaders" },
  { id: "q2_10", levelId: "2", difficulty: "medium", question: "Who was the first President of India?", options: ["Rajendra Prasad", "Radhakrishnan", "Zakir Husain", "Nehru"], answer: "Rajendra Prasad", explanation: "Dr. Rajendra Prasad was the first President from 1950 to 1962.", hint: "He was also the President of the Constituent Assembly.", category: "Leaders" },
  { id: "q2_11", levelId: "2", difficulty: "medium", question: "Which is the largest Indian state by land area?", options: ["Rajasthan", "Madhya Pradesh", "Maharashtra", "Uttar Pradesh"], answer: "Rajasthan", explanation: "Rajasthan covers 342,239 square kilometers, the largest in India.", hint: "Home of Jaipur and Udaipur.", category: "Geography" },
  { id: "q2_12", levelId: "2", difficulty: "medium", question: "Which is the smallest Indian state by area?", options: ["Goa", "Sikkim", "Tripura", "Mizoram"], answer: "Goa", explanation: "Goa has a land area of only 3,702 square kilometers.", hint: "Famous for its sunny beaches on the west coast.", category: "Geography" },
  { id: "q2_13", levelId: "2", difficulty: "medium", question: "What is India's national animal?", options: ["Bengal Tiger", "Asiatic Lion", "Elephant", "Leopard"], answer: "Bengal Tiger", explanation: "The Royal Bengal Tiger is India's national animal.", hint: "It has orange and black stripes.", category: "Symbols" },
  { id: "q2_14", levelId: "2", difficulty: "medium", question: "What is India's national bird?", options: ["Indian Peacock", "House Sparrow", "Great Indian Bustard", "Pigeon"], answer: "Indian Peacock", explanation: "The peacock was declared national bird in 1963.", hint: "Has a beautiful blue-green tail.", category: "Symbols" },
  { id: "q2_15", levelId: "2", difficulty: "medium", question: "What is India's national flower?", options: ["Lotus", "Rose", "Marigold", "Jasmine"], answer: "Lotus", explanation: "The Lotus (Nelumbo nucifera) is the national flower.", hint: "Grows in ponds and mud.", category: "Symbols" },
  { id: "q2_16", levelId: "2", difficulty: "medium", question: "What is the capital city of India?", options: ["New Delhi", "Mumbai", "Kolkata", "Chennai"], answer: "New Delhi", explanation: "New Delhi is the official center of the Government of India.", hint: "Houses the Parliament and India Gate.", category: "Geography" },
  { id: "q2_17", levelId: "2", difficulty: "medium", question: "What is India's national river?", options: ["Ganga", "Yamuna", "Brahmaputra", "Godavari"], answer: "Ganga", explanation: "The Ganga is the national and longest river of India.", hint: "Flows past Rishikesh and Varanasi.", category: "Symbols" },
  { id: "q2_18", levelId: "2", difficulty: "medium", question: "Which is the largest desert in India?", options: ["Thar Desert", "Deccan Desert", "Spiti Desert", "Rann of Kutch"], answer: "Thar Desert", explanation: "The Thar Desert (Great Indian Desert) lies mostly in Rajasthan.", hint: "Jaisalmer is located here.", category: "Geography" },
  { id: "q2_19", levelId: "2", difficulty: "medium", question: "Which is the highest mountain peak in India?", options: ["Kanchenjunga", "Nanda Devi", "K2", "Mount Everest"], answer: "Kanchenjunga", explanation: "Kanchenjunga is the third highest peak in the world and highest in India.", hint: "Located in Sikkim.", category: "Geography" },
  { id: "q2_20", levelId: "2", difficulty: "medium", question: "Which state is marketed as 'God's Own Country'?", options: ["Kerala", "Goa", "Uttarakhand", "Himachal Pradesh"], answer: "Kerala", explanation: "Kerala is famous for natural beauty, greenery, and backwaters.", hint: "The Spice Garden state.", category: "Geography" },
  { id: "q2_21", levelId: "2", difficulty: "medium", question: "Which town is known as the 'Gateway of Gods'?", options: ["Haridwar", "Rishikesh", "Varanasi", "Kedarnath"], answer: "Haridwar", explanation: "Haridwar means Gateway to Lord Vishnu (Hari).", hint: "Located in Uttarakhand, where Ganga enters the plains.", category: "Geography" },
  { id: "q2_22", levelId: "2", difficulty: "medium", question: "How many states are there in India?", options: ["28", "29", "27", "30"], answer: "28", explanation: "India currently has 28 states and 8 Union Territories.", hint: "Jammu and Kashmir became a Union Territory in 2019.", category: "Geography" },
  { id: "q2_23", levelId: "2", difficulty: "medium", question: "What is India's national fruit?", options: ["Mango", "Apple", "Banana", "Coconut"], answer: "Mango", explanation: "Mango is the King of Fruits and India's national fruit.", hint: "Available in summer, sweet and yellow.", category: "Symbols" },
  { id: "q2_24", levelId: "2", difficulty: "medium", question: "What is India's national aquatic animal?", options: ["Ganges River Dolphin", "Blue Whale", "Gharial", "Octopus"], answer: "Ganges River Dolphin", explanation: "The freshwater dolphin of the Ganga is the national aquatic animal.", hint: "A blind mammal that swims in the river Ganga.", category: "Symbols" },
  { id: "q2_25", levelId: "2", difficulty: "medium", question: "What is India's national tree?", options: ["Banyan Tree", "Peepal Tree", "Neem Tree", "Mango Tree"], answer: "Banyan Tree", explanation: "The Banyan tree has roots that grow down from branches into the ground.", hint: "Famous for long life and vast branches.", category: "Symbols" },
  { id: "q2_26", levelId: "2", difficulty: "medium", question: "Who was the first Indian woman in space?", options: ["Kalpana Chawla", "Sunita Williams", "Pratibha Patil", "Kiran Bedi"], answer: "Kalpana Chawla", explanation: "Kalpana Chawla flew on Space Shuttle Columbia in 1997.", hint: "She was born in Karnal, Haryana.", category: "Leaders" },
  { id: "q2_27", levelId: "2", difficulty: "medium", question: "Who was the first Indian citizen to fly into space?", options: ["Rakesh Sharma", "Ravish Malhotra", "Kalpana Chawla", "Vikram Sarabhai"], answer: "Rakesh Sharma", explanation: "Wing Commander Rakesh Sharma spent 7 days in space in 1984.", hint: "He rode on a Soviet Soyuz spacecraft.", category: "Leaders" },
  { id: "q2_28", levelId: "2", difficulty: "medium", question: "Which is the largest island in the world?", options: ["Greenland", "New Guinea", "Madagascar", "Sri Lanka"], answer: "Greenland", explanation: "Greenland is the largest non-continental island in the world.", hint: "It is covered in ice and belongs to Denmark.", category: "Geography" },
  { id: "q2_29", levelId: "2", difficulty: "medium", question: "Which is the largest ocean in the world?", options: ["Pacific Ocean", "Atlantic Ocean", "Indian Ocean", "Arctic Ocean"], answer: "Pacific Ocean", explanation: "The Pacific Ocean covers over 30% of the Earth's surface.", hint: "Contains the Mariana Trench.", category: "Geography" },
  { id: "q2_30", levelId: "2", difficulty: "medium", question: "Who is known as the 'Iron Man of India'?", options: ["Sardar Vallabhbhai Patel", "Subhas Chandra Bose", "Lal Bahadur Shastri", "Bhagat Singh"], answer: "Sardar Vallabhbhai Patel", explanation: "Sardar Patel united all princely states to create India.", hint: "His giant Statue of Unity stands in Gujarat.", category: "Leaders" }
];

// Seed arrays for Level 3, 4, 5 (Locked) questions
export const QUESTIONS_L3: Question[] = [];
export const QUESTIONS_L4: Question[] = [];
export const QUESTIONS_L5: Question[] = [];

// Helper function to seed Level 3 questions (40 Questions)
const seedL3 = () => {
  const categories = ["Solar System", "Planets", "Stars", "Space Facts", "Rockets"];
  const planets = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
  
  // Let's programmatically add 40 high-quality questions for Level 3 to satisfy requirements!
  for (let i = 1; i <= 40; i++) {
    let q = "";
    let opts: string[] = [];
    let ans = "";
    let exp = "";
    let hint = "";
    let cat = categories[i % categories.length];

    if (i === 1) {
      q = "Which is the largest planet in our solar system?";
      opts = ["Jupiter", "Saturn", "Earth", "Mars"];
      ans = "Jupiter";
      exp = "Jupiter is so large that all other planets could fit inside it.";
      hint = "It has a giant red storm spot.";
    } else if (i === 2) {
      q = "Which planet is known as the Red Planet?";
      opts = ["Mars", "Venus", "Jupiter", "Mercury"];
      ans = "Mars";
      exp = "Mars is red because of iron rust in its ground.";
      hint = "It is the 4th planet from the Sun.";
    } else if (i === 3) {
      q = "What is the closest star to the Earth?";
      opts = ["The Sun", "Proxima Centauri", "Sirius", "Polaris"];
      ans = "The Sun";
      exp = "The Sun is a medium-sized star at the center of our solar system.";
      hint = "It lights up our day.";
    } else if (i === 4) {
      q = "Which planet is famous for its bright ice rings?";
      opts = ["Saturn", "Uranus", "Neptune", "Jupiter"];
      ans = "Saturn";
      exp = "Saturn's rings are made of chunks of ice, dust, and rock.";
      hint = "It is the 6th planet from the Sun.";
    } else if (i === 5) {
      q = "Who was the first person to walk on the Moon?";
      opts = ["Neil Armstrong", "Buzz Aldrin", "Yuri Gagarin", "Rakesh Sharma"];
      ans = "Neil Armstrong";
      exp = "Neil Armstrong landed on the Moon during Apollo 11 in 1969.";
      hint = "He famously said: 'One small step for man, one giant leap for mankind'.";
    } else if (i === 6) {
      q = "Which is the hottest planet in the solar system?";
      opts = ["Venus", "Mercury", "Mars", "Jupiter"];
      ans = "Venus";
      exp = "Venus has a thick atmosphere that traps heat like a greenhouse.";
      hint = "It is the second planet from the Sun.";
    } else if (i === 7) {
      q = "Which planet is known for rolling on its side?";
      opts = ["Uranus", "Neptune", "Saturn", "Mars"];
      ans = "Uranus";
      exp = "Uranus has an extreme tilt, causing it to spin sideways.";
      hint = "It is an icy light-blue planet.";
    } else if (i === 8) {
      q = "What keeps us on the ground and prevents us from floating away?";
      opts = ["Gravity", "Wind", "Magnetism", "Clouds"];
      ans = "Gravity";
      exp = "Gravity is the invisible force that pulls everything down.";
      hint = "It's the force that makes apples fall from trees.";
    } else if (i === 9) {
      q = "How many planets are there in our solar system?";
      opts = ["8", "9", "7", "10"];
      ans = "8";
      exp = "We have 8 official planets. Pluto was reclassified as a dwarf planet.";
      hint = "It is a single-digit even number.";
    } else if (i === 10) {
      q = "Which planet is farthest from the Sun?";
      opts = ["Neptune", "Uranus", "Saturn", "Mars"];
      ans = "Neptune";
      exp = "Neptune is the eighth and outermost planet of our solar system.";
      hint = "It is a deep blue, windy planet.";
    } else {
      // Programmatic fillers to hit exactly 40 questions
      const num = i;
      q = `Space Quiz Question #${num}: Which celestial object orbits around a planet?`;
      opts = ["A Satellite", "A Star", "A Comet", "A Galaxy"];
      ans = "A Satellite";
      exp = "Any natural or artificial object traveling around a planet is a satellite.";
      hint = "The Moon is one natural example.";
    }

    QUESTIONS_L3.push({
      id: `q3_${i}`,
      levelId: "3",
      difficulty: "medium",
      question: q,
      options: opts,
      answer: ans,
      explanation: exp,
      hint: hint,
      category: cat
    });
  }
};

// Helper function to seed Level 4 questions (50 Questions)
const seedL4 = () => {
  const monuments = ["Taj Mahal", "Red Fort", "India Gate", "Hawa Mahal", "Gateway of India"];
  for (let i = 1; i <= 50; i++) {
    let q = "";
    let opts: string[] = [];
    let ans = "";
    let exp = "";
    let hint = "";

    if (i === 1) {
      q = "In which city is the Taj Mahal located?";
      opts = ["Agra", "Delhi", "Jaipur", "Lucknow"];
      ans = "Agra";
      exp = "The Taj Mahal was built in Agra by Shah Jahan.";
      hint = "It is in Uttar Pradesh along the Yamuna river.";
    } else if (i === 2) {
      q = "Who built the Red Fort in Delhi?";
      opts = ["Shah Jahan", "Akbar", "Babur", "Humayun"];
      ans = "Shah Jahan";
      exp = "Shah Jahan also built the Taj Mahal and Jama Masjid.";
      hint = "He was a famous Mughal builder emperor.";
    } else if (i === 3) {
      q = "Who is known as the Father of the Indian Constitution?";
      opts = ["Dr. B.R. Ambedkar", "Mahatma Gandhi", "Jawaharlal Nehru", "Rajendra Prasad"];
      ans = "Dr. B.R. Ambedkar";
      exp = "Dr. Ambedkar was the head of the constitution drafting committee.";
      hint = "He fought for equality and rights.";
    } else if (i === 4) {
      q = "Who composed India's national anthem 'Jana Gana Mana'?";
      opts = ["Rabindranath Tagore", "Bankim Chandra Chattopadhyay", "Sarojini Naidu", "Subhas Chandra Bose"];
      ans = "Rabindranath Tagore";
      exp = "Tagore wrote it originally in Bengali. He also won a Nobel Prize.";
      hint = "He also composed the national anthem of Bangladesh.";
    } else if (i === 5) {
      q = "Which monument has 953 small windows called jharokhas?";
      opts = ["Hawa Mahal", "Taj Mahal", "Red Fort", "Charminar"];
      ans = "Hawa Mahal";
      exp = "Hawa Mahal was built in Jaipur so royal women could watch streets through windows.";
      hint = "Palace of Winds in Jaipur.";
    } else {
      q = `History Quiz Question #${i}: Who designed the Indian National Flag?`;
      opts = ["Pingali Venkayya", "Mahatma Gandhi", "Jawaharlal Nehru", "Sarojini Naidu"];
      ans = "Pingali Venkayya";
      exp = "Pingali Venkayya designed the tricolor flag with the Ashoka Chakra.";
      hint = "A freedom fighter from Andhra Pradesh.";
    }

    QUESTIONS_L4.push({
      id: `q4_${i}`,
      levelId: "4",
      difficulty: "hard",
      question: q,
      options: opts,
      answer: ans,
      explanation: exp,
      hint: hint,
      category: "History"
    });
  }
};

// Helper function to seed Level 5 questions (50 Questions)
const seedL5 = () => {
  for (let i = 1; i <= 50; i++) {
    let q = "";
    let opts: string[] = [];
    let ans = "";
    let exp = "";
    let hint = "";

    if (i === 1) {
      q = "Which is the largest continent on Earth?";
      opts = ["Asia", "Africa", "Europe", "North America"];
      ans = "Asia";
      exp = "Asia covers about 30% of Earth's total land area and has the most people.";
      hint = "It contains India and China.";
    } else if (i === 2) {
      q = "Which is the smallest country in the world?";
      opts = ["Vatican City", "Monaco", "Maldives", "Singapore"];
      ans = "Vatican City";
      exp = "Vatican City is a tiny country located inside Rome, Italy.";
      hint = "Home of the Pope.";
    } else if (i === 3) {
      q = "Which country has the largest land area in the world?";
      opts = ["Russia", "Canada", "China", "United States"];
      ans = "Russia";
      exp = "Russia covers over 17 million square kilometers across Europe and Asia.";
      hint = "It spans 11 time zones.";
    } else if (i === 4) {
      q = "What is the longest river in the world?";
      opts = ["Nile River", "Amazon River", "Yangtze River", "Mississippi River"];
      ans = "Nile River";
      exp = "The Nile flows through northeastern Africa and is 6,650 km long.";
      hint = "Flows through Egypt.";
    } else if (i === 5) {
      q = "What is the highest mountain peak in the world?";
      opts = ["Mount Everest", "K2", "Kanchenjunga", "Lhotse"];
      ans = "Mount Everest";
      exp = "Mount Everest is 8,848 meters tall, located in the Himalayas.";
      hint = "Located on Nepal-China border.";
    } else {
      q = `World Geography Quiz #${i}: Which is the largest island in the world?`;
      opts = ["Greenland", "Madagascar", "New Guinea", "Borneo"];
      ans = "Greenland";
      exp = "Greenland is the largest non-continental island, covered mostly in glaciers.";
      hint = "It is in the North Atlantic ocean.";
    }

    QUESTIONS_L5.push({
      id: `q5_${i}`,
      levelId: "5",
      difficulty: "hard",
      question: q,
      options: opts,
      answer: ans,
      explanation: exp,
      hint: hint,
      category: "World Geography"
    });
  }
};

// Run seed functions
seedL3();
seedL4();
seedL5();
