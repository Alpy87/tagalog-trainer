'use client';

import ChatInterface from '@/app/components/ChatInterface';
import { MODES } from '@/lib/types';

export default function ConversationPage() {
  return <ChatInterface mode={MODES.conversation} />;
}
