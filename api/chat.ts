import { GoogleGenAI } from '@google/genai';

let genAIClient: GoogleGenAI | null = null;
function getGenAI() {
  if (!genAIClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is not configured.");
    }
    genAIClient = new GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}

export default async function handler(req: any, res: any) {
  // CORS & Method check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sceneTitle, aiRole, sceneDescription, messages, userMessage } = req.body || {};
      
    const ai = getGenAI();
    const turnCount = (messages?.length || 0) + 1;
    const isEndingPhase = turnCount >= 6;

    const systemInstruction = `You are playing the role of: ${aiRole}.
The scene setting is: "${sceneTitle}" - ${sceneDescription}.
Rules:
1. Speak strictly in natural, authentic spoken English. Use conversational filler words occasionally if appropriate.
2. DO NOT correct the user's English during the conversation. Stay 100% immersed in your character.
3. Keep your replies concise (1 to 3 short spoken sentences). Do not give long monologues.
4. Current conversation turn is #${turnCount}. ${isEndingPhase ? 'You should now guide the conversation to a warm, natural conclusion or goodbye.' : 'Keep the conversation flowing naturally by reacting and asking a relevant follow-up question.'}`;

    const conversationHistory = (messages || []).map((m: any) => ({
      role: m.role === 'ai' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: conversationHistory,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "Sure, sounds good!";
    return res.status(200).json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in Vercel /api/chat:", error);
    return res.status(500).json({ 
      error: error.message || "Failed to generate chat response",
      reply: "Sorry, I didn't quite catch that. Could you say that again?" 
    });
  }
}
