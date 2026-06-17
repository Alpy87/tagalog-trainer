import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const progress = await prisma.progress.findMany({
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { mode, completedTasks, score } = await req.json();

    const progress = await prisma.progress.upsert({
      where: { mode },
      update: {
        completedTasks: { increment: completedTasks || 0 },
        score: { increment: score || 0 },
      },
      create: {
        mode,
        completedTasks: completedTasks || 0,
        score: score || 0,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
