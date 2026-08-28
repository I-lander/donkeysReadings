# Verify before concluding

> Outranks every other rule in this repo when they conflict.

## Every claim must be sourced

- A claim about the codebase comes from a **file actually read** in this session, never
  from memory or inference from a nearby name.
- A claim about runtime behavior (a bug, a fix working) comes from an **observed
  result**: build output, server response, console/log line, or the app actually run.
- Cite code by **file path + symbol name** (component, function, script name). In
  committed docs, no line numbers: they drift on the first refactor.

## No hypotheses passed off as facts

- A hypothesis is allowed only when explicitly labelled (`Hypothesis (unconfirmed):`)
  and accompanied by what would confirm or refute it.
- When proof is missing, go get it (read the file, run the build, hit the endpoint)
  rather than guessing. If proof cannot be obtained, say so.

## Self-check

Before any "this is the bug" or "this now works": *which file, output line, or observed
behavior backs this?* If the answer is "none", it is a hypothesis, not a conclusion.
