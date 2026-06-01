import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Heart, Volume2, HelpCircle, Check, X, Lock, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import './GKExplorer.css';

const playSoundEffect = (type) => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    if (type === 'correct') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } else if (type === 'wrong') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch (e) {}
};

// Complete 5 levels database with image questions parsed by difficulty and Hindi support
const GK_LEVELS = [
  {
    id: 'level1',
    title: '🟢 Level 1: Indian Cities & Nicknames (Easy)',
    title_hi: '🟢 लेवल 1: भारतीय शहर और उपनाम (आसान)',
    desc: 'Match cities to their fun titles like Pink City, Silicon Valley, and Cleanest City!',
    desc_hi: 'शहरों को उनके मजेदार उपनाम जैसे पिंक सिटी, सिलिकॉन वैली और सबसे स्वच्छ शहर से मिलाएं!',
    premium: false,
    color: 'pink',
    flashcards: [
      { q: "Which city is known as the Pink City?", q_hi: "किस शहर को पिंक सिटी के नाम से जाना जाता है?", a: "Jaipur! It was painted pink to welcome Prince Albert in 1876.", a_hi: "जयपुर! 1876 में प्रिंस अल्बर्ट के स्वागत के लिए इसे गुलाबी रंग में रंगा गया था.", icon: "🌸" },
      { q: "Which city is known as the Silicon Valley of India?", q_hi: "किस शहर को भारत की सिलिकॉन वैली कहा जाता है?", a: "Bengaluru! It is the IT and technology hub of the nation.", a_hi: "बेंगलुरु! यह देश का आईटी और टेक्नोलॉजी हब है.", icon: "💻" },
      { q: "Which city is known as the Cleanest City of India?", q_hi: "किस शहर को भारत का सबसे स्वच्छ शहर माना जाता है?", a: "Indore! It has consistently won the cleanest city award for years.", a_hi: "इंदौर! इसने लगातार कई वर्षों तक सबसे स्वच्छ शहर का पुरस्कार जीता है.", icon: "🧹" }
    ],
    questions: [
      { 
        q: "Which city is known as the Pink City?", q_hi: "किस शहर को गुलाबी शहर (Pink City) कहा जाता है?",
        options: ["Jodhpur", "Jaipur", "Udaipur", "Ajmer"], options_hi: ["जोधपुर", "जयपुर", "उदयपुर", "अजमेर"],
        correct: 1, explanation: "Jaipur is globally known as the Pink City due to its dominant pink terracotta buildings.",
        explanation_hi: "गुलाबी रंग की टेराकोटा इमारतों के कारण जयपुर को वैश्विक स्तर पर पिंक सिटी के रूप में जाना जाता है।"
      },
      { 
        q: "Which city is called the Blue City?", q_hi: "किस शहर को नीला शहर (Blue City) कहा जाता है?",
        options: ["Jaipur", "Jaisalmer", "Jodhpur", "Bikaner"], options_hi: ["जयपुर", "जैसलमेर", "जोधपुर", "बीकानेर"],
        correct: 2, explanation: "Jodhpur is called the Blue City because many houses in the old town are painted indigo blue.",
        explanation_hi: "जोधपुर को नीला शहर कहा जाता है क्योंकि पुराने शहर के कई घरों को चमकीले नीले रंग से रंगा गया है।"
      },
      { 
        q: "Which city is known as the White City of India?", q_hi: "किस शहर को भारत का सफेद शहर (White City) कहा जाता है?",
        options: ["Udaipur", "Indore", "Surat", "Mysuru"], options_hi: ["उदयपुर", "इंदौर", "सूरत", "मैसूर"],
        correct: 0, explanation: "Udaipur is the White City because of its stunning white marble palaces and lakes.",
        explanation_hi: "उदयपुर को सफेद संगमरमर के शानदार महलों और झीलों के कारण सफेद शहर कहा जाता है।"
      },
      { 
        q: "Which city is called the Golden City?", q_hi: "किस शहर को स्वर्ण नगरी (Golden City) कहा जाता है?",
        options: ["Jaipur", "Jaisalmer", "Udaipur", "Bhopal"], options_hi: ["जयपुर", "जैसलमेर", "उदयपुर", "भोपाल"],
        correct: 1, explanation: "Jaisalmer is the Golden City because of its yellow sandstone architecture that shines like gold.",
        explanation_hi: "जैसलमेर को गोल्डन सिटी कहा जाता है क्योंकि इसकी पीली बलुआ पत्थर की वास्तुकला सोने की तरह चमकती है।"
      },
      { 
        q: "Which city is known as the Silicon Valley of India?", q_hi: "किस शहर को भारत की सिलिकॉन वैली (Silicon Valley) कहा जाता है?",
        options: ["Hyderabad", "Pune", "Bengaluru", "Chennai"], options_hi: ["हैदराबाद", "पुणे", "बेंगलुरु", "चेन्नई"],
        correct: 2, explanation: "Bengaluru is called the Silicon Valley of India as it is the leading nation-wide IT exporter.",
        explanation_hi: "बेंगलुरु को भारत का आईटी हब होने के कारण भारत की सिलिकॉन वैली कहा जाता है।"
      },
      { 
        q: "Which city is called the Manchester of India?", q_hi: "किस शहर को भारत का मैनचेस्टर (Manchester) कहा जाता है?",
        options: ["Ahmedabad", "Surat", "Mumbai", "Kanpur"], options_hi: ["अहमदाबाद", "सूरत", "मुंबई", "कानपुर"],
        correct: 0, explanation: "Ahmedabad was called the Manchester of India due to its booming textile industries.",
        explanation_hi: "अपने तेजी से बढ़ते कपड़ा उद्योगों के कारण अहमदाबाद को भारत का मैनचेस्टर कहा जाता था।"
      },
      { 
        q: "Which city is known as the City of Joy?", q_hi: "किस शहर को आनंद का शहर (City of Joy) कहा जाता है?",
        options: ["Kolkata", "Mumbai", "Pune", "Patna"], options_hi: ["कोलकाता", "मुंबई", "पुणे", "पटना"],
        correct: 0, explanation: "Kolkata is called the City of Joy because of its rich cultural history and vibrant people.",
        explanation_hi: "कोलकाता को उसके समृद्ध सांस्कृतिक इतिहास और जीवंत लोगों के कारण सिटी ऑफ जॉय कहा जाता है।"
      },
      { 
        q: "Which city is called the 7 Island City?", q_hi: "किस शहर को 7 द्वीपों का शहर (7 Island City) कहा जाता है?",
        options: ["Chennai", "Mumbai", "Kochi", "Goa"], options_hi: ["चेन्नई", "मुंबई", "कोच्चि", "गोवा"],
        correct: 1, explanation: "Mumbai was originally composed of seven marshy islands before being connected.",
        explanation_hi: "मुंबई मूल रूप से आपस में जुड़े सात द्वीपों से मिलकर बना एक शहर था।"
      },
      { 
        q: "Which city is the Yoga Capital of the World?", q_hi: "विश्व की योग राजधानी (Yoga Capital) कौन सा शहर है?",
        options: ["Haridwar", "Rishikesh", "Varanasi", "Dehradun"], options_hi: ["हरिद्वार", "ऋषिकेश", "वाराणसी", "देहरादून"],
        correct: 1, explanation: "Rishikesh is called the Yoga Capital because sages and practitioners gather there on the Ganges.",
        explanation_hi: "ऋषिकेश को योग की राजधानी कहा जाता है क्योंकि वहां गंगा किनारे ऋषि-मुनि और साधक ध्यान लगाते हैं।"
      },
      { 
        q: "Which city is known as the Gateway of India city?", q_hi: "किस शहर को 'गेटवे ऑफ इंडिया' (Gateway of India) का शहर कहा जाता है?",
        options: ["Mumbai", "Delhi", "Goa", "Chennai"], options_hi: ["मुंबई", "दिल्ली", "गोवा", "चेन्नई"],
        correct: 0, explanation: "The iconic monument 'Gateway of India' is located along the coast in Mumbai.",
        explanation_hi: "प्रसिद्ध स्मारक 'गेटवे ऑफ इंडिया' मुंबई के तट पर स्थित है।"
      },
      { 
        q: "Which city is known as the Cleanest City of India?", q_hi: "भारत का सबसे स्वच्छ शहर (Cleanest City) कौन सा है?",
        options: ["Surat", "Indore", "Pune", "Bhopal"], options_hi: ["सूरत", "इंदौर", "पुणे", "भोपाल"],
        correct: 1, explanation: "Indore has consistently secured the 1st rank under Swachh Survekshan rankings.",
        explanation_hi: "स्वच्छ सर्वेक्षण रैंकिंग के तहत इंदौर ने लगातार कई वर्षों से पहला स्थान हासिल किया है।"
      },
      { 
        q: "Which city is the Financial Capital of India?", q_hi: "भारत की वित्तीय राजधानी (Financial Capital) कौन सी है?",
        options: ["Delhi", "Mumbai", "Bengaluru", "Chennai"], options_hi: ["दिल्ली", "मुंबई", "बेंगलुरु", "चेन्नई"],
        correct: 1, explanation: "Mumbai is home to the Reserve Bank of India, BSE, NSE, and major business headquarters.",
        explanation_hi: "मुंबई में भारतीय रिजर्व बैंक, बीएसई, एनएसई और प्रमुख व्यावसायिक मुख्यालय स्थित हैं।"
      },
      { 
        q: "Which city is known as the Orange City?", q_hi: "किस शहर को ऑरेंज सिटी (Orange City) कहा जाता है?",
        options: ["Nagpur", "Nashik", "Pune", "Indore"], options_hi: ["नागपुर", "नाशिक", "पुणे", "इंदौर"],
        correct: 0, explanation: "Nagpur is the Orange City due to its high-quality mandarin oranges grown extensively in the region.",
        explanation_hi: "नागपुर को ऑरेंज सिटी कहा जाता है क्योंकि वहां भारी मात्रा में उच्च गुणवत्ता वाले संतरे उगाए जाते हैं।"
      },
      { 
        q: "Which city is known as the Diamond City?", q_hi: "किस शहर को डायमंड सिटी (Diamond City) कहा जाता है?",
        options: ["Mumbai", "Jaipur", "Surat", "Rajkot"], options_hi: ["मुंबई", "जयपुर", "सूरत", "राजकोट"],
        correct: 2, explanation: "Surat is the Diamond City because over 90% of the world's diamonds are cut and polished there.",
        explanation_hi: "सूरत को डायमंड सिटी कहा जाता है क्योंकि दुनिया के 90% से अधिक हीरों की कटिंग और पॉलिशिंग यहीं होती है।"
      },
      { 
        q: "Which city is called the Garden City of India?", q_hi: "किस शहर को भारत का गार्डन सिटी (Garden City) कहा जाता है?",
        options: ["Bengaluru", "Mysuru", "Shimla", "Dehradun"], options_hi: ["बेंगलुरु", "मैसूर", "शिमला", "देहरादून"],
        correct: 0, explanation: "Bengaluru earned this name due to its lush parks, green cover, and beautiful gardens like Lalbagh.",
        explanation_hi: "लालबाग जैसे सुंदर पार्कों और हरियाली के कारण बेंगलुरु को गार्डन सिटी कहा जाता है।"
      }
    ]
  },
  {
    id: 'level2',
    title: '🟡 Level 2: States, Leaders & Firsts (Medium)',
    title_hi: '🟡 लेवल 2: राज्य, नेता और प्रथम (मध्यम)',
    desc: 'Test your knowledge on Indian states, historical leaders, and proud Indian achievements!',
    desc_hi: 'भारतीय राज्यों, ऐतिहासिक नेताओं और गौरवशाली भारतीय उपलब्धियों पर अपने ज्ञान का परीक्षण करें!',
    premium: false,
    color: 'blue',
    flashcards: [
      { q: "Who is known as the Missile Man of India?", q_hi: "भारत के मिसाइल मैन के रूप में किसे जाना जाता है?", a: "Dr. A.P.J. Abdul Kalam! He was a brilliant scientist and India's 11th President.", a_hi: "डॉ. ए.पी.जे. अब्दुल कलाम! वे एक महान वैज्ञानिक और भारत के 11वें राष्ट्रपति थे.", icon: "🚀" },
      { q: "What was India's first satellite?", q_hi: "भारत का पहला उपग्रह कौन सा था?", a: "Aryabhata! Built by ISRO, it was launched in 1975.", a_hi: "आर्यभट्ट! इसरो द्वारा निर्मित इस उपग्रह को 1975 में लॉन्च किया गया था.", icon: "🛰️" },
      { q: "Which state is known as the Spice Garden of India?", q_hi: "किस राज्य को भारत का मसालों का बगीचा कहा जाता है?", a: "Kerala! It has been famous for pepper, cardamom, and cinnamon for centuries.", a_hi: "केरल! यह सदियों से काली मिर्च, इलायची और दालचीनी के लिए प्रसिद्ध है.", icon: "🌿" }
    ],
    questions: [
      { 
        q: "Which state is the most populated in India?", q_hi: "भारत में सबसे अधिक जनसंख्या वाला राज्य कौन सा है?",
        options: ["Bihar", "Maharashtra", "Uttar Pradesh", "Rajasthan"], options_hi: ["बिहार", "महाराष्ट्र", "उत्तर प्रदेश", "राजस्थान"],
        correct: 2, explanation: "Uttar Pradesh is the most populous state in India with over 200 million residents.",
        explanation_hi: "उत्तर प्रदेश भारत में 20 करोड़ से अधिक निवासियों के साथ सबसे अधिक जनसंख्या वाला राज्य है।"
      },
      { 
        q: "Who is known as the Missile Man of India?", q_hi: "भारत के मिसाइल मैन (Missile Man) के रूप में किसे जाना जाता है?",
        options: ["Vikram Sarabhai", "APJ Abdul Kalam", "Homi Bhabha", "CV Raman"], options_hi: ["विक्रम साराभाई", "एपीजे अब्दुल कलाम", "होमी भाभा", "सीवी रमन"],
        correct: 1, explanation: "Dr. APJ Abdul Kalam earned the title for his pioneering work on ballistic missile development.",
        explanation_hi: "डॉ. एपीजे अब्दुल कलाम को बैलिस्टिक मिसाइल विकास पर उनके अग्रणी कार्य के लिए यह उपाधि मिली।"
      },
      { 
        q: "What was India's first satellite?", q_hi: "भारत का पहला उपग्रह (First Satellite) कौन सा था?",
        options: ["INSAT", "Aryabhata", "Rohini", "GSAT"], options_hi: ["इंसैट", "आर्यभट्ट", "रोहिणी", "जीसैट"],
        correct: 1, explanation: "Aryabhata was India's first satellite, named after the famous Indian astronomer.",
        explanation_hi: "आर्यभट्ट भारत का पहला उपग्रह था, जिसका नाम प्रसिद्ध भारतीय खगोलशास्त्री के नाम पर रखा गया था।"
      },
      { 
        q: "What was India's first missile?", q_hi: "भारत की पहली मिसाइल (First Missile) कौन सी थी?",
        options: ["Agni", "Prithvi", "Trishul", "Project Devil"], options_hi: ["अग्नि", "पृथ्वी", "त्रिशूल", "प्रोजेक्ट डेविल"],
        correct: 1, explanation: "Prithvi was India's first single-stage liquid-fueled surface-to-surface ballistic missile.",
        explanation_hi: "पृथ्वी भारत की पहली एकल-चरण तरल-ईंधन वाली सतह-से-सतह बैलिस्टिक मिसाइल थी।"
      },
      { 
        q: "Which state is known as the Spice Garden of India?", q_hi: "किस राज्य को भारत का मसाला उद्यान (Spice Garden) कहा जाता है?",
        options: ["Kerala", "Goa", "Sikkim", "Assam"], options_hi: ["केरल", "गोवा", "सिक्किम", "असम"],
        correct: 0, explanation: "Kerala is globally famous for its diverse, rich, and high-quality spice plantations.",
        explanation_hi: "केरल वैश्विक स्तर पर अपने विविध, समृद्ध और उच्च गुणवत्ता वाले मसालों के बागानों के लिए प्रसिद्ध है।"
      },
      { 
        q: "Who is the current Prime Minister of India?", q_hi: "भारत के वर्तमान प्रधानमंत्री कौन हैं?",
        options: ["Amit Shah", "Narendra Modi", "Rahul Gandhi", "Rajnath Singh"], options_hi: ["अमित शाह", "नरेंद्र मोदी", "राहुल गांधी", "राजनाथ सिंह"],
        correct: 1, explanation: "Narendra Modi has been serving as the Prime Minister of India since 2014.",
        explanation_hi: "नरेंद्र मोदी 2014 से भारत के प्रधानमंत्री के रूप में कार्य कर रहे हैं।"
      },
      { 
        q: "Who was the first Prime Minister of India?", q_hi: "भारत के पहले प्रधानमंत्री कौन थे?",
        options: ["Mahatma Gandhi", "Sardar Patel", "Jawaharlal Nehru", "Rajendra Prasad"], options_hi: ["महात्मा गांधी", "सरदार पटेल", "जवाहरलाल नेहरू", "राजेन्द्र प्रसाद"],
        correct: 2, explanation: "Pandit Jawaharlal Nehru took office as the first Prime Minister on Independence Day in 1947.",
        explanation_hi: "पंडित जवाहरलाल नेहरू ने 1947 में स्वतंत्रता दिवस पर पहले प्रधानमंत्री के रूप में पदभार संभाला था।"
      },
      { 
        q: "Who was the first woman Prime Minister of India?", q_hi: "भारत की पहली महिला प्रधानमंत्री कौन थीं?",
        options: ["Sarojini Naidu", "Indira Gandhi", "Pratibha Patil", "Sonia Gandhi"], options_hi: ["सरोजिनी नायडू", "इंदिरा गांधी", "प्रतिभा पाटिल", "सोनिया गांधी"],
        correct: 1, explanation: "Indira Gandhi served as the first and, to date, the only female Prime Minister of India.",
        explanation_hi: "इंदिरा गांधी भारत की पहली और आज तक की एकमात्र महिला प्रधानमंत्री थीं।"
      },
      { 
        q: "Who is the current President of India?", q_hi: "भारत की वर्तमान राष्ट्रपति कौन हैं?",
        options: ["Droupadi Murmu", "Narendra Modi", "Pratibha Patil", "S Jaishankar"], options_hi: ["द्रौपदी मुर्मू", "नरेंद्र मोदी", "प्रतिभा पाटिल", "एस जयशंकर"],
        correct: 0, explanation: "Droupadi Murmu assumed office as the 15th President of India in July 2022.",
        explanation_hi: "द्रौपदी मुर्मू ने जुलाई 2022 में भारत के 15वें राष्ट्रपति के रूप में पदभार ग्रहण किया था।"
      },
      { 
        q: "Who was the first President of India?", q_hi: "भारत के पहले राष्ट्रपति कौन थे?",
        options: ["Dr. Rajendra Prasad", "Zakir Hussain", "APJ Abdul Kalam", "VV Giri"], options_hi: ["डॉ. राजेन्द्र प्रसाद", "जाकिर हुसैन", "एपीजे अब्दुल कलाम", "वीवी गिरी"],
        correct: 0, explanation: "Dr. Rajendra Prasad was elected as the first President when India became a Republic in 1950.",
        explanation_hi: "1950 में भारत के गणतंत्र बनने पर डॉ. राजेंद्र प्रसाद को पहले राष्ट्रपति के रूप में चुना गया था।"
      }
    ]
  },
  {
    id: 'level3',
    title: '🔮 Level 3: Space & Planet Explorations (Medium)',
    title_hi: '🔮 लेवल 3: अंतरिक्ष और ग्रह खोज (मध्यम)',
    desc: 'Launch into orbit! Quizzes on the planets, speed of light, cosmic facts, and planetary records.',
    desc_hi: 'कक्षा में लॉन्च करें! ग्रहों, प्रकाश की गति, ब्रह्मांडीय तथ्यों और ग्रहों के रिकॉर्ड पर प्रश्नोत्तरी।',
    premium: true,
    color: 'purple',
    flashcards: [
      { q: "What is the hottest planet in our solar system?", q_hi: "हमारे सौर मंडल का सबसे गर्म ग्रह कौन सा है?", a: "Venus! Thick clouds of carbon dioxide trap the heat, making it up to 900°F!", a_hi: "शुक्र! कार्बन डाइऑक्साइड के घने बादल गर्मी को रोक लेते हैं, जिससे यह 900°F तक गर्म हो जाता है!", icon: "🔥" },
      { q: "Which planet is known as the Red Planet?", q_hi: "किस ग्रह को लाल ग्रह के नाम से जाना जाता है?", a: "Mars! Its surface is covered in iron oxide, which is basically rust.", a_hi: "मंगल! इसकी सतह आयरन ऑक्साइड से ढकी है, जो मूल रूप से जंग है.", icon: "🔴" }
    ],
    questions: [
      { 
        q: "What is the hottest planet in our solar system?", q_hi: "हमारे सौर मंडल का सबसे गर्म ग्रह कौन सा है?",
        options: ["Mercury", "Venus", "Earth", "Saturn"], options_hi: ["बुध", "शुक्र", "पृथ्वी", "शनि"],
        correct: 1, explanation: "Venus is the hottest because its thick atmosphere traps heat like a greenhouse.",
        explanation_hi: "शुक्र सबसे गर्म है क्योंकि इसका घना वायुमंडल ग्रीनहाउस की तरह गर्मी को सोख लेता है।"
      },
      { 
        q: "Which planet is known as the Red Planet?", q_hi: "किस ग्रह को लाल ग्रह के रूप में जाना जाता है?",
        options: ["Venus", "Mars", "Jupiter", "Neptune"], options_hi: ["शुक्र", "मंगल", "बृहस्पति", "वरुण"],
        correct: 1, explanation: "Mars is reddish because its dust has lots of iron oxide (rust).",
        explanation_hi: "मंगल लाल है क्योंकि इसकी धूल में बहुत सारा आयरन ऑक्साइड (जंग) मौजूद है।"
      },
      { 
        q: "Which is the largest planet in our solar system?", q_hi: "हमारे सौर मंडल का सबसे बड़ा ग्रह कौन सा है?",
        options: ["Earth", "Mars", "Jupiter", "Uranus"], options_hi: ["पृथ्वी", "मंगल", "बृहस्पति", "अरुण"],
        correct: 2, explanation: "Jupiter is so huge that over 1,300 Earths could fit inside it.",
        explanation_hi: "बृहस्पति इतना विशाल है कि इसके अंदर 1,300 से अधिक पृथ्वी समा सकती हैं।"
      },
      { 
        q: "How long does it take for light from the Sun to reach Earth?", q_hi: "सूर्य के प्रकाश को पृथ्वी तक पहुँचने में कितना समय लगता है?",
        options: ["8 seconds", "8 minutes", "8 hours", "Immediate"], options_hi: ["8 सेकंड", "8 मिनट", "8 घंटे", "तुरंत"],
        correct: 1, explanation: "Light travels at 186,000 miles per second, taking about 8 minutes and 20 seconds to reach Earth.",
        explanation_hi: "प्रकाश 1,86,000 मील प्रति सेकंड की गति से यात्रा करता है, जिसे पृथ्वी तक पहुँचने में लगभग 8 मिनट 20 सेकंड लगते हैं।"
      },
      { 
        q: "Which planet is closest to the Sun?", q_hi: "सूर्य के सबसे निकट का ग्रह कौन सा है?",
        options: ["Mercury", "Venus", "Earth", "Mars"], options_hi: ["बुध", "शुक्र", "पृथ्वी", "मंगल"],
        correct: 0, explanation: "Mercury is the closest planet to the Sun, but it is not the hottest.",
        explanation_hi: "बुध सूर्य के सबसे निकट का ग्रह है, लेकिन यह सबसे गर्म नहीं है।"
      }
    ]
  },
  {
    id: 'level4',
    title: '🛡️ Level 4: Indian History & Monuments (Hard)',
    title_hi: '🛡️ लेवल 4: भारतीय इतिहास और स्मारक (कठिन)',
    desc: 'Unearth stories of historic temples, freedom fighters, and landmarks across India.',
    desc_hi: 'पूरे भारत में ऐतिहासिक मंदिरों, स्वतंत्रता सेनानियों और स्मारकों की कहानियों को जानें।',
    premium: true,
    color: 'orange',
    flashcards: [
      { q: "Who composed the national anthem of India?", q_hi: "भारत के राष्ट्रगान की रचना किसने की?", a: "Rabindranath Tagore! He also won the Nobel Prize in Literature.", a_hi: "रवींद्रनाथ टैगोर! उन्होंने साहित्य का नोबेल पुरस्कार भी जीता था.", icon: "🎵" },
      { q: "When did India gain independence from British rule?", q_hi: "भारत को ब्रिटिश शासन से स्वतंत्रता कब मिली?", a: "On August 15, 1947! It is celebrated every year as Independence Day.", a_hi: "15 अगस्त 1947 को! इसे हर साल स्वतंत्रता दिवस के रूप में मनाया जाता है.", icon: "🇮🇳" }
    ],
    questions: [
      { 
        q: "Who is known as the Father of the Nation in India?", q_hi: "भारत में राष्ट्रपिता के रूप में किसे जाना जाता है?",
        options: ["Jawaharlal Nehru", "Subhas Chandra Bose", "Mahatma Gandhi", "Bhagat Singh"], options_hi: ["जवाहरलाल नेहरू", "सुभाष चंद्र बोस", "महात्मा गांधी", "भगत सिंह"],
        correct: 2, explanation: "Mahatma Gandhi was given this title for leading the non-violent struggle for India's freedom.",
        explanation_hi: "भारत की आज़ादी के लिए अहिंसक संघर्ष का नेतृत्व करने के लिए महात्मा गांधी को यह उपाधि दी गई थी।"
      },
      { 
        q: "Who composed the National Anthem of India?", q_hi: "भारत के राष्ट्रगान 'जन गण मन' की रचना किसने की?",
        options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Swami Vivekananda"], options_hi: ["बंकिम चंद्र चटर्जी", "रवींद्रनाथ टैगोर", "सरोजिनी नायडू", "स्वामी विवेकानंद"],
        correct: 1, explanation: "Rabindranath Tagore originally wrote the song as Bharoto Bhagyo Bidhata in Bengali.",
        explanation_hi: "रवींद्रनाथ टैगोर ने मूल रूप से बंगाली में 'भारतो भाग्यो बिधाता' के रूप में गीत लिखा था।"
      },
      { 
        q: "In which year did India declare itself a Republic?", q_hi: "भारत ने किस वर्ष स्वयं को गणतंत्र घोषित किया?",
        options: ["1947", "1948", "1950", "1952"], options_hi: ["1947", "1948", "1950", "1952"],
        correct: 2, explanation: "India became a Republic on January 26, 1950, when the Constitution of India came into effect.",
        explanation_hi: "26 जनवरी 1950 को भारत एक गणतंत्र बना, जब भारत का संविधान लागू हुआ।"
      },
      { 
        q: "Which emperor built the Taj Mahal in Agra?", q_hi: "आगरा में ताजमहल का निर्माण किस सम्राट ने करवाया था?",
        options: ["Akbar", "Shah Jahan", "Babur", "Aurangzeb"], options_hi: ["अकबर", "शाहजहाँ", "बाबर", "औरंगज़ेब"],
        correct: 1, explanation: "Shah Jahan built the white marble monument in memory of his beloved wife Mumtaz Mahal.",
        explanation_hi: "शाहजहाँ ने अपनी प्रिय पत्नी मुमताज़ महल की याद में इस सफेद संगमरमर के स्मारक का निर्माण करवाया था।"
      },
      { 
        q: "Who designed the national flag of India?", q_hi: "भारत के राष्ट्रीय ध्वज को किसने डिजाइन किया था?",
        options: ["Pingali Venkayya", "Rabindranath Tagore", "Sardar Patel", "Lal Bahadur Shastri"], options_hi: ["पिंगली वेंकैया", "रवींद्रनाथ टैगोर", "सरदार पटेल", "लाल बहादुर शास्त्री"],
        correct: 0, explanation: "Pingali Venkayya designed the flag, which was adopted in its current form in July 1947.",
        explanation_hi: "पिंगली वेंकैया ने ध्वज को डिजाइन किया था, जिसे जुलाई 1947 में इसके वर्तमान रूप में अपनाया गया था।"
      }
    ]
  },
  {
    id: 'level5',
    title: '🌍 Level 5: World Geography & Records (Expert)',
    title_hi: '🌍 लेवल 5: विश्व भूगोल और रिकॉर्ड (विशेषज्ञ)',
    desc: 'Travel the world! Advanced trivia on massive oceans, global wonders, and continents.',
    desc_hi: 'दुनिया की यात्रा करें! विशाल महासागरों, वैश्विक अजूबों और महाद्वीपों पर उन्नत सामान्य ज्ञान।',
    premium: true,
    color: 'green',
    flashcards: [
      { q: "What is the tallest mountain above sea level?", q_hi: "समुद्र तल से ऊपर सबसे ऊँचा पर्वत कौन सा है?", a: "Mount Everest! Standing at 29,031 feet high in the Himalayas.", a_hi: "माउंट एवरेस्ट! यह हिमालय में 29,031 फीट की ऊंचाई पर स्थित है.", icon: "🏔️" },
      { q: "Which river is the longest in the world?", q_hi: "विश्व की सबसे लम्बी नदी कौन सी है?", a: "The Nile River in Africa! It stretches over 4,130 miles.", a_hi: "अफ्रीका में नील नदी! यह 4,130 मील से अधिक लंबी है.", icon: "🌊" }
    ],
    questions: [
      { 
        q: "Which is the largest ocean in the world?", q_hi: "विश्व का सबसे बड़ा महासागर कौन सा है?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"], options_hi: ["अटलांटिक महासागर", "हिंद महासागर", "प्रशांत महासागर", "आर्कटिक महासागर"],
        correct: 2, explanation: "The Pacific Ocean is the largest, covering over 30% of the Earth's surface.",
        explanation_hi: "प्रशांत महासागर सबसे बड़ा है, जो पृथ्वी की सतह के 30% से अधिक हिस्से को कवर करता है।"
      },
      { 
        q: "Which is the largest island in the world?", q_hi: "विश्व का सबसे बड़ा द्वीप (Island) कौन सा है?",
        options: ["Greenland", "Madagascar", "Borneo", "Sri Lanka"], options_hi: ["ग्रीनलैंड", "मेडागास्कर", "बोर्नियो", "श्रीलंका"],
        correct: 0, explanation: "Greenland is the largest island, while Australia is classified as a continent.",
        explanation_hi: "ग्रीनलैंड सबसे बड़ा द्वीप है, जबकि ऑस्ट्रेलिया को एक महाद्वीप के रूप में वर्गीकृत किया गया है।"
      },
      { 
        q: "Which country is home to the Eiffel Tower?", q_hi: "एफिल टॉवर किस देश में स्थित है?",
        options: ["Italy", "Germany", "France", "Spain"], options_hi: ["इटली", "जर्मनी", "फ्रांस", "स्पेन"],
        correct: 2, explanation: "The Eiffel Tower is located in Paris, the capital city of France.",
        explanation_hi: "एफिल टॉवर फ्रांस की राजधानी पेरिस में स्थित है।"
      },
      { 
        q: "Which is the largest continent on Earth?", q_hi: "पृथ्वी का सबसे बड़ा महाद्वीप कौन सा है?",
        options: ["North America", "Africa", "Europe", "Asia"], options_hi: ["उत्तरी अमेरिका", "अफ्रीका", "यूरोप", "एशिया"],
        correct: 3, explanation: "Asia is the largest continent in both area size and population.",
        explanation_hi: "क्षेत्रफल और जनसंख्या दोनों दृष्टि से एशिया सबसे बड़ा महाद्वीप है।"
      },
      { 
        q: "What is the capital of France?", q_hi: "फ्रांस की राजधानी क्या है?",
        options: ["Rome", "Berlin", "Paris", "Madrid"], options_hi: ["रोम", "बर्लिन", "पेरिस", "मैड्रिड"],
        correct: 2, explanation: "Paris is the capital of France, famous for arts, fashion, and monuments.",
        explanation_hi: "पेरिस फ्रांस की राजधानी है, जो कला, फैशन और स्मारकों के लिए प्रसिद्ध है।"
      }
    ]
  }
];

