'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { UIMessage, DefaultChatTransport } from 'ai';
import { ModeConfig } from '@/lib/types';
import MessageBubble, { TypingIndicator } from './MessageBubble';
import Header from './Header';
import SettingsModal from './SettingsModal';

interface ChatInterfaceProps {
  mode: ModeConfig;
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: 'text'; text: string } => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export default function ChatInterface({ mode }: ChatInterfaceProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load initial messages from localStorage
  const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`chat-${mode.id}`);
      const savedConvId = localStorage.getItem(`chat-${mode.id}-id`);
      
      if (saved) {
        try {
          setInitialMessages(JSON.parse(saved));
        } catch {
          setInitialMessages([]);
        }
      }
      
      if (savedConvId) {
        setConversationId(savedConvId);
      } else {
        const newId = crypto.randomUUID();
        setConversationId(newId);
        localStorage.setItem(`chat-${mode.id}-id`, newId);
      }
      
      setHydrated(true);
    }
  }, [mode.id]);

  const transport = useMemo(() => new DefaultChatTransport({
    api: '/api/chat',
    body: { mode: mode.id, conversationId },
  }), [mode.id, conversationId]);

  const {
    messages,
    sendMessage,
    setMessages,
    status,
    error,
  } = useChat({
    id: mode.id,
    transport,
    messages: hydrated && initialMessages.length > 0 ? initialMessages : undefined,
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  // Persist messages to localStorage
  useEffect(() => {
    if (hydrated && messages.length > 0) {
      localStorage.setItem(`chat-${mode.id}`, JSON.stringify(messages));
    }
  }, [messages, mode.id, hydrated]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Auto-focus input
  useEffect(() => {
    if (!isLoading) {
      inputRef.current?.focus();
    }
  }, [isLoading]);

  const handleClear = () => {
    if (window.confirm('Clear this conversation? This cannot be undone locally.')) {
      setMessages([]);
      localStorage.removeItem(`chat-${mode.id}`);
      const newId = crypto.randomUUID();
      setConversationId(newId);
      localStorage.setItem(`chat-${mode.id}-id`, newId);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage({ text: input.trim() });
      setInput('');
      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  };

  if (!hydrated) {
    return (
      <div className="chat-loading">
        <div className="typing-indicator">
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
          <span className="typing-dot"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container" data-mode={mode.id}>
      <Header
        title={mode.title}
        emoji={mode.emoji}
        showBack
        onClearClick={handleClear}
        onSettingsClick={() => setSettingsOpen(true)}
      />

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">{mode.emoji}</div>
            <h2 className="empty-state-title">{mode.title}</h2>
            <p className="empty-state-description">{mode.description}</p>
            <div className="message message-ai animate-slide-up">
              <div className="message-content">
                <p style={{ whiteSpace: 'pre-line' }}>{mode.welcomeMessage}</p>
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role as 'user' | 'assistant'}
            content={getTextContent(msg)}
          />
        ))}

        {isLoading && (messages.length === 0 || messages[messages.length - 1]?.role === 'user') && (
          <TypingIndicator />
        )}

        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <p>
              {error.message || 'Something went wrong. Check your API key in Settings.'}
            </p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSubmit}>
        <div className="chat-input-wrapper">
          <textarea
            ref={inputRef}
            className="chat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            className="chat-send-btn"
            disabled={isLoading || !input.trim()}
            aria-label="Send message"
          >
            {isLoading ? (
              <span className="send-loading">⏳</span>
            ) : (
              <span className="send-icon">➤</span>
            )}
          </button>
        </div>
      </form>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
