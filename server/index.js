import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100kb' }));

const PORT = process.env.PORT || 8787;
const MODEL = process.env.MODEL || 'meta-llama/llama-3.1-8b-instruct:free';
const API_KEY = process.env.OPENROUTER_API_KEY;

// Everything the model needs to know about the shape we require lives here,
// in one place, so the prompt and the client-side validator can't drift apart.
const SYSTEM_PROMPT = `You turn a study topic or pasted notes into flashcards.
Return ONLY valid JSON. No markdown fences, no commentary, no leading or trailing text.

Shape (exactly this, nothing extra):
{
  "topic": string,
  "cards": [
    { "question": string, "answer": string }
  ]
}

Rules:
- 5 to 10 cards.
- Each question and answer must be non-empty and self-contained (no "see above").
- If the input is too short or nonsensical to make real cards from, return { "topic": "", "cards": [] } instead of inventing filler.`;

app.post('/api/generate', async (req, res) => {
  const { input } = req.body ?? {};

  if (typeof input !== 'string' || !input.trim()) {
    return res.status(400).json({ error: 'input must be a non-empty string' });
  }
  if (input.length > 4000) {
    return res.status(400).json({ error: 'input too long (max 4000 chars)' });
  }
  if (!API_KEY) {
    return res.status(500).json({ error: 'server is missing OPENROUTER_API_KEY' });
  }

  // Bail out on a stuck upstream call rather than letting the client hang forever.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.4,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: input.trim() },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('Upstream error', upstream.status, detail);
      return res.status(502).json({ error: 'model provider returned an error' });
    }

    const data = await upstream.json();
    const raw = data?.choices?.[0]?.message?.content;

    if (typeof raw !== 'string' || !raw.trim()) {
      return res.status(502).json({ error: 'model returned an empty response' });
    }

    // We deliberately do NOT parse/validate the shape here beyond "it's a
    // string" — that logic lives once, client-side, in validateResult.js.
    // The server's job is just: hide the key, call the model, pass raw text back.
    res.json({ raw });
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'model took too long to respond' });
    }
    console.error(err);
    res.status(500).json({ error: 'unexpected server error' });
  } finally {
    clearTimeout(timeout);
  }
});

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server listening on http://localhost:${PORT}`));
