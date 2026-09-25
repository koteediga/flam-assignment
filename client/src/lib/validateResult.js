/**
 * Turns raw model text into { topic, cards } or throws.
 * Every failure mode from the assignment brief funnels through here:
 * malformed JSON, wrong shape, and "technically valid but empty" all
 * become a thrown Error with a message the UI can show as-is.
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
    .map((c, i) => ({
      id: `card-${i}`,
      question: c.question.trim(),
      answer: c.answer.trim(),
    }))
    .filter((c) => c.question && c.answer);

  if (cards.length === 0) {
    throw new Error('No usable flashcards came back. Try a more specific topic or paste more notes.');
  }

  return {
    topic: typeof parsed.topic === 'string' ? parsed.topic.trim() : '',
    cards,
  };
}

// Some models wrap JSON in ```json ... ``` even when told not to. Strip it
// defensively rather than trusting every provider to follow instructions.
function stripCodeFences(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1] : trimmed;
}
