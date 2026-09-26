/**
 * Calls our own backend proxy — never the LLM provider directly.
 * Returns the raw string the model produced; parsing/validation happens
 * separately in validateResult.js so the two concerns stay easy to reason
 * about on their own.
 *
 * VITE_API_URL is unset in local dev, so this falls back to a relative path
 * that Vite's dev proxy forwards to localhost:8787 (see vite.config.js).
 * In production (Vercel), VITE_API_URL points at the deployed Render backend.
 */
const API_BASE = import.meta.env.VITE_API_URL || '';

export async function generateFlashcards(input, { signal } = {}) {
  const res = await fetch(`${API_BASE}/api/generate`, {
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