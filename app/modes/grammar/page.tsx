'use client';

import ChatInterface from '@/app/components/ChatInterface';
import { MODES } from '@/lib/types';

export default function GrammarPage() {
  return <ChatInterface mode={MODES.grammar} />;
}
