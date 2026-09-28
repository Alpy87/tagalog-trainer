import { createOpenAI } from '@ai-sdk/openai';
import { streamText, convertToModelMessages, validateUIMessages, wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { SYSTEM_PROMPTS } from '@/lib/prompts';
import { MODES, TrainingMode } from '@/lib/types';
import { prisma } from '@/lib/prisma';
import { lessons } from '@/lib/course';

export async function POST(req: Request) {
  let body;
  try { body = await req.json(); } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
  if (!body || typeof body.mode !== 'string' || !Object.hasOwn(MODES, body.mode) ||
      !Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 100 ||
      typeof body.conversationId !== 'string' || !/^[\w-]{1,80}$/.test(body.conversationId)) {
    return Response.json({ error: 'Invalid conversation.' }, { status: 400 });
  }
  let messages;
  try {
    messages = await validateUIMessages({ messages: body.messages });
    if (messages.some(m => !['user', 'assistant'].includes(m.role) ||
        m.parts.some(p => p.type !== 'text' || p.text.length > 12000))) throw new Error();
  } catch {
    return Response.json({ error: 'Only text messages are supported.' }, { status: 400 });
  }
  // Support the variable names used by the existing Unraid deployment.
  const apiKey = process.env.MINIMAX_API_KEY || process.env.MiniMax_API_KEY;
  if (!apiKey) return Response.json({ error: 'AI is not configured on the server. Guided lessons still work.' }, { status: 503 });
  const provider = createOpenAI({ apiKey,
    baseURL: process.env.MINIMAX_BASE_URL || process.env.MiniMax_BASE_URL || 'https://api.minimax.io/v1' });
  const lesson = lessons.find(l => l.id === body.lessonId);
  const guidance = lesson ? `\nPractice this lesson only: ${JSON.stringify(lesson)}. Start the role-play immediately. Ask one question at a time. Give hints only when needed. Explain one important correction in English. Accept natural alternatives. Do not claim to save progress or assess pronunciation from text.` : '';
  try {
    const conversation = await prisma.conversation.upsert({
      where: { id: body.conversationId }, update: {},
      create: { id: body.conversationId, mode: body.mode, title: lesson?.title || 'New conversation' },
    });
    if (conversation.mode !== body.mode) return Response.json({ error: 'Conversation mode mismatch.' }, { status: 400 });
    const latest = messages.at(-1)!;
    if (latest.role === 'user') {
      await prisma.message.upsert({ where: { id: `${conversation.id}-${latest.id}` }, update: {},
        create: { id: `${conversation.id}-${latest.id}`, conversationId: conversation.id,
          role: 'user', content: latest.parts.filter(p => p.type === 'text').map(p => p.text).join('') } });
    }
    const result = streamText({
      model: wrapLanguageModel({ model: provider.chat(process.env.MINIMAX_MODEL || process.env.MiniMax_MODEL || 'MiniMax-M3'), middleware: extractReasoningMiddleware({ tagName: 'think' }) }),
      system: SYSTEM_PROMPTS[body.mode as TrainingMode] + guidance,
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        try { await prisma.message.create({ data: { conversationId: conversation.id, role: 'assistant', content: text } }); }
        catch { console.error('Could not save assistant message'); }
      },
    });
    return result.toUIMessageStreamResponse({ sendReasoning: false,
      onError: () => 'The AI service could not reply. Try again shortly; guided lessons remain available.',
    });
  } catch {
    console.error('Chat request failed; check database and AI configuration');
    return Response.json({ error: 'Chat is temporarily unavailable. Please retry. Guided lessons still work.' }, { status: 503 });
  }
}

