# Study Assistant

Paste notes or type a topic → get flashcards you can flip through, or a
self-graded quiz that lets you retest whatever you got wrong.

Built for the Flam Frontend Internship Assignment.

## Why this project

I picked the study-assistant option because "flip through cards / quiz /
retest wrong answers" gives real, stateful UI to build around structured
data — not just a list rendered from JSON.

## Stack

- **Frontend:** React (hooks, functional components) + Vite. No TypeScript, no CSS framework.
- **Backend:** a tiny Express server that holds the API key and proxies the LLM call — the key never reaches the browser.
- **Model:** OpenRouter (free tier), configurable via `.env`. Any OpenRouter chat model works; swap `MODEL` in `server/.env`.

## Setup

```bash
git clone <this-repo>
cd flam-frontend-assignment

# install both client and server deps
npm run install:all

# add your OpenRouter key
cp server/.env.example server/.env
# edit server/.env and paste your key from https://openrouter.ai/keys

# run both client and server together
npm run dev
```

Client runs at `http://localhost:5173`, backend at `http://localhost:8787`
(Vite proxies `/api/*` to it — see `client/vite.config.js`).

If you'd rather run them in two terminals:
```bash
npm run dev:server   # terminal 1
npm run dev:client   # terminal 2
```

## How it works

1. `PromptInput` takes free-form text (a topic, or pasted notes).
2. The frontend calls our **own** backend at `/api/generate` — never the LLM directly.
3. `server/index.js` holds the API key, sends a strict system prompt to OpenRouter asking for JSON only in a fixed shape, and returns the raw text.
4. `lib/validateResult.js` is the single place that decides whether that raw text is usable: valid JSON, right shape, non-empty cards. Anything else throws, and the UI shows an error state with retry — never a crash or a blank screen.
5. On success, `FlashcardDeck` (flip through cards) and `QuizView` (reveal-and-self-grade, with a "retest wrong answers" loop) render the same validated data two different ways.

### Handling bad output (the part most of the assignment is about)

| Failure | Where it's caught | What the user sees |
|---|---|---|
| Malformed JSON | `validateResult.js` `JSON.parse` catch | Error state, "Try again" |
| Wrong shape (missing `cards`, not an array) | `validateResult.js` shape checks | Error state, "Try again" |
| Empty / zero usable cards | `validateResult.js` after filtering | Error state, "Try again" |
| Slow response | 25s `AbortController` timeout in `server/index.js` | 504 → error state, no infinite spinner |
| Failed request / upstream error | try/catch in both server and `lib/api.js` | Error state, "Try again" |
| Stale response (slow first request resolves after a faster second one) | `requestId` ref in `App.jsx` — every response checks it's still the latest before touching state | Silently dropped; the newer result is never overwritten |

## AI usage note

I used Claude to scaffold this project end to end — the request/validation
pattern, component structure, and error-state design were drafted with AI
assistance and then reviewed and adjusted by me. I did not use AI to write
this note or the flashcard/quiz content itself (that's generated live by
the model at runtime, which is the point of the app). I can walk through
and explain any part of this code, including the request lifecycle and the
stale-response guard, live.

## Known limitations

- The quiz is self-graded (you judge your own answer), not auto-graded —
  auto-grading open-ended answers well would need either the model
  generating multiple-choice distractors (adds prompt complexity and another
  failure mode) or a second LLM call to grade free-text answers (slower,
  costs more, and is itself unreliable). Self-grading felt like the more
  honest trade-off for an 8-hour scope.
- No persistence — refreshing the page loses your current deck (see stretch
  goals below).
- Free-tier OpenRouter models are sometimes inconsistent about following the
  "JSON only" instruction; the fence-stripping in `validateResult.js` and
  the retry button exist specifically because of this.
- No auth, as specified — anyone with the URL can use it, rate-limited only
  by the model provider's own free-tier limits.

## If I had more time (stretch goals not attempted)

- Save/reload sessions to `localStorage`.
- Multiple-choice quiz mode with model-generated distractors.
- Streaming the response in as it generates.
- A refinement loop ("add 3 more cards about X") instead of regenerating from scratch.

## Time spent

~7.5 hours: ~1 hr planning the data shape and prompt, ~1 hr backend proxy
and error handling, ~4 hrs frontend components and state, ~1 hr CSS/mobile
pass, ~0.5 hr README and manual testing of failure modes (killed the
server mid-request, throttled network, fed it gibberish input, etc.).
