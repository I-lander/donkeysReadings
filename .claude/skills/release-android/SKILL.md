---
name: release-android
description: Guided Android release - version bump, API URL check, APK or AAB build, output location. Trigger when the user wants to build a release, an APK, an AAB, publish to the Play Store, or install the app on a device. Keywords - release, APK, AAB, bundle, Play Store, android build, versionCode.
---

# Android release

## 1. Pick the target

- **APK** (`npm run build:apk`): direct install / sideload.
- **AAB** (`npm run build:bundle`): Play Store upload.
- **Device install** (`npm run install:android`): debug run on a connected device, no
  version bump needed, skip to step 4.

## 2. Version bump (releases only)

Preferred: the versioning scripts (they edit, commit and push; confirm before running):

- `npm run version:patch` / `version:minor` / `version:major`: bumps `package.json`,
  `package-lock.json` and `versionName`, then commits, tags `v<version>` and pushes.
  The tag triggers the CI release workflow (`.github/workflows/build-android.yml`).
- `npm run upgrade-android-version-code`: increments `versionCode` (Play Store rejects
  a reused code), commits and pushes. Run it before each Play Store upload.

Manual fallback: edit both values in `android/app/build.gradle` (`defaultConfig`).
Show the current values and the proposed bump, confirm before editing.

## 3. API URL check (blocking)

The Android app is a static bundle: `VITE_API_URL` in `.env` is baked in at build time.

- Verify it is set and points to the **deployed** server (the Render service in
  `render.yaml`), not localhost.
- Wrong or missing value: stop and ask, a build with a bad URL is a dud.

## 4. Build

`JAVA_HOME` must point at JDK 21 (see `install:android` in `package.json` for the
expected path). Then run the chosen script. Report the Gradle result verbatim on
failure.

## 5. Outputs

- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/`

State the actual file path and size at the end. Note: release signing is driven by the
`ANDROID_KEYSTORE_FILE` / `ANDROID_KEYSTORE_PASSWORD` / `ANDROID_KEY_ALIAS` /
`ANDROID_KEY_PASSWORD` environment variables (set in CI); a local build without them is
unsigned, say so if it happens. CI builds run in `.github/workflows/build-android.yml`
on `v*` tags and attach the APK + AAB to the GitHub release (and upload to the Play
Store internal track when `PLAY_SERVICE_ACCOUNT_JSON` is configured).
