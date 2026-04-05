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
         - **FIXED SCRIPTS & AUDIO**: You MUST use these 8 scripts and their corresponding audio URLs for Part 1.
           1. (JFK): "Once again, it is time to elect another leader for our country. With this in mind, we are doing a weekly series on great leaders in our history. The first president to be discussed is John F. Kennedy. Born on May 29, 1917, in Brookline, Massachusetts, John Fitzgerald Kennedy was the 38th president of the United States. He was born into a family of wealth and strong political beliefs. Both of his grandfathers, Patrick J. Kennedy and John F. Fitzgerald, had been politicians."
              Audio URL: /audio/Part 1 (1).mp3
           2. (Football): "Does the football match start at quarter past 12 every week? No, it was early this week. It usually begins at 2:00'. Clock. So it'll be the usual time next week? Yes."
              Audio URL: /audio/Part 1 (2).mp3
           3. (Photos): "Speaker A: I've got the photos back. Look, this one of us on the beach is just brilliant. Speaker B: Yes, you must get a copy for me to put in my photo album. It was a great day. But that other one's good too. Speaker A: I don't know why you think so. That dress I'm wearing looks awful. I only bought it because it was half price. The one of us on the boat isn't bad. Look, Speaker B: apart from the fact that we look seasick."
              Audio URL: /audio/Part 1 (3).mp3
           4. (Software): "We've just discovered why our market share has been pinched. There is a whole lot of pirates out there marketing unlicensed software. This can't continue. We've got to go out and get them. We are the only authorized dealer in this city. We can't just sit and let these people go on stealing. We've got to take action."
              Audio URL: /audio/Part 1 (4).mp3
           5. (Museum): "Thank you for coming to see the Pacific Art Museum's exhibition of 18th-century landscape paintings. The museum will be closing in 15 minutes. Please begin moving to the museum exits."
              Audio URL: /audio/Part 1 (5).mp3
           6. (Apple Pie): "What time is it, Mum? Do you think the apple pie will be ready yet? It's 4.35 and the pie went into the oven at quarter past four. That's right. You could check it at five and turn the heat down a bit, but don't take it out until 20 past. That's 45 minutes to go. Okay, I'm hungry already."
              Audio URL: /audio/Part 1 (6).mp3
           7. (Hospital): "I'm going to see Tracy in hospital, but I can't think of what to take her. People always take flowers. so shall have lots already for sure. I always think it's nice to have something to read myself, but as Tracie's got her Walkman with her, what about something to listen to. What a good idea. It's better than taking sweets, certainly, because I know she's on a special diet while she's in hospital."
              Audio URL: /audio/Part 1 (7).mp3
           8. (Jobs): "What's your father's job, Joe? He was a pilot, but now he's a farmer. What about your father? He's a photographer. Oh, I want to do that. If I don't become a pilot..."
              Audio URL: /audio/Part 1 (8).mp3
         - **Structure**: Combine these 8 scripts into the passage field for Part 1.
         - **Audio URLs**: Include these 8 URLs in an 'audioUrls' array for Part 1.
         - **Questions**: Generate 1 multiple-choice question (A, B, C, D) for each script based on its content.
       - **Part 2 (12 questions)**:
         - **FIXED SCRIPTS & AUDIO**: You MUST use these 3 conversations for Part 2.
           1. (Waterside Shopping Centre): "Speaker 1: In today's programme, David Green has come along to tell us all about Waterside Shopping Centre... Speaker 2: ...Apart from that, I would recommend it."
              Audio URL: /audio/Part 2 (1).mp3 (Use for questions 1-4)
           2. (Borrowing the car): "Speaker 1: Bye mum, see you later. Speaker 2: How are you getting to college? ...Speaker 2: Come on then."
              Audio URL: /audio/Part 2 (2).mp3 (Use for questions 5-8)
           3. (Self-access centre): "Speaker 1: Hi, Eun. As you know, I've asked you here today to discuss the future of our self-access centre... Speaker 2: ...I think it would be fine."
              Audio URL: /audio/Part 2 (3).mp3 (Use for questions 9-12)
         - **Structure**: Combine these 3 scripts into the passage field.
         - **Audio URLs**: Provide an array of 12 URLs (repeat the corresponding URL for each question).
         - **Questions**: Generate 4 questions for each conversation (Total 12). **CRITICAL**: Questions MUST follow the chronological order of the transcript.
       - **Part 3 (15 questions)**:
         - **FIXED SCRIPTS & AUDIO**: You MUST use these 3 talks for Part 3.
           1. (Types of plays): "Speaker 1: If a play makes you laugh, it's a comedy... An example is Saint Joan by George Bernard Shaw."
              Audio URL: /audio/Part 3 (1).mp3 (Use for questions 1-5)
           2. (Vocabulary newspapers): "Speaker 1: One of the most effective ways to increase your vocabulary is through newspapers... Speaker 1: You'll be surprised how fast you learn."
              Audio URL: /audio/Part 3 (2).mp3 (Use for questions 6-10)
           3. (Persistence hunt): "Speaker 1: Track and field events happened long before they became a sport... Then he'll slaughter it."
              Audio URL: /audio/Part 3 (3).mp3 (Use for questions 11-15)
         - **Structure**: Combine these 3 scripts into the passage field.
         - **Audio URLs**: Provide an array of 15 URLs (repeat the corresponding URL for each question).
         - **Questions**: Generate 5 questions for each talk (Total 15). **CRITICAL**: Questions MUST follow the chronological order of the transcript.
    
    **CRITICAL GUIDELINES**:
    - **PARAPHRASING**: Correct answers in reading parts MUST use synonyms. Do not repeat text exactly.
    - **DISTRACTORS**: Incorrect options should use keywords from the text to test comprehension.
    - **RANDOMIZATION**: Ensure correct answers are evenly distributed (A, B, C, D).
    
    Output strict JSON.
  `;

  const partSchema = {
    type: Type.OBJECT,
    properties: {
      partTitle: { type: Type.STRING },
      passage: { type: Type.STRING, description: "The text/script for this part." },
      type: { type: Type.STRING, enum: ["reading", "listening"] },
      audioUrls: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Optional: Array of audio URLs for the part." },
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
    required: ["partTitle", "passage", "type", "questions"]
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
