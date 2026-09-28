export const lessons = [
  { id: 'introductions', title: 'Meet a colleague', goal: 'Introduce yourself and ask a name.',
    pattern: 'Use Ako si + name to introduce yourself. Ako means I; ikaw means you. Add po when a polite register fits, especially with unfamiliar adults.',
    phrases: [['Kumusta?', 'How are you?'], ['Ako si Alex.', 'I am Alex.'], ['Ano ang pangalan mo?', 'What is your name?'], ['Ikinagagalak kitang makilala.', 'Pleased to meet you.']],
    dialogue: ['A: Kumusta? Ako si Alex.', 'B: Ako si Ana. Ikinagagalak kitang makilala.'],
    checks: [['Introduce yourself as Alex.', 'Ako si Alex'], ['Ask someone their name.', 'Ano ang pangalan mo']],
    task: 'Meet a new colleague. Introduce yourself, ask their name, and respond to their greeting.' },
  { id: 'clarify', title: 'Ask for help understanding', goal: 'Ask someone to repeat or slow down.',
    pattern: 'Puwede po bang…? introduces a polite request. Hindi means not. Use these phrases whenever you need help, including during later lessons.',
    phrases: [['Hindi ko maintindihan.', 'I do not understand.'], ['Puwede po bang ulitin?', 'Could you repeat that?'], ['Dahan-dahan lang po.', 'Slowly, please.'], ['Salamat po.', 'Thank you.']],
    dialogue: ['A: Kumusta? Ano ang pangalan mo?', 'B: Puwede po bang ulitin?', 'A: Ano ang pangalan mo?', 'B: Ako si Alex. Salamat po.'],
    checks: [['Say that you do not understand.', 'Hindi ko maintindihan'], ['Politely ask someone to repeat.', 'Puwede po bang ulitin']],
    task: 'Meet someone who speaks too quickly. Ask for repetition, then introduce yourself.' },
  { id: 'food', title: 'Order lunch', goal: 'Ask for food and water politely.',
    pattern: 'Gusto ko ng + noun means I want [something]. Pahingi po ng… is a polite way to ask for something. Ng links these expressions to what you want.',
    phrases: [['Gusto ko ng kanin.', 'I want rice.'], ['Pahingi po ng tubig.', 'Water, please.'], ['May manok po ba?', 'Is there chicken?'], ['Ito po.', 'This one, please.']],
    dialogue: ['A: Ano ang gusto mo?', 'B: Gusto ko ng kanin. May manok po ba?', 'A: Meron.', 'B: Pahingi po ng tubig. Salamat po.'],
    checks: [['Say you want rice.', 'Gusto ko ng kanin'], ['Ask for water politely.', 'Pahingi po ng tubig']],
    task: 'Order lunch at a small eatery. Ask whether chicken is available and request water.' },
  { id: 'prices', title: 'Buy something', goal: 'Ask a price and request a quantity.',
    pattern: 'Magkano means how much. Isa, dalawa, tatlo mean one, two, three. Before a noun, isa becomes isang: isang tubig (one water).',
    phrases: [['Magkano po ito?', 'How much is this?'], ['Isa lang po.', 'Just one, please.'], ['Dalawa po.', 'Two, please.'], ['May sukli po ba kayo?', 'Do you have change?']],
    dialogue: ['A: Magkano po ito?', 'B: Bente pesos.', 'A: Isa lang po. Salamat po.'],
    checks: [['Ask the price of this item.', 'Magkano po ito'], ['Request just one politely.', 'Isa lang po']],
    task: 'Buy water at a shop. Ask the price, choose a quantity, and ask for repetition if needed. Bente means twenty.' },
  { id: 'directions', title: 'Get around Manila', goal: 'Ask where a place is and guide a driver.',
    pattern: 'Saan means where. Nasaan ang…? asks where something is. Sa introduces a place or destination. Dito means here; doon means there.',
    phrases: [['Nasaan ang opisina?', 'Where is the office?'], ['Sa Makati po.', 'To Makati, please.'], ['Dito na lang po.', 'Here is fine, please.'], ['Kaliwa po.', 'Left, please.']],
    dialogue: ['A: Saan po kayo pupunta?', 'B: Sa Makati po.', 'A: Dito?', 'B: Dito na lang po. Salamat po.'],
    checks: [['Ask where the office is.', 'Nasaan ang opisina'], ['Tell the driver here is fine.', 'Dito na lang po']],
    task: 'Tell a driver your destination, ask for a left turn, and say where to stop. Saan po kayo pupunta? means Where are you going?' },
  { id: 'work', title: 'Talk about your work', goal: 'Explain where you work and invite a colleague to eat.',
    pattern: 'Nagtatrabaho ako sa + place means I work at/in [place]. Tayo means we including the listener. Kain tayo! is an everyday invitation to eat.',
    phrases: [['Nagtatrabaho ako sa Manila.', 'I work in Manila.'], ['Sa sales ako nagtatrabaho.', 'I work in sales.'], ['Kain tayo!', 'Let us eat!'], ['Libre ka ba bukas?', 'Are you free tomorrow?']],
    dialogue: ['A: Saan ka nagtatrabaho?', 'B: Sa sales ako nagtatrabaho.', 'A: Kain tayo!', 'B: Salamat!'],
    checks: [['Say you work in Manila.', 'Nagtatrabaho ako sa Manila'], ['Ask whether someone is free tomorrow.', 'Libre ka ba bukas']],
    task: 'Chat with a colleague over lunch. Introduce yourself, explain your work, and ask about tomorrow. Saan ka nagtatrabaho? means Where do you work?' },
  { id: 'week-one', title: 'Put it together', goal: 'Handle a short everyday exchange without notes.',
    pattern: 'Combine familiar patterns. Ask for clarification rather than guessing. Today is a checkpoint, not a fluency test: recall first, then check the examples.',
    phrases: [['Nag-aaral ako ng Tagalog.', 'I am learning Tagalog.'], ['Kaunti pa lang.', 'Only a little so far.'], ['Puwede po bang ulitin?', 'Could you repeat that?'], ['Salamat sa tulong.', 'Thank you for the help.']],
    dialogue: ['A: Nagsasalita ka ba ng Tagalog?', 'B: Kaunti pa lang. Nag-aaral ako ng Tagalog.', 'A: Kain tayo!', 'B: Salamat!'],
    checks: [['Say you are learning Tagalog.', 'Nag-aaral ako ng Tagalog'], ['Thank someone for their help.', 'Salamat sa tulong']],
    task: 'Meet a colleague, introduce yourself, order lunch, ask the price, and explain you are learning Tagalog. Nagsasalita ka ba ng Tagalog? means Do you speak Tagalog?' },
];

