'use client';

import ChatInterface from '@/app/components/ChatInterface';
import { MODES } from '@/lib/types';

export default function ScenariosPage() {
  return <ChatInterface mode={MODES.scenarios} />;
}
