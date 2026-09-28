/**
 * Turns raw model text into { topic, cards } or throws.
 * Every failure mode from the assignment brief funnels through here:
 * malformed JSON, wrong shape, and "technically valid but empty" all
 * become a thrown Error with a message the UI can show as-is.
 *
 * Each card always has question + answer (enough for flashcards).
 * `options` is only kept when it passes its own checks, so a card with
 * broken choices still works as a flashcard and is just left out of the quiz.
 */
export function validateResult(raw) {
  const cleaned = stripCodeFences(raw);

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("The model didn't return valid JSON. Try rephrasing your topic.");
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('The model returned an unexpected shape.');
  }

  if (!Array.isArray(parsed.cards)) {
    throw new Error('The model response was missing a "cards" list.');
  }

  const cards = parsed.cards
    .filter((c) => c && typeof c.question === 'string' && typeof c.answer === 'string')
    .map((c, i) => {
      const answer = c.answer.trim();
      return {
        id: `card-${i}`,
        question: c.question.trim(),
        answer,
        options: cleanOptions(c.options, answer),
      };
    })
    .filter((c) => c.question && c.answer);

  if (cards.length === 0) {
    throw new Error('No usable flashcards came back. Try a more specific topic or paste more notes.');
  }

  return {
    topic: typeof parsed.topic === 'string' ? parsed.topic.trim() : '',
    cards,
  };
}

// Returns a clean list of 3-6 unique choices that include the answer, or null.
function cleanOptions(options, answer) {
  if (!Array.isArray(options)) return null;

  const seen = new Set();
  const cleaned = [];
  for (const option of options) {
    if (typeof option !== 'string') continue;
    const text = option.trim();
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    // Models sometimes change the casing of the correct choice; snap it back.
    cleaned.push(key === answer.toLowerCase() ? answer : text);
  }

  if (cleaned.length < 3 || cleaned.length > 6) return null;
  if (!cleaned.includes(answer)) return null;
  return cleaned;
}

// Some models wrap JSON in ```json ... ``` even when told not to. Strip it
// defensively rather than trusting every provider to follow instructions.
function stripCodeFences(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1] : trimmed;
}