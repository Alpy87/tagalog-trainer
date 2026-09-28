'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, type UIMessage } from 'ai';
import Link from 'next/link';
import { ModeConfig } from '@/lib/types';
import { lessons } from '@/lib/course';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import Header from './Header';
import SettingsModal from './SettingsModal';

type Session = { id: string; messages: UIMessage[]; storage: string; lessonId?: string };
export default function ChatInterface({ mode }: { mode: ModeConfig }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loadError, setLoadError] = useState('');
  useEffect(() => {
    try {
      const requested = new URLSearchParams(window.location.search).get('lesson');
      const lessonId = lessons.find(l => l.id === requested)?.id;
      const storage = 'chat-' + mode.id + (lessonId ? '-' + lessonId : '');
      const messages = JSON.parse(localStorage.getItem(storage) || '[]');
      if (!Array.isArray(messages) || messages.some(m => !m || !Array.isArray(m.parts))) throw new Error();
      const id = localStorage.getItem(storage + '-id') || crypto.randomUUID();
      localStorage.setItem(storage + '-id', id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSession({ id, messages, storage, lessonId });
    } catch { setLoadError('Could not load chat history. Check browser storage settings. Saved data has not been overwritten.'); }
  }, [mode.id]);
  if (!session) return <main className="course"><Link href="/">← Home</Link><p role="status">{loadError || 'Loading conversation…'}</p></main>;
  return <Chat key={session.storage} mode={mode} session={session} />;
}
function Chat({ mode, session }: { mode: ModeConfig; session: Session }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(session.id);
  const [storageError, setStorageError] = useState('');
  const end = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const viewport = window.visualViewport;
    const element = container.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function fitKeyboard() {
      if (!element || !viewport) return;
      // Follow the visible screen when Safari opens the keyboard; preserve pinch zoom.
      if (viewport.scale !== 1) return;
      element.style.setProperty('--chat-height', `${viewport.height}px`);
      element.style.setProperty('--chat-top', `${viewport.offsetTop}px`);
    }
    fitKeyboard();
    viewport?.addEventListener('resize', fitKeyboard);
    viewport?.addEventListener('scroll', fitKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      viewport?.removeEventListener('resize', fitKeyboard);
      viewport?.removeEventListener('scroll', fitKeyboard);
    };
  }, []);
  const lesson = lessons.find(l => l.id === session.lessonId);
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat',
    body: { mode: mode.id, conversationId, lessonId: session.lessonId } }), [mode.id, conversationId, session.lessonId]);
  const { messages, sendMessage, setMessages, status, error, regenerate, clearError } = useChat({
    id: session.storage, transport, messages: session.messages,
  });
  const busy = status === 'submitted' || status === 'streaming';
  useEffect(() => {
    try { localStorage.setItem(session.storage, JSON.stringify(messages)); }
    catch {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStorageError('Chat history could not be saved in this browser.');
    }
  }, [messages, session.storage]);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, busy]);
  function submit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!busy && input.trim()) { sendMessage({ text: input.trim() }); setInput(''); }
  }
  function clear() {
    if (busy || !window.confirm('Clear this browser conversation? The server archive is retained.')) return;
    try { const id = crypto.randomUUID(); localStorage.removeItem(session.storage); localStorage.setItem(session.storage + '-id', id); setConversationId(id); setMessages([]); clearError(); }
    catch { setStorageError('Conversation could not be cleared.'); }
  }
  let message = error?.message;
  if (message) { try { message = JSON.parse(message).error || message; } catch { /* Plain-text stream error. */ } }
  return <div ref={container} className="chat-container" data-mode={mode.id}>
    <Header title={lesson ? lesson.title : mode.title} emoji={mode.emoji} showBack onClearClick={clear} onSettingsClick={() => setSettingsOpen(true)} />
    <div className="chat-messages">
      {lesson && <p><Link href="/learn">← Resume guided lesson</Link></p>}
      {messages.length === 0 && <div className="empty-state"><h2>{lesson?.title || mode.title}</h2>
        <MessageBubble role="assistant" content={lesson ? lesson.task + '\n\nPress **Start role-play** when ready. Ask for a hint at any time.' : mode.welcomeMessage} />
        {lesson && <button className="btn btn-primary" disabled={busy} onClick={() => sendMessage({ text: 'Start this lesson role-play. Ask me one short question at a time.' })}>Start role-play</button>}
      </div>}
      {messages.map(m => <MessageBubble key={m.id} role={m.role as 'user' | 'assistant'} content={m.parts.filter(p => p.type === 'text').map(p => p.text).join('')} />)}
      {busy && <TypingIndicator />}
      {error && <div className="error-message" role="alert"><p>{message}</p><button className="btn btn-secondary" disabled={busy} onClick={() => regenerate()}>Retry response</button></div>}
      {storageError && <p role="alert">{storageError}</p>}
      <div ref={end} />
    </div>
    <form className="chat-input-area" onSubmit={submit}><div className="chat-input-wrapper">
      <textarea className="chat-input" aria-label="Your message" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }} placeholder="Type your message…" disabled={busy} rows={2} />
      <button className="chat-send-btn" type="submit" disabled={busy || !input.trim()} aria-label="Send message">➤</button>
    </div></form>
    <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
  </div>;
}
