# Secrets & environment

## Rule

- **Never print, echo, or commit the value of `OPENAI_API_KEY`** (or any other secret).
  Read `.env` only to check that a key *is set*, never to display it.
- `.env` is never committed; `.env.sample` is the committed template. A new env var goes
  in **both** `.env.sample` (with a placeholder) and, if server-side, `render.yaml`
  (`sync: false` for secrets).
- Client-side env vars must be prefixed `VITE_` (e.g. `VITE_API_URL`); anything else is
  invisible to the Vite bundle. Server-side vars are read via `dotenv` in
  `server/index.ts`.

## Key split

- `OPENAI_API_KEY`: server only (`server/index.ts`, Render env). Must never appear in
  `src/` or in the built bundle.
- `VITE_API_URL`: client only, points the Android build to the deployed API. Baked in
  at build time, so an Android build made with the wrong value ships the wrong URL.
