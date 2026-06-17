import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const conversations = await prisma.conversation.findMany({
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        mode: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
}