export type Review = { due: number; streak: number };
export type Progress = { completed: string[]; reviews: Record<string, Review>; active?: { id: string; step: number } };
export const emptyProgress = (): Progress => ({ completed: [], reviews: {} });
export const normalize = (s: string) => s.toLowerCase().replace(/[.!?,]/g, '').replace(/\s+/g, ' ').trim();
export function schedule(previous: Review | undefined, recalled: boolean, now = Date.now()): Review {
  const streak = recalled ? Math.min((previous?.streak || 0) + 1, 5) : 0;
  const days = [0, 1, 3, 7, 14, 30][streak];
  return { streak, due: now + (recalled ? days * 86400000 : 600000) };
}
export function parseProgress(raw: string | null): Progress {
  if (!raw) return emptyProgress();
  const p = JSON.parse(raw);
  if (!p || !Array.isArray(p.completed) || !p.reviews || typeof p.reviews !== 'object') throw new Error('Invalid progress');
  const validIds = new Set(lessons.map(l => l.id));
  const validCards = new Set(lessons.flatMap(l => l.phrases.map((_, i) => `${l.id}:${i}`)));
  return {
    completed: [...new Set<string>(p.completed.filter((id: unknown) => typeof id === 'string' && validIds.has(id)))],
    reviews: Object.fromEntries(Object.entries(p.reviews).filter(([id, r]) => validCards.has(id) && !!r &&
      typeof r === 'object' && 'due' in r && typeof r.due === 'number' && Number.isFinite(r.due) &&
      'streak' in r && typeof r.streak === 'number' && Number.isInteger(r.streak) && r.streak >= 0 && r.streak <= 5)) as Record<string, Review>,
    active: p.active && validIds.has(p.active.id) && Number.isInteger(p.active.step) && p.active.step >= 0 && p.active.step <= 3 ? p.active : undefined,
  };
}

