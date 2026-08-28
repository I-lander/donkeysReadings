# Dev workflow

## Two processes in dev

- `npm run server`: Express API on the port set in `server/index.ts` (OpenAI calls).
- `npm start`: Vite dev server on http://localhost:5173, proxies `/api` to the local
  Express server (see `vite.config.ts`).
- Both must run for the reading generation to work locally.

## Checks before declaring a change done

- `npm run build` runs `tsc` then `vite build`: it is the type check. A change is not
  done while it fails.
- Formatting: Prettier is a devDependency; run `npx prettier --write` on touched files
  when formatting drifts, do not hand-format.
- No test suite exists. Do not claim "tests pass"; verify by running the app instead
  (see the `run-app` skill).

## Platform gotchas (Windows)

- npm scripts use Windows syntax (`set "JAVA_HOME=..."`, `gradlew.bat`). Keep new
  scripts consistent with that; the Bash tool itself runs Git Bash.
- Android builds need `JAVA_HOME` pointing at JDK 21 (`install:android` shows the
  expected path).

## Where things live

- `src/` web app (React + TS), `server/` Express API, `public/assets/` images and
  fonts, `android/` generated Capacitor project.
- Files under `android/` are mostly generated: edit only `android/app/build.gradle`
  (versions) and manifest/resources when a change genuinely requires it; never edit
  files that `npx cap sync` regenerates (`android/app/src/main/assets/public/`).
