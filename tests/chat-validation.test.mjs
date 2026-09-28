import assert from 'node:assert/strict';
import { validateUIMessages, convertToModelMessages } from 'ai';

function validateMessages(messages) {
  if (messages.some(m => !['user', 'assistant'].includes(m.role) ||
      (m.role === 'user' && m.parts.some(p => p.type !== 'text' || p.text.length > 12000)) ||
      (m.role === 'assistant' && m.parts.some(p => (p.type === 'text' && p.text.length > 12000) ||
          !['text', 'step-start', 'reasoning'].includes(p.type))))) {
    throw new Error('Only text messages are supported.');
  }
  return true;
}

// Multi-turn role-play conversation from useChat stream
const multiTurn = [
  { id: 'm1', role: 'user', parts: [{ type: 'text', text: 'Start this lesson role-play.' }] },
  { id: 'm2', role: 'assistant', parts: [{ type: 'step-start' }, { type: 'text', text: 'Kumusta! Ako si Alex.' }] },
  { id: 'm3', role: 'user', parts: [{ type: 'text', text: 'Ako si Joachim' }] }
];

const validated = await validateUIMessages({ messages: multiTurn });
assert.equal(validateMessages(validated), true);

const modelMessages = await convertToModelMessages(validated);
assert.equal(modelMessages.length, 3);
assert.equal(modelMessages[0].role, 'user');
assert.equal(modelMessages[1].role, 'assistant');
assert.equal(modelMessages[2].role, 'user');

// Reject user attachments
assert.throws(() => validateMessages([{ id: '1', role: 'user', parts: [{ type: 'file', data: 'xyz' }] }]));

// Reject text longer than 12000
assert.throws(() => validateMessages([{ id: '1', role: 'user', parts: [{ type: 'text', text: 'x'.repeat(12001) }] }]));

console.log('Multi-turn chat validation tests passed.');
