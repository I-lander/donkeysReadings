/** Tiny haptics helper: navigator.vibrate works in the Android WebView once the
 * VIBRATE permission is declared in the manifest; it is a silent no-op elsewhere. */

const canVibrate = typeof navigator !== 'undefined' && 'vibrate' in navigator;

function vibrate(pattern: number | number[]) {
  if (!canVibrate) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    // Some WebViews throw without the permission: juice must never crash the app.
  }
}

export const haptics = {
  /** Light tick for taps (buttons, chips, tabs). */
  tap: () => vibrate(12),
  /** A card lands face up. */
  reveal: () => vibrate(24),
  /** Celebration (streak up, credit unlocked). */
  success: () => vibrate([18, 60, 24, 60, 40]),
};
