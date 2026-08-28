---
name: run-app
description: Start the app locally (Express API + Vite dev server) and verify it works end to end. Trigger when the user wants to run, start, test, or see the app, or to confirm a change works. Keywords - run, start, dev server, lancer l'app, tester, localhost, 5173.
---

# Run the app locally

## Preconditions

1. `node_modules` present, else `npm install`.
2. `.env` exists with `OPENAI_API_KEY` set (check presence only, never print the value,
   see `@.claude/rules/secrets.md`). Missing key: the app still runs but
   `/api/generateReading` returns 500; say so instead of blocking.

## Launch

Run both in the background:

```bash
npm run server   # Express API
npm start        # Vite on http://localhost:5173, proxies /api to the server
```

## Verify

1. Wait for Vite's "ready" line and the server's listen line.
2. `curl -s http://localhost:5173` returns the HTML shell.
3. Full check (costs one OpenAI call, do it only when the change touches the reading
   flow): POST `/api/generateReading` with a JSON body
   `{"question": "test", "cards": [{"nameEn": "The Fool", "nameFr": "Le Mat"}], "lang": "en"}`
   and expect a 200 with reading text.

## Rules

- Report the URL and the actual observed output, not "it should work".
- Leave the processes running for the user unless they ask to stop them.
