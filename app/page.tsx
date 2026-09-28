'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MODES } from '@/lib/types';
import ModeCard from './components/ModeCard';
import SettingsModal from './components/SettingsModal';

const modeList = Object.values(MODES);

export default function HomePage() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="page">
      <div className="landing">
        <header className="landing-header">
          <button
            className="btn btn-icon landing-settings-btn"
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
            title="Settings"
          >
            ⚙️
          </button>
        </header>

        <div className="landing-hero animate-fade-in">
          <div className="landing-flag">🇵🇭</div>
          <h1 className="landing-title">
            <span className="text-gradient">Tagalog Trainer</span>
          </h1>
          <p className="landing-subtitle">
            AI-powered language training for beginners. Follow the learning plan or jump into any mode.
          </p>
          <Link href="/learn" className="landing-plan-cta">
            Start Your 20-Minute Lesson
            <span className="cta-arrow">→</span>
          </Link>
        </div>

        <div className="container">
          <p className="landing-modes-label">— Or jump into a mode —</p>
          <div className="grid-modes">
            {modeList.map((mode, index) => (
              <ModeCard key={mode.id} mode={mode} index={index} />
            ))}
          </div>
        </div>

        <footer className="landing-footer animate-fade-in">
          <p>
            Powered by <strong>MiniMax AI</strong> · Built for A1 (Beginner) Level
          </p>
        </footer>
      </div>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}
