'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { lessons, normalize, parseProgress, schedule, type Progress } from '@/lib/course';

const storageKey = 'tagalog-course-v1';
const steps = ['Recall', 'Learn', 'Practice', 'Check'];
export default function LearnPage() {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState(['', '']);
  const [checked, setChecked] = useState(false);
  const [practiced, setPracticed] = useState(false);
  const [finished, setFinished] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState('');
  const [now, setNow] = useState(0);
  useEffect(() => {
    // Load browser-only state after hydration; never replace unreadable saved data.
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProgress(parseProgress(localStorage.getItem(storageKey)));
      setNow(Date.now());
    } catch { setError('Saved progress could not be loaded. Enable browser storage or restore a valid backup.'); }
    return () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); };
  }, []);
  function save(next: Progress) {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setProgress(next); setError(''); return true; }
    catch { setError('Progress was not saved. Browser storage may be full or disabled.'); return false; }
  }
  function speak(text: string, slow = false) {
    if (!('speechSynthesis' in window)) { setVoiceNotice('Speech playback is unavailable in this browser.'); return; }
    const voice = window.speechSynthesis.getVoices().find(v => /^(fil|tl)(-|$)/i.test(v.lang));
    if (!voice) { setVoiceNotice('No Filipino voice is available on this device. Read the dialogue aloud; use a native-speaker recording for listening practice.'); return; }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice; utterance.rate = slow ? 0.75 : 1;
    utterance.onerror = () => setVoiceNotice('Audio playback failed. Please try again.');
    window.speechSynthesis.speak(utterance);
    setVoiceNotice('Synthetic Filipino audio — useful practice, not a pronunciation assessment.');
  }
  function exportProgress() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(progress)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = 'tagalog-progress.json'; a.click(); URL.revokeObjectURL(url);
  }
  if (!progress) return <main className="course"><Link href="/">← Home</Link><p role="status">{error || 'Loading your lesson…'}</p></main>;
  const lesson = lessons.find(l => l.id === progress.active?.id) || lessons.find(l => !progress.completed.includes(l.id)) || lessons[0];
  const step = progress.active?.step || 0;
  const due = Object.entries(progress.reviews).filter(([, r]) => r.due <= now);
  const card = due[0];
  const phrase = card ? lessons.find(l => l.id === card[0].split(':')[0])!.phrases[Number(card[0].split(':')[1])] : null;
  const allCorrect = lesson.checks.every((c, i) => normalize(answers[i]) === normalize(c[1]));
  function advance() {
    if (save({ ...progress!, active: { id: lesson.id, step: step + 1 } })) { setRevealed(false); setChecked(false); }
  }
  function complete() {
    const reviews = { ...progress!.reviews };
    lesson.phrases.forEach((_, i) => { const id = `${lesson.id}:${i}`; reviews[id] ||= schedule(undefined, true); });
    if (save({ ...progress!, completed: [...new Set([...progress!.completed, lesson.id])], reviews, active: undefined })) setFinished(true);
  }
  return <main className="course">
    <nav><Link href="/">← Home</Link><Link href="/plan">Course plan</Link></nav>
    <p className="course-eyebrow">MANILA • BEGINNER FOUNDATIONS</p>
    <h1>{finished ? 'Session complete' : 'Today’s 20-minute lesson'}</h1>
    <p>{progress.completed.length} of 7 lessons checked · {due.length} phrases due for recall</p>
    <progress aria-label="Lessons completed" max={7} value={progress.completed.length} />
    <p className="course-note">Progress stays in this browser. Export a backup before switching devices. Completion measures typed recall, not speaking fluency.</p>
    {error && <p role="alert">{error}</p>}
    {finished ? <section className="course-card"><h2>Good work—come back for your scheduled review.</h2><p>New phrases return tomorrow. Missed review phrases return after 10 minutes.</p><button className="btn btn-primary" onClick={() => { setFinished(false); setAnswers(['', '']); setPracticed(false); setChecked(false); setNow(Date.now()); }}>Continue learning</button></section> : <>
      <h2>{lesson.title}</h2><p>{lesson.goal}</p>
      <ol className="course-steps">{steps.map((s, i) => <li key={s} aria-current={i === step ? 'step' : undefined}>{i + 1}. {s}</li>)}</ol>
      <section className="course-card">
      {step === 0 && <><h3>Recall first · about 4 minutes</h3>{phrase ? <>
        <p>Say this in Tagalog before revealing the answer:</p><h2>{phrase[1]}</h2>
        {!revealed ? <button className="btn btn-primary" onClick={() => setRevealed(true)}>Reveal answer</button> : <>
          <p lang="fil">{phrase[0]}</p><div className="course-actions">{[false, true].map(ok => <button className="btn btn-secondary" key={String(ok)} onClick={() => {
            if (save({ ...progress, reviews: { ...progress.reviews, [card![0]]: schedule(card![1], ok) } })) { setRevealed(false); setNow(Date.now()); }
          }}>{ok ? 'Recalled without help' : 'Needed help'}</button>)}</div></>}
      </> : <><p>No reviews due. Start with your lesson, then return tomorrow to retrieve these phrases from memory.</p><button className="btn btn-primary" onClick={advance}>Start lesson</button></>}</>}
      {step === 1 && <><h3>One useful pattern · about 6 minutes</h3><p>{lesson.pattern}</p>
        <h3>Short dialogue</h3>{lesson.dialogue.map((line, i) => <p lang="fil" key={i}>{line}</p>)}
        <div className="course-actions"><button className="btn btn-secondary" onClick={() => speak(lesson.dialogue.map(l => l.slice(3)).join(' '))}>Listen</button><button className="btn btn-secondary" onClick={() => speak(lesson.dialogue.map(l => l.slice(3)).join(' '), true)}>Listen slowly</button></div>
        <p role="status">{voiceNotice}</p>
        <dl>{lesson.phrases.map(([tl, en]) => <div key={tl}><dt lang="fil">{tl}</dt><dd>{en}</dd></div>)}</dl>
        <button className="btn btn-primary" onClick={advance}>I’m ready to practice</button></>}
      {step === 2 && <><h3>Use it aloud · about 6 minutes</h3><p>{lesson.task}</p><p>Say your replies aloud without hints. Open the phrase guide only if you get stuck.</p>
        <details><summary>Phrase guide</summary>{lesson.phrases.map(([tl, en]) => <p key={tl}><span lang="fil">{tl}</span> — {en}</p>)}</details><Link className="btn btn-secondary" href={`/modes/conversation?lesson=${lesson.id}`}>Optional AI role-play →</Link>
        <p>Your lesson will resume here when you return.</p><label><input type="checkbox" checked={practiced} onChange={e => setPracticed(e.target.checked)} /> I practiced the exchange aloud.</label>
        <p><button className="btn btn-primary" disabled={!practiced} onClick={advance}>Check my recall</button></p></>}
      {step === 3 && <><h3>Recall without hints · about 4 minutes</h3><p>Use the patterns from this lesson. Capitalization and punctuation do not matter.</p>
        {lesson.checks.map(([question, answer], i) => <div className="form-group" key={question}><label htmlFor={`answer-${i}`}>{question}</label><input className="form-input" id={`answer-${i}`} value={answers[i]} onChange={e => { setAnswers(answers.map((a, j) => j === i ? e.target.value : a)); setChecked(false); }} />
          {checked && <p>{normalize(answers[i]) === normalize(answer) ? '✓ Recalled' : `Model answer: ${answer}. Other natural answers may also be valid; this check uses the taught pattern.`}</p>}</div>)}
        {!checked ? <button className="btn btn-primary" disabled={answers.some(a => !a.trim())} onClick={() => setChecked(true)}>Check answers</button> : allCorrect ? <button className="btn btn-primary" onClick={complete}>Finish and schedule reviews</button> : <button className="btn btn-secondary" onClick={() => { setAnswers(['', '']); setChecked(false); }}>Hide answers and try again</button>}
      </>}
      </section>
    </>}
    <section className="course-tools"><button className="btn btn-secondary" onClick={exportProgress}>Export progress</button><label className="btn btn-secondary">Restore backup<input type="file" accept="application/json" onChange={async e => {
      const file = e.target.files?.[0]; if (!file) return;
      try { if (file.size > 100000) throw new Error(); const restored = parseProgress(await file.text());
        if (window.confirm('Replace this browser’s course progress with this backup?')) { save(restored); setFinished(false); setChecked(false); setAnswers(['', '']); setPracticed(false); setRevealed(false); setNow(Date.now()); }
      } catch { setError('This is not a valid progress backup. Nothing was replaced.'); }
    }} /></label></section>
  </main>;
}


