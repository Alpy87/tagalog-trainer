'use client';

import ChatInterface from '@/app/components/ChatInterface';
import { MODES } from '@/lib/types';

export default function VocabularyPage() {
  return <ChatInterface mode={MODES.vocabulary} />;
}
