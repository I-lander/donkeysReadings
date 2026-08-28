# Commit & branch conventions

> Applies to every commit and branch created in this repo.

## Language - English only

- **All commit messages are in English**, subject line and body.

## Commit subject - conventional prefix

- `<type>: <summary>` with type in `feat`, `fix`, `refactor`, `chore`, `docs`, `style`.
- Matches the existing history (`refactor: migrate Next.js app to Vite + TypeScript + Capacitor (Android)`).

## Commit body - prose

- The body is written as **prose**: full sentences explaining *what* changed and *why*,
  not a raw bullet dump of file names.
- A short bulleted list is fine *after* a prose lead-in when several distinct changes
  ship together.

## Branch name - concise

- Pattern: `<type>/<short-slug>`, kebab-case (e.g. `feat/share-sheet`, `fix/card-shuffle`).
- A few words, enough to identify the work, not to describe it.

## Confirm intent

- **Confirm before any commit, push, or branch creation**: restate in one line what is
  about to happen and wait for explicit confirmation.
