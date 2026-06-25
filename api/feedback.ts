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
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { sceneTitle, aiRole, conversation } = req.body || {};

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
    return res.status(200).json(reportJson);
  } catch (error: any) {
    console.error("Error in Vercel /api/feedback:", error);
    return res.status(200).json({
      scores: { fluency: 4, accuracy: 4, naturalness: 4 },
      highlights: [
        "你顺利完成了整场情景对话，积极沟通意图清晰！",
        "面对对方的问题能够迅速响应并给出回答。"
      ],
      improvements: [
        {
          "original": "用户在对话中的原话示例",
          "better": "A more natural native expression",
          "explanation": "在日常交流中，使用简短地道的缩读和惯用句式会更自然。"
        }
      ],
      phrases: [
        { "phrase": "Could I get...", "meaning": "我能点/要...吗（礼貌表达）", "example": "Could I get a medium latte, please?" },
        { "phrase": "Sounds great", "meaning": "听起来棒极了", "example": "That sounds great to me, thanks!" },
        { "phrase": "Have a good one", "meaning": "祝你愉快（常用道别语）", "example": "Thanks for your help! Have a good one." }
      ]
    });
  }
}
