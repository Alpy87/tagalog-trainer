'use client';

import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  title: string;
  emoji: string;
  showBack?: boolean;
  onSettingsClick?: () => void;
  onClearClick?: () => void;
}

export default function Header({
  title,
  emoji,
  showBack = false,
  onSettingsClick,
  onClearClick,
}: HeaderProps) {
  return (
    <header className="header">
      <div className="header-left">
        {showBack && (
          <Link href="/" className="header-back" aria-label="Back to modes">
            ←
          </Link>
        )}
        <div className="header-title-group">
          <span className="header-emoji">{emoji}</span>
          <h1 className="header-title">{title}</h1>
        </div>
      </div>
      <div className="header-right">
        {onClearClick && (
          <button
            className="btn btn-icon"
            onClick={onClearClick}
            aria-label="Clear conversation"
            title="Clear conversation"
          >
            🗑️
          </button>
        )}
        {onSettingsClick && (
          <button
            className="btn btn-icon"
            onClick={onSettingsClick}
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </button>
        )}
      </div>
    </header>
  );
}
