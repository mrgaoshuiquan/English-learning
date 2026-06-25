export default function handler(req: any, res: any) {
  const hasKey = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0;
  
  return res.status(200).json({
    status: 'ok',
    apiKeyConfigured: hasKey,
    environment: process.env.VERCEL ? 'vercel' : 'node',
    timestamp: new Date().toISOString()
  });
}
