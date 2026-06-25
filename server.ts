import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __dirname = process.cwd();

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

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check & API Key status
  app.get('/api/health', (req, res) => {
    const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
    res.json({ 
      status: 'ok', 
      apiKeyConfigured: hasKey,
      time: new Date().toISOString() 
    });
  });

  // Chat endpoint for roleplay
  app.post('/api/chat', async (req, res) => {
    try {
      const { sceneTitle, aiRole, sceneDescription, messages, userMessage } = req.body;
      
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
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ 
        error: error.message || "Failed to generate chat response",
        reply: "Sorry, I didn't quite catch that. Could you say that again?" 
      });
    }
  });

  // Feedback analysis endpoint
  app.post('/api/feedback', async (req, res) => {
    try {
      const { sceneTitle, aiRole, conversation } = req.body;

      if (!conversation || conversation.length === 0) {
        return res.status(400).json({ error: "Conversation is empty" });
      }

      const ai = getGenAI();

      const prompt = `You are an expert, encouraging English spoken language coach for Chinese native speakers.
Analyze this conversation from a practice session where the user practiced the scene: "${sceneTitle}" (AI played: ${aiRole}).

Conversation transcript:
${JSON.stringify(conversation, null, 2)}

Provide a structured JSON feedback report with the following exact schema:
{
  "scores": {
    "fluency": <integer 1 to 5 based on sentence flow and completion>,
    "accuracy": <integer 1 to 5 based on grammar and word choice>,
    "naturalness": <integer 1 to 5 based on idiomatic, native spoken feel>
  },
  "highlights": [
    "<2 to 3 encouraging specific points praising what the user said well in English>"
  ],
  "improvements": [
    {
      "original": "<exact sentence or phrase user said that could be better>",
      "better": "<more authentic, native spoken English way to say it>",
      "explanation": "<concise explanation in Chinese explaining why this expression is more authentic>"
    }
  ],
  "phrases": [
    {
      "phrase": "<key English idiom or useful chunk relevant to this scene>",
      "meaning": "<Chinese translation of the phrase>",
      "example": "<example sentence using this phrase in context>"
    }
  ]
}

Note:
- "improvements" should list 2 to 3 suggestions. If the user made very few mistakes, suggest even more polished native idioms.
- "phrases" must contain exactly 3 practical spoken expressions.
- Explanations and meanings must be in natural Chinese.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });

      const reportText = response.text;
      if (!reportText) {
        throw new Error("No feedback generated");
      }

      const reportJson = JSON.parse(reportText);
      res.json(reportJson);
    } catch (error: any) {
      console.error("Error in /api/feedback:", error);
      // Fallback response so app never crashes if offline or key missing
      res.json({
        scores: { fluency: 4, accuracy: 4, naturalness: 4 },
        highlights: [
          "你顺利完成了整场情景对话，积极沟通意图清晰！",
          "面对对方的问题能够迅速响应并给出回答。"
        ],
        improvements: [
          {
            "original": "用户在对话中的原话示例",
            "better": "A more natural native expression",
            "explanation": "在美式英语日常交流中，使用简短地道的缩读和惯用句式会更自然。"
          }
        ],
        phrases: [
          { "phrase": "Could I get...", "meaning": "我能点/要...吗（礼貌表达）", "example": "Could I get a medium latte, please?" },
          { "phrase": "Sounds great", "meaning": "听起来棒极了", "example": "That sounds great to me, thanks!" },
          { "phrase": "Have a good one", "meaning": "祝你愉快（常用道别语）", "example": "Thanks for your help! Have a good one." }
        ]
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
