'use client';

import React, { useState, useEffect } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('MiniMax-M3');
  const [baseUrl, setBaseUrl] = useState('https://api.minimax.io/v1');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiKey(localStorage.getItem('minimax_api_key') || '');
      setModel(localStorage.getItem('minimax_model') || 'MiniMax-M3');
      setBaseUrl(localStorage.getItem('minimax_base_url') || 'https://api.minimax.io/v1');
    }
  }, [isOpen]);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('minimax_api_key', apiKey);
      localStorage.setItem('minimax_model', model);
      localStorage.setItem('minimax_base_url', baseUrl);
    }
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClearAll = () => {
    if (typeof window !== 'undefined' && window.confirm('Clear all chat history and settings? This cannot be undone.')) {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('chat-') || key.startsWith('minimax_')) {
          localStorage.removeItem(key);
        }
      });
      setApiKey('');
      setModel('MiniMax-M3');
      setBaseUrl('https://api.minimax.io/v1');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">⚙️ Settings</h2>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="apiKey" className="form-label">
              Minimax API Key
            </label>
            <input
              id="apiKey"
              type="password"
              className="form-input"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key..."
            />
            <p className="form-hint">
              Your key is stored locally in your browser and sent only to your own server.
            </p>
          </div>
          <div className="form-group">
            <label htmlFor="model" className="form-label">
              Model
            </label>
            <input
              id="model"
              type="text"
              className="form-input"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="MiniMax-M3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="baseUrl" className="form-label">
              API Base URL
            </label>
            <input
              id="baseUrl"
              type="text"
              className="form-input"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              placeholder="https://api.minimax.io/v1"
            />
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-danger" onClick={handleClearAll}>
            Clear All Data
          </button>
          <div className="modal-footer-right">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? '✓ Saved!' : 'Save Settings'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