export default function GKExplorer({ addXp, isPro }) {
  const [activeCategory, setActiveCategory] = useState('level1');
  const [activeView, setActiveView] = useState('menu'); 
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  // Voice Synthesis settings
  const [speakLang, setSpeakLang] = useState('en'); // 'en' or 'hi'
  
  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [quizOver, setQuizOver] = useState(false);
  const [quizSuccess, setQuizSuccess] = useState(false);

  const category = GK_LEVELS.find(c => c.id === activeCategory) || GK_LEVELS[0];

  // Stop speech synthesis on state transitions
  useEffect(() => {
    return () => {
      try {
        window.speechSynthesis.cancel();
      } catch(e) {}
    };
  }, [activeView, quizIdx, flashcardIdx]);

  // Voice Reader Engine
  const handleReadAloud = (textToSpeak, customLang = speakLang) => {
    try {
      window.speechSynthesis.cancel(); 
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = customLang === 'hi' ? 'hi-IN' : 'en-US';
      utterance.rate = 0.85; 
      utterance.pitch = 1.1; 
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.log("Speech blocked or unsupported");
    }
  };

  const startQuiz = (catId) => {
    const targetCat = GK_LEVELS.find(c => c.id === catId);
    if (targetCat.premium && !isPro) {
      window.location.hash = '#paywall';
      return;
    }
    setActiveCategory(catId);
    setActiveView('quiz');
    setQuizIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setLives(3);
    setScore(0);
    setStreak(0);
    setQuizOver(false);
    setQuizSuccess(false);
  };

  const startFlashcards = (catId) => {
    setActiveCategory(catId);
    setActiveView('flashcards');
    setFlashcardIdx(0);
    setCardFlipped(false);
  };

  const handleAnswerClick = (optionIdx) => {
    if (isAnswered) return;
    setSelectedOption(optionIdx);
    setIsAnswered(true);

    const activeQuestion = category.questions[quizIdx];
    if (optionIdx === activeQuestion.correct) {
      playSoundEffect('correct');
      setScore(s => s + 10);
      setStreak(st => st + 1);
      addXp(15 + (streak > 2 ? 5 : 0)); 
    } else {
      playSoundEffect('wrong');
      setLives(l => {
        const remaining = l - 1;
        if (remaining <= 0) {
          setQuizOver(true);
        }
        return remaining;
      });
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (quizIdx < category.questions.length - 1) {
      setQuizIdx(idx => idx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizSuccess(true);
      playQuizEndConfetti();
      addXp(50); 
    }
  };

  const playQuizEndConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });
  };

  return (
    <div className="gk-container">
      {/* Bilingual Language Switch Header */}
      <div className="language-selector-tab-header">
        <span className="lang-label-prefix">🗣️ Reader Language: </span>
        <button 
          className={`lang-pill-btn ${speakLang === 'en' ? 'active' : ''}`}
          onClick={() => { setSpeakLang('en'); try { window.speechSynthesis.cancel(); } catch(e){} }}
        >
          🇬🇧 English
        </button>
        <button 
          className={`lang-pill-btn ${speakLang === 'hi' ? 'active' : ''}`}
          onClick={() => { setSpeakLang('hi'); try { window.speechSynthesis.cancel(); } catch(e){} }}
        >
          🇮🇳 हिंदी (Hindi)
        </button>
      </div>

      {activeView === 'menu' && (
        <div className="gk-header">
          <h1 className="gk-title">
            <span className="text-gradient-purple">
              {speakLang === 'hi' ? "जीके ब्रायनी एक्सप्लोरर" : "GK Brainy Explorer"}
            </span> 🧠
          </h1>
          <p className="gk-subtitle">
            {speakLang === 'hi' 
              ? "मज़ेदार इंटरैक्टिव क्विज़ और गेम के साथ अपने ज्ञान को बढ़ाएं!" 
              : "Level up your General Knowledge with fun interactive trivia and games!"}
          </p>
        </div>
      )}

      {/* VIEW: MAIN PROGRESSIVE LEVELS SELECTION */}
      {activeView === 'menu' && (
        <div className="gk-grid">
          {GK_LEVELS.map((cat) => {
            const isLocked = cat.premium && !isPro;
            return (
              <div 
                key={cat.id} 
                className={`card-premium gk-category-card ${cat.color} ${isLocked ? 'locked' : ''}`}
              >
                {isLocked && (
                  <div className="card-lock-badge">
                    <Lock size={16} /> Locked
                  </div>
                )}
                <div className="gk-cat-icon">
                  {cat.id === 'level1' && '🟢'}
                  {cat.id === 'level2' && '🟡'}
                  {cat.id === 'level3' && '🔮'}
                  {cat.id === 'level4' && '🛡️'}
                  {cat.id === 'level5' && '🌍'}
                </div>
                <h3>{speakLang === 'hi' ? cat.title_hi : cat.title}</h3>
                <p>{speakLang === 'hi' ? cat.desc_hi : cat.desc}</p>
                
                <div className="gk-card-actions">
                  <button 
                    className="btn-bouncy blue btn-gk"
                    onClick={() => startFlashcards(cat.id)}
                  >
                    {speakLang === 'hi' ? "📖 फ्लैशकार्ड्स" : "📖 Learn Cards"}
                  </button>
                  <button 
                    className={`btn-bouncy ${cat.color} btn-gk`}
                    onClick={() => startQuiz(cat.id)}
                  >
                    {isLocked 
                      ? (speakLang === 'hi' ? "🔒 क्विज़ खेलें" : "🔒 Play Quiz") 
                      : (speakLang === 'hi' ? "🏆 क्विज़ खेलें" : "🏆 Play Quiz")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW: INTERACTIVE FLASHCARDS */}
      {activeView === 'flashcards' && (
        <div className="gk-flashcards-pane">
          <button className="btn-back-menu" onClick={() => setActiveView('menu')}>
            {speakLang === 'hi' ? "← श्रेणियों पर वापस जाएं" : "← Back to Categories"}
          </button>
          
          <div className="flashcard-arena">
            <div className="flashcard-counter">
              {speakLang === 'hi' 
                ? `कार्ड ${flashcardIdx + 1} का ${category.flashcards.length}`
                : `Card ${flashcardIdx + 1} of ${category.flashcards.length}`}
            </div>

            <div 
              className={`flashcard-wrapper ${cardFlipped ? 'flipped' : ''}`}
              onClick={() => setCardFlipped(!cardFlipped)}
            >
              {/* Card Front */}
              <div className="flashcard-face flashcard-front">
                <div className="card-deco-stars">✨ ⭐</div>
                <div className="flashcard-icon-big">{category.flashcards[flashcardIdx].icon}</div>
                <h2 className="flashcard-question-text">
                  {speakLang === 'hi' ? category.flashcards[flashcardIdx].q_hi : category.flashcards[flashcardIdx].q}
                </h2>
                
                {/* Speaker button */}
                <button 
                  className="btn-audio-speak-round"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadAloud(
                      speakLang === 'hi' 
                        ? category.flashcards[flashcardIdx].q_hi 
                        : category.flashcards[flashcardIdx].q
                    );
                  }}
                >
                  <Volume2 size={16} />
                </button>

                <div className="click-hint-badge">
                  {speakLang === 'hi' ? "👆 जवाब देखने के लिए टैप करें!" : "👆 Tap to flip and find out!"}
                </div>
              </div>
              
              {/* Card Back */}
              <div className="flashcard-face flashcard-back">
                <div className="card-deco-stars">💡 🎉</div>
                <h3>{speakLang === 'hi' ? "रोचक तथ्य:" : "Interesting Fact:"}</h3>
                <p className="flashcard-answer-text">
                  {speakLang === 'hi' ? category.flashcards[flashcardIdx].a_hi : category.flashcards[flashcardIdx].a}
                </p>

                {/* Speaker button */}
                <button 
                  className="btn-audio-speak-round back-audio"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReadAloud(
                      speakLang === 'hi' 
                        ? category.flashcards[flashcardIdx].a_hi 
                        : category.flashcards[flashcardIdx].a
                    );
                  }}
                >
                  <Volume2 size={16} />
                </button>

                <div className="click-hint-badge">
                  {speakLang === 'hi' ? "🔄 पीछे वापस जाने के लिए टैप करें" : "🔄 Tap to flip back"}
                </div>
              </div>
            </div>

            <div className="flashcard-navigation">
              <button 
                className="btn-bouncy blue"
                disabled={flashcardIdx === 0}
                onClick={() => { setFlashcardIdx(i => i - 1); setCardFlipped(false); }}
              >
                {speakLang === 'hi' ? "पीछे" : "Previous"}
              </button>
              
              {flashcardIdx < category.flashcards.length - 1 ? (
                <button 
                  className="btn-bouncy purple"
                  onClick={() => { setFlashcardIdx(i => i + 1); setCardFlipped(false); }}
                >
                  {speakLang === 'hi' ? "अगला तथ्य 📖" : "Next Fact 📖"}
                </button>
              ) : (
                <button 
                  className="btn-bouncy green animate-pulse"
                  onClick={() => startQuiz(category.id)}
                >
                  {speakLang === 'hi' ? "🎯 चलो क्विज़ खेलें!" : "🎯 Let's Play the Quiz!"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: GAMIFIED QUIZ ARENA */}
      {activeView === 'quiz' && (
        <div className="gk-quiz-pane">
          {/* Quiz Top Bar */}
          <div className="quiz-top-bar">
            <button className="btn-exit-quiz" onClick={() => setActiveView('menu')}>
              {speakLang === 'hi' ? "🚪 बाहर" : "🚪 Exit"}
            </button>
            <div className="quiz-category-badge">
              {speakLang === 'hi' ? category.title_hi : category.title}
            </div>
            
            <div className="quiz-stats-group">
              <div className="lives-holder">
                {[1, 2, 3].map((heartIdx) => (
                  <Heart 
                    key={heartIdx} 
                    size={24} 
                    className={`heart-icon ${heartIdx <= lives ? 'alive' : 'dead'}`} 
                  />
                ))}
              </div>
              
              {streak >= 2 && (
                <div className="streak-indicator animate-float">
                  <Flame size={20} fill="#ff7f50" color="#ff4757" />
                  <span>{streak}x {speakLang === 'hi' ? "लगातार!" : "Streak!"}</span>
                </div>
              )}

              <div className="xp-score-pill">
                ⭐ {score} Pts
              </div>
            </div>
          </div>

          {/* Quiz Interface Container */}
          {!quizOver && !quizSuccess ? (
            <div className="card-premium quiz-card animate-float">
              <div className="quiz-progress-bar-container">
                <div 
                  className="quiz-progress-bar"
                  style={{ width: `${((quizIdx + (isAnswered ? 1 : 0)) / category.questions.length) * 100}%` }}
                ></div>
              </div>

              <div className="quiz-question-header">
                <span className="question-number">
                  {speakLang === 'hi' 
                    ? `प्रश्न ${quizIdx + 1} का ${category.questions.length}` 
                    : `Question ${quizIdx + 1} of ${category.questions.length}`}
                </span>
                
                {/* Voice Row */}
                <div className="quiz-question-voice-row">
                  <h2>
                    {speakLang === 'hi' ? category.questions[quizIdx].q_hi : category.questions[quizIdx].q}
                  </h2>
                  <button 
                    className="btn-audio-speak-round inline-speak"
                    onClick={() => {
                      handleReadAloud(
                        speakLang === 'hi' 
                          ? category.questions[quizIdx].q_hi 
                          : category.questions[quizIdx].q
                      );
                    }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              </div>

              <div className="quiz-options-list">
                {category.questions[quizIdx].options.map((option, optIdx) => {
                  let optClass = '';
                  if (isAnswered) {
                    if (optIdx === category.questions[quizIdx].correct) {
                      optClass = 'correct';
                    } else if (selectedOption === optIdx) {
                      optClass = 'wrong';
                    } else {
                      optClass = 'disabled';
                    }
                  } else if (selectedOption === optIdx) {
                    optClass = 'selected';
                  }

                  const optionText = speakLang === 'hi' 
                    ? category.questions[quizIdx].options_hi[optIdx] 
                    : option;

                  return (
                    <button 
                      key={optIdx}
                      className={`quiz-option-btn ${optClass}`}
                      disabled={isAnswered}
                      onClick={() => handleAnswerClick(optIdx)}
                    >
                      <span className="option-index">{['A', 'B', 'C', 'D'][optIdx]}</span>
                      <span className="option-text">{optionText}</span>
                      {isAnswered && optIdx === category.questions[quizIdx].correct && <Check size={20} className="status-indicator-icon" />}
                      {isAnswered && selectedOption === optIdx && optIdx !== category.questions[quizIdx].correct && <X size={20} className="status-indicator-icon" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isAnswered && (
                <div className={`explanation-box animate-float ${selectedOption === category.questions[quizIdx].correct ? 'correct' : 'wrong'}`}>
                  💡 <strong>{speakLang === 'hi' ? "क्या आप जानते थे?" : "Did You Know?"}</strong>{' '}
                  {speakLang === 'hi' ? category.questions[quizIdx].explanation_hi : category.questions[quizIdx].explanation}
                  
                  <button 
                    className="btn-speak-explanation-inline"
                    onClick={() => {
                      handleReadAloud(
                        speakLang === 'hi' 
                          ? category.questions[quizIdx].explanation_hi 
                          : category.questions[quizIdx].explanation
                      );
                    }}
                  >
                    🔊 {speakLang === 'hi' ? "बोलकर बताएं" : "Read Aloud"}
                  </button>
                </div>
              )}

              {isAnswered && (
                <button 
                  className="btn-bouncy purple btn-quiz-next animate-pulse"
                  onClick={handleNextQuestion}
                >
                  {quizIdx < category.questions.length - 1 
                    ? (speakLang === 'hi' ? "अगला प्रश्न" : "Next Question") 
                    : (speakLang === 'hi' ? "परिणाम देखें" : "View Results")}
                </button>
              )}
            </div>
          ) : quizOver ? (
            <div className="card-premium quiz-result-card fail-state">
              <div className="result-icon-face">😢</div>
              <h2>{speakLang === 'hi' ? "ओह नहीं! सारे दिल खत्म हो गए!" : "Oh No! Out of Lives!"}</h2>
              <p>
                {speakLang === 'hi' 
                  ? "आपने शानदार प्रयास किया, लेकिन सभी दिल खत्म हो गए। चलो फिर से कोशिश करें!"
                  : "You did a great job trying, but you ran out of hearts. Let's give it another shot!"}
              </p>
              
              <div className="score-summary-pill">
                {speakLang === 'hi' ? `आपका स्कोर: ${score} अंक` : `You Scored: ${score} Points`}
              </div>
              
              <button 
                className="btn-bouncy pink btn-retry-quiz"
                onClick={() => startQuiz(category.id)}
              >
                🔄 {speakLang === 'hi' ? "फिर से खेलें" : "Retry Quiz"}
              </button>
            </div>
          ) : (
            <div className="card-premium quiz-result-card success-state">
              <div className="result-icon-face">🏆</div>
              <h2>
                {speakLang === 'hi' ? "अद्भुत! क्विज़ पूरा हुआ!" : "Spectacular! Quiz Completed!"}
              </h2>
              <p>
                {speakLang === 'hi' 
                  ? "आप एक सच्चे जीके जीनियस हैं! आपने इस विषय में महारत हासिल कर ली!"
                  : "You are a true GK Genius! You mastered this entire topic!"}
              </p>
              
              <div className="stats-results-row">
                <div className="stat-result-box">
                  <span className="label">{speakLang === 'hi' ? "अर्जित अंक" : "Points Earned"}</span>
                  <span className="val">⭐ {score}</span>
                </div>
                <div className="stat-result-box">
                  <span className="label">{speakLang === 'hi' ? "प्राप्त एक्सपी" : "XP Gained"}</span>
                  <span className="val">🚀 +50 XP</span>
                </div>
                <div className="stat-result-box">
                  <span className="label">{speakLang === 'hi' ? "बचे हुए दिल" : "Remaining Lives"}</span>
                  <span className="val">💖 {lives}/3</span>
                </div>
              </div>
              
              <div className="reward-congrats-message">
                {speakLang === 'hi' 
                  ? "🎉 बधाई हो! लेवल पुरस्कार आपके एक्सप्लोरर डैशबोर्ड में जोड़ दिए गए हैं!"
                  : "🎉 Congratulations! Level rewards have been added to your explorer dashboard!"}
              </div>

              <div className="result-actions">
                <button 
                  className="btn-bouncy blue"
                  onClick={() => setActiveView('menu')}
                >
                  {speakLang === 'hi' ? "विषयों पर वापस जाएं" : "Back to Topics"}
                </button>
                <button 
                  className="btn-bouncy purple animate-pulse"
                  onClick={() => {
                    if (category.id === 'level1' && !isPro) {
                      window.location.hash = '#paywall';
                    } else if (category.id === 'level1') {
                      startQuiz('level2');
                    } else if (category.id === 'level2') {
                      startQuiz('level3');
                    } else if (category.id === 'level3') {
                      startQuiz('level4');
                    } else if (category.id === 'level4') {
                      startQuiz('level5');
                    } else {
                      setActiveView('menu');
                    }
                  }}
                >
                  {category.id === 'level1' && !isPro 
                    ? (speakLang === 'hi' ? "🚀 प्रो लेवल 2 अनलॉक करें" : "🚀 Unlock Pro Level 2") 
                    : (speakLang === 'hi' ? "अगला विषय →" : "Next Topic →")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
