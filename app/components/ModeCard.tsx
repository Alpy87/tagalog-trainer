'use client';

import React from 'react';
import Link from 'next/link';
import { ModeConfig } from '@/lib/types';

interface ModeCardProps {
  mode: ModeConfig;
  index: number;
}

export default function ModeCard({ mode, index }: ModeCardProps) {
  return (
    <Link
      href={`/modes/${mode.id}`}
      className="mode-card"
      data-mode={mode.id}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="mode-card-icon">{mode.emoji}</div>
      <h3 className="mode-card-title">{mode.title}</h3>
      <p className="mode-card-description">{mode.shortDescription}</p>
      <div className="mode-card-arrow">→</div>
    </Link>
  );
}
