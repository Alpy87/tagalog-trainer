import Link from 'next/link';
import { lessons } from '@/lib/course';
export default function PlanPage() {
  return <main className="course"><Link href="/">← Home</Link><p className="course-eyebrow">YOUR FIRST SEVEN SESSIONS</p><h1>A clear start for life in Manila</h1><p>About 20 minutes per session: recall, one useful pattern, spoken practice, and a short check. Repeat a lesson when needed; these are foundations, not a promise of fluency.</p><Link className="btn btn-primary" href="/learn">Start or resume today&apos;s lesson →</Link>
    <ol>{lessons.map(l => <li key={l.id} className="course-card"><h2>{l.title}</h2><p>{l.goal}</p><p>{l.phrases.length} phrases · guided practice · recall check</p></li>)}</ol>
    <h2>What comes next</h2><p>After these foundations: housing, making plans, longer social conversations, and workplace relationships. Future units are not available yet. Your first-week reviews remain scheduled.</p><p>Use the optional AI modes for extra practice. Add regular conversations with a Filipino speaker and native-speaker audio as you progress.</p></main>;
}
