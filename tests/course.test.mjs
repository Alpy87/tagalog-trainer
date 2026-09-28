import assert from 'node:assert/strict';
import { lessons, normalize, parseProgress, schedule } from '../lib/course.ts';
const now = 1000;
assert.equal(schedule(undefined, true, now).due, now + 86400000);
assert.equal(schedule({ streak: 2, due: 0 }, true, now).due, now + 7 * 86400000);
assert.deepEqual(schedule({ streak: 4, due: 0 }, false, now), { streak: 0, due: now + 600000 });
assert.equal(schedule({ streak: 5, due: 0 }, true, now).streak, 5);
assert.equal(normalize('  Ako  si Alex! '), normalize('ako si alex'));
const progress = { completed: ['introductions'], reviews: { 'introductions:0': schedule(undefined, true, now) }, active: { id: 'clarify', step: 2 } };
assert.deepEqual(parseProgress(JSON.stringify(progress)), progress);
assert.throws(() => parseProgress('{broken'));
assert.throws(() => parseProgress('{}'));
assert.deepEqual(parseProgress(JSON.stringify({ completed: ['unknown'], reviews: { bad: { due: 0, streak: 1 } } })).completed, []);
assert.equal(lessons.length, 7);
assert.equal(new Set(lessons.map(l => l.id)).size, 7);
for (const l of lessons) { assert.equal(l.phrases.length, 4); assert.equal(l.checks.length, 2); }
console.log('Course scheduling, recall normalization, and backup checks passed.');
