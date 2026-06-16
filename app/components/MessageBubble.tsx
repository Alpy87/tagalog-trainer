'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-ai'}`}>
      <div className="message-content">
        {isUser ? (
          <p>{content}</p>
        ) : (
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="vocab-highlight">{children}</strong>
              ),
              p: ({ children }) => <p>{children}</p>,
              ul: ({ children }) => <ul>{children}</ul>,
              ol: ({ children }) => <ol>{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              code: ({ children, className }) => {
                const isBlock = className?.includes('language-');
                if (isBlock) {
                  return (
                    <pre className="code-block">
                      <code>{children}</code>
                    </pre>
                  );
                }
                return <code className="inline-code">{children}</code>;
              },
              blockquote: ({ children }) => (
                <blockquote className="message-blockquote">{children}</blockquote>
              ),
              h1: ({ children }) => <h3 className="message-heading">{children}</h3>,
              h2: ({ children }) => <h3 className="message-heading">{children}</h3>,
              h3: ({ children }) => <h4 className="message-heading">{children}</h4>,
              hr: () => <hr className="message-divider" />,
              table: ({ children }) => (
                <div className="table-wrapper">
                  <table className="message-table">{children}</table>
                </div>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="message message-ai">
      <div className="typing-indicator">
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
        <span className="typing-dot"></span>
      </div>
    </div>
  );
}
