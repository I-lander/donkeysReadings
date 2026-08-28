# Language - versioned content in English

## Rule

- **All versioned content is in English**: `CLAUDE.md`, `.claude/rules/*`, skill
  `SKILL.md`, README, code comments, commit messages.
- No French inside a committed file, even for a one-line addition.

## What stays in French

- Direct explanations in chat follow the conversation language.
- The distinction is **artifact vs conversation**: committed content is English, the
  spoken explanation around it can be French.

## User-facing app strings

- The app itself is bilingual (EN/FR toggle). Every user-facing string added to the app
  must exist in **both languages**, following the existing pattern in
  `src/constants/constants.ts` and the `nameEn` / `nameFr` card fields.
