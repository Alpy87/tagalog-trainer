'use client';
import Link from 'next/link';
export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return <div className="modal-overlay" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="settings-title" onClick={e => e.stopPropagation()} onKeyDown={e => { if (e.key === 'Escape') onClose(); }}>
    <div className="modal-header"><h2 id="settings-title">Learning settings</h2><button autoFocus className="btn btn-icon" aria-label="Close settings" onClick={onClose}>✕</button></div>
    <div className="modal-body"><p>Your course progress and chat history are saved in this browser. Export and restore course progress from the guided lesson page.</p><p>AI configuration is managed on your server. You do not need to enter an API key here.</p><p>Guided lessons and recall checks work even when the AI service is unavailable.</p><Link href="/learn" onClick={onClose}>Open today&apos;s lesson →</Link></div>
  </section></div>;
}
