/**
 * Calls our own backend proxy — never the LLM provider directly.
 * Returns the raw string the model produced; parsing/validation happens
 * separately in validateResult.js so the two concerns stay easy to reason
 * about on their own.
 */
export async function generateFlashcards(input, { signal } = {}) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ input }),
    signal,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  if (!body || typeof body.raw !== 'string') {
    throw new Error('Server response was missing the model output');
  }
  return body.raw;
}
