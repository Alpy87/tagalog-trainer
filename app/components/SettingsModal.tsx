'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
export default function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (isOpen && !element?.open) element?.showModal();
    if (!isOpen && element?.open) element.close();
  }, [isOpen]);
  return <dialog ref={dialog} className="modal settings-dialog" aria-labelledby="settings-title" onCancel={onClose} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <div className="modal-header"><h2 id="settings-title">Learning settings</h2><button autoFocus className="btn btn-icon" aria-label="Close settings" onClick={onClose}>✕</button></div>
    <div className="modal-body"><p>Your course progress and chat history are saved in this browser. Export and restore course progress from the guided lesson page.</p><p>AI configuration is managed on your server. You do not need to enter an API key here.</p><p>Guided lessons and recall checks work even when the AI service is unavailable.</p><Link href="/learn" onClick={onClose}>Open today&apos;s lesson →</Link></div>
  </dialog>;
}
