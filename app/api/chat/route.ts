import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { TrainingMode } from '@/lib/types';

const minimax = createOpenAI({
  apiKey: process.env.MINIMAX_API_KEY || '',
  baseURL: process.env.MINIMAX_BASE_URL || 'https://api.minimax.io/v1',
});

export async function POST(req: Request) {
  const { messages, mode } = await req.json();

  const validModes: TrainingMode[] = ['conversation', 'grammar', 'vocabulary', 'scenarios', 'writing'];
  
  if (!mode || !validModes.includes(mode as TrainingMode)) {
    return new Response(JSON.stringify({ error: 'Invalid mode' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const systemPrompt = SYSTEM_PROMPTS[mode as TrainingMode];
  const modelName = process.env.MINIMAX_MODEL || 'MiniMax-M3';

  try {
    // Convert UIMessage[] (from client) to ModelMessage[] (for AI SDK)
    const modelMessages = await convertToModelMessages(messages as UIMessage[]);

    const result = streamText({
      model: minimax(modelName),
      system: systemPrompt,
      messages: modelMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Minimax API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to get response from AI' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
