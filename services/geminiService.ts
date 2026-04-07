import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizData, QuizPart } from '../types';

const API_KEY = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env.VITE_GEMINI_API_KEY) || 
  process.env.GEMINI_API_KEY || 
  process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key is missing! Please set VITE_GEMINI_API_KEY or GEMINI_API_KEY in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export async function generateFullTest(): Promise<QuizData> {
  const model = "gemini-3-flash-preview";

  const prompt = `
    Generate a professional Midterm English test modeled after Cambridge English Qualifications (B1 Preliminary level).
    
    **TOPICS**: Transport and Travel, Work, Health, Technology.
    
    **VOCABULARY LEVEL**:
    - **Passages/Scripts**: 10% A1, 20% A2, 70% B1 (Strictly follow Cambridge B1 Preliminary Vocabulary List).
    - **Questions/Options**: Strictly use **A2 level vocabulary** to ensure clarity for students.
    
    **STRUCTURE & MATRIX**:
    
    1. **READING TEST (40 Questions)**:
       - **4 PASSAGES**. Each passage MUST be **minimum 500 words**.
       - **Passage 1-3 (10 questions each)**:
         - 2x Vocabulary questions (Q1)
         - 2x Main Idea questions (Q2)
         - 2x Detail questions (Q3)
         - 2x Negative questions (Q4)
         - 1x Paraphrasing/Reporting question (Q5)
         - 1x Purpose question (Q6)
       - **Passage 4 (10 questions)**:
         - 2x Vocabulary questions (Q1)
         - 2x Main Idea questions (Q2)
         - 2x Detail questions (Q3)
         - 1x Negative question (Q4)
         - 1x Paraphrasing/Reporting question (Q5)
         - 1x Purpose question (Q6)
         - 1x Sentence Insertion question (Q7)
    
    2. **LISTENING TEST (35 Questions)**:
       - **3 PARTS**.
       - **Part 1 (8 questions)**:
         - **FIXED SCRIPTS & AUDIO**: Use these 8 scripts and their corresponding audio URLs.
           1. (JFK): "Once again, it is time to elect another leader for our country. With this in mind, we are doing a weekly series on great leaders in our history. The first president to be discussed is John F. Kennedy. Born on May 29, 1917, in Brookline, Massachusetts, John Fitzgerald Kennedy was the 38th president of the United States. He was born into a family of wealth and strong political beliefs. Both of his grandfathers, Patrick J. Kennedy and John F. Fitzgerald, had been politicians."
              Audio URL: /audio/Part_1_1.mp3
           2. (Football): "Does the football match start at quarter past 12 every week? No, it was early this week. It usually begins at 2:00'. Clock. So it'll be the usual time next week? Yes."
              Audio URL: /audio/Part_1_2.mp3
           3. (Photos): "Speaker A: I've got the photos back. Look, this one of us on the beach is just brilliant. Speaker B: Yes, you must get a copy for me to put in my photo album. It was a great day. But that other one's good too. Speaker A: I don't know why you think so. That dress I'm wearing looks awful. I only bought it because it was half price. The one of us on the boat isn't bad. Look, Speaker B: apart from the fact that we look seasick."
              Audio URL: /audio/Part_1_3.mp3
           4. (Software): "We've just discovered why our market share has been pinched. There is a whole lot of pirates out there marketing unlicensed software. This can't continue. We've got to go out and get them. We are the only authorized dealer in this city. We can't just sit and let these people go on stealing. We've got to take action."
              Audio URL: /audio/Part_1_4.mp3
           5. (Museum): "Thank you for coming to see the Pacific Art Museum's exhibition of 18th-century landscape paintings. The museum will be closing in 15 minutes. Please begin moving to the museum exits."
              Audio URL: /audio/Part_1_5.mp3
           6. (Apple Pie): "What time is it, Mum? Do you think the apple pie will be ready yet? It's 4.35 and the pie went into the oven at quarter past four. That's right. You could check it at five and turn the heat down a bit, but don't take it out until 20 past. That's 45 minutes to go. Okay, I'm hungry already."
              Audio URL: /audio/Part_1_6.mp3
           7. (Hospital): "I'm going to see Tracy in hospital, but I can't think of what to take her. People always take flowers. so shall have lots already for sure. I always think it's nice to have something to read myself, but as Tracie's got her Walkman with her, what about something to listen to. What a good idea. It's better than taking sweets, certainly, because I know she's on a special diet while she's in hospital."
              Audio URL: /audio/Part_1_7.mp3
           8. (Jobs): "What's your father's job, Joe? He was a pilot, but now he's a farmer. What about your father? He's a photographer. Oh, I want to do that. If I don't become a pilot..."
              Audio URL: /audio/Part_1_8.mp3
         - **REQUIRED QUESTIONS**:
           Q1: Where was John F. Kennedy born? (A. Brooklyn, New York, B. Brooklyn, Massachusetts, C. Washington D.C., D. London, England)
           Q2: What activity are the speakers discussing regarding the timing? (A. A basketball game, B. A football match, C. A movie screening, D. A school lecture)
           Q3: Why did the woman buy the dress shown in the photo? (A. She loved the style., B. It was half price., C. It was for a wedding., D. Her friend recommended it.)
           Q4: Who is the speaker in the software announcement? (A. A software pirate, B. A customer looking for a deal, C. An authorized dealer, D. A computer programmer)
           Q5: What is the main purpose of the museum announcement? (A. To introduce a new artist, B. To invite people to a party, C. To inform visitors of the closing time, D. To sell landscape paintings)
           Q6: What time should the apple pie be taken out of the oven? (A. 4:15, B. 4:35, C. 5:00, D. 5:20)
           Q7: Where is Tracy currently staying? (A. At a hotel, B. At home, C. In the hospital, D. At school)
           Q8: What does Joe want to do if he doesn't become a pilot? (A. Become a farmer, B. Become a photographer, C. Become a doctor, D. Become a teacher)
       - **Part 2 (12 questions)**:
         - **FIXED SCRIPTS & AUDIO**:
           1. (Waterside Shopping Centre): "Speaker 1: In today's programme, David Green has come along to tell us all about Waterside Shopping Centre... Speaker 2: ...Apart from that, I would recommend it." (Full transcript provided in previous turns)
              Audio URL: /audio/Part_2_1.mp3
           2. (Borrowing the car): "Speaker 1: Bye mum, see you later. Speaker 2: How are you getting to college? ...Speaker 2: Come on then."
              Audio URL: /audio/Part_2_2.mp3
           3. (Self-access centre): "Speaker 1: Hi, Eun. As you know, I've asked you here today to discuss the future of our self-access centre... Speaker 2: ...I think it would be fine."
              Audio URL: /audio/Part_2_3.mp3
         - **REQUIRED QUESTIONS**:
           Q9: What is the main topic of David Green’s talk? (A. The history of Northport, B. How to use public transport, C. The Waterside Shopping Center, D. Birdwatching at the lake)
           Q10: How long did it take to build the shopping center? (A. 3 weeks, B. 2 months, C. 3 years, D. 15 minutes)
           Q11: How many free parking spaces are available? (A. 3,000, B. 9,000, C. 12,000, D. 15,000)
           Q12: On which day does the shopping center stay open until 9:00 PM? (A. Monday, B. Friday, C. Saturday, D. Sunday)
           Q13: What can be found on the third level of the center? (A. Shoe shops and banks, B. Information desk and maps, C. Restaurants and a cinema, D. A lake for fishing)
           Q14: What was David Green’s main complaint about the center? (A. Poor service in shops, B. The food in the cafe, C. Litter on the ground, D. Crowded buses)
           Q15: Why does Matthew need his mother's car? (A. To go to a party, B. To help a friend move house, C. To drive to Birmingham, D. To take his mother to work)
           Q16: Why can't Matthew help Alan next Wednesday? (A. He has a meeting in Birmingham., B. He is going on holiday., C. He has an exam., D. He needs to repair his own car.)
           Q17: How do Matthew and his mother agree to avoid confusion in the future? (A. By calling each other more often, B. By writing down dates and times, C. By using a shared digital calendar, D. By asking Alan to help)
           Q18: What is the primary focus of the discussion between Yun and the teacher? (A. Choosing new English textbooks, B. The future of the self-access center, C. Organizing a class trip to the library, D. How to use email for learning)
           Q19: What is the main improvement students want for the center? (A. Better air conditioning, B. More teachers on duty, C. More computers to avoid sharing, D. Longer opening hours)
           Q20: What is the teachers' main concern regarding computer use? (A. Students are playing games., B. Students are checking personal emails., C. Students are breaking the equipment., D. Students are not using the library.)
       - **Part 3 (15 questions)**:
         - **FIXED SCRIPTS & AUDIO**:
           1. (Types of plays): "Speaker 1: If a play makes you laugh, it's a comedy... An example is Saint Joan by George Bernard Shaw."
              Audio URL: /audio/Part_3_1.mp3
           2. (Vocabulary newspapers): "Speaker 1: One of the most effective ways to increase your vocabulary is through newspapers... Speaker 1: You'll be surprised how fast you learn."
              Audio URL: /audio/Part_3_2.mp3
           3. (Persistence hunt): "Speaker 1: Track and field events happened long before they became a sport... Then he'll slaughter it."
              Audio URL: /audio/Part_3_3.mp3
         - **REQUIRED QUESTIONS**:
           Q21: What is the lecture in this recording about? (A. The life of William Shakespeare, B. Different styles of drama, C. How to write a successful play, D. Famous actors in history)
           Q22: According to the talk, which play is an example of a tragedy? (A. Much Ado About Nothing, B. St. Joan, C. Ghosts, D. Romeo and Juliet)
           Q23: What is a characteristic of a tragicomedy? (A. It always has a very sad ending., B. It features only humorous characters., C. It has a humorous or unclear ending., D. It is written only by modern authors.)
           Q24: Who wrote the play St. Joan? (A. William Shakespeare, B. Henrik Ibsen, C. George Bernard Shaw, D. David Green)
           Q25: What is the main purpose of the talk on vocabulary? (A. To encourage students to buy dictionaries, B. To explain how to use newspapers to learn words, C. To compare English and American vocabulary, D. To discuss the history of journalism)
           Q26: How many new words should a student aim to find each day? (A. 2 to 4, B. 5 to 7, C. 8 to 10, D. 15 to 20)
           Q27: How much time should be spent daily reviewing words from the previous day? (A. 5 minutes, B. 10 minutes, C. 15 minutes, D. 30 minutes)
           Q28: Why are newspapers recommended for learning vocabulary? (A. They are free at the library., B. They are cheap and have a variety of words., C. They are easier to read than books., D. They contain only simple words.)
           Q29: Where should students record the new words they find? (A. On a piece of scrap paper, B. In a vocabulary notebook, C. On the newspaper itself, D. In a digital spreadsheet)
           Q30: What is the "persistence hunt" discussed in the talk? (A. A modern racing sport in Africa, B. A survival method used by the San people, C. A way to train for track and field events, D. A study of antelope migration patterns)
           Q31: Where do the people who practice the persistence hunt live? (A. Asia, B. South America, C. Africa, D. Australia)
           Q32: How long can a hunter run after a chosen animal during the hunt? (A. 2 hours, B. 5 hours, C. 8 hours, D. 24 hours)
           Q33: What animal is typically targeted in this hunt? (A. A lion, B. An antelope, C. A zebra, D. An elephant)
           Q34: What causes the animal to eventually fall? (A. It is shot by an arrow., B. It gets trapped in a net., C. It becomes exhausted and tired., D. It loses its way in the desert.)
           Q35: What is the speaker’s goal in discussing the San people? (A. To promote tourism in Africa, B. To show the origins of track and field activities, C. To advocate for animal rights, D. To explain the diet of ancient tribes)
    
    **CRITICAL GUIDELINES**:
    - **LISTENING ACCURACY**: All listening questions MUST be strictly derived from the information provided in the scripts.
    - **AUDIO PERSISTENCE**: For Part 2 and Part 3, multiple questions share the same audio file. You MUST provide an 'audioUrls' array of the SAME length as the 'questions' array. For questions that share an audio file, use the EXACT SAME URL string. This ensures the audio persists across those questions.
      - Part 2: Q9-Q14 use '/audio/Part_2_1.mp3', Q15-Q17 use '/audio/Part_2_2.mp3', Q18-Q20 use '/audio/Part_2_3.mp3'.
      - Part 3: Q21-Q24 use '/audio/Part_3_1.mp3', Q25-Q29 use '/audio/Part_3_2.mp3', Q30-Q35 use '/audio/Part_3_3.mp3'.
    - **CHRONOLOGICAL ORDER**: Questions for each listening part MUST follow the exact order of information as it appears in the script.
    - **OPTION CONSTRUCTION**: For each question, 1 to 3 of the options (A, B, C, D) MUST use actual phrases or sentences found in the script (to act as strong distractors or the correct answer). One option can be a plausible alternative based on the script's context.
    - **NO OUTSIDE KNOWLEDGE**: Do NOT use common distractors or answers from other exams (e.g., "loud music", "dirty toilets") if they are not explicitly mentioned in the provided transcript.
    - **PARAPHRASING**: Correct answers in reading parts MUST use synonyms. Do not repeat text exactly.
    - **DISTRACTORS**: Incorrect options should use keywords from the text to test comprehension.
    - **RANDOMIZATION**: Ensure correct answers are evenly distributed (A, B, C, D).
    - **VOCABULARY HIGHLIGHTING**: For Reading vocabulary questions, the target word MUST be **bolded** (using **word**) within the passage.
    - **PASSAGE FORMATTING**: Use double newlines (\n\n) between paragraphs in all passages to ensure a blank line for readability.
    
    Output strict JSON.
  `;

  const partSchema = {
    type: Type.OBJECT,
    properties: {
      partTitle: { type: Type.STRING },
      passage: { type: Type.STRING, description: "The text/script for this part." },
      type: { type: Type.STRING, enum: ["reading", "listening"] },
      audioUrls: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING }, 
        description: "Array of audio URLs, one for each question in the part. Use the same URL for questions that share the same audio file. For Reading parts, provide an empty array []." 
      },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswerIndex: { type: Type.INTEGER }
          },
          required: ["questionText", "options", "correctAnswerIndex"]
        }
      }
    },
    required: ["partTitle", "passage", "type", "questions", "audioUrls"]
  };

  const schema = {
    type: Type.OBJECT,
    properties: {
      reading: {
        type: Type.ARRAY,
        items: partSchema,
        description: "Exactly 4 parts for Reading."
      },
      listening: {
        type: Type.ARRAY,
        items: partSchema,
        description: "Exactly 3 parts for Listening."
      }
    },
    required: ["reading", "listening"]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const jsonText = response.text.trim();
    const quizData = JSON.parse(jsonText) as QuizData;

    // Basic validation
    if (quizData.reading.length === 4 && quizData.listening.length === 3) {
      return quizData;
    }
    
    // If AI is slightly off, we still try to return what we have if it's usable
    if (quizData.reading.length > 0 && quizData.listening.length > 0) {
      return quizData;
    }

    throw new Error("Generated quiz data does not match the expected format.");
  } catch (error) {
    console.error("Error generating quiz with Gemini:", error);
    throw new Error("Failed to generate the quiz. Please try again.");
  }
}

export async function generateSpeech(text: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Read this script clearly and naturally for an English listening test: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio data returned from Gemini TTS.");
    }
    return base64Audio;
  } catch (error) {
    console.error("Error generating speech with Gemini:", error);
    throw new Error("Failed to generate audio. Please try again.");
  }
}
