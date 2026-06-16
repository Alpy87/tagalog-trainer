'use client';

import ChatInterface from '@/app/components/ChatInterface';
import { MODES } from '@/lib/types';

export default function WritingPage() {
  return <ChatInterface mode={MODES.writing} />;
}
