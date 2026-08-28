import { useState } from 'react';
import type { TranslatedText } from '../constants/constants';
import { AD_RUNNING, COME_BACK, SHEET_TEXT, SHEET_TITLE, WATCH_AD } from '../constants/uiText';

interface AdSheetProps {
  open: boolean;
  translated: (t: TranslatedText) => string;
  onClose: () => void;
  /** Shows the rewarded ad + waits for the SSV credit; resolves true when granted. */
  requestAd: () => Promise<boolean>;
  /** Called once the credit landed; the caller retries the pending reading. */
  onUnlocked: () => void;
}

/** Bottom sheet shown when the daily quota is exhausted. */
export function AdSheet({ open, translated, onClose, requestAd, onUnlocked }: AdSheetProps) {
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function onWatch() {
    if (busy) return;
    setBusy(true);
    try {
      const granted = await requestAd();
      if (granted) onUnlocked();
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <div className="scrim" onClick={busy ? undefined : onClose} />
      <div className="ad-sheet">
        <div className="ad-sheet__handle" />
        <div className="ad-sheet__title">{translated(SHEET_TITLE)}</div>
        <p className="ad-sheet__text">{translated(SHEET_TEXT)}</p>
        <button
          className={`btn btn--primary ad-sheet__cta${busy ? ' ad-sheet__cta--busy' : ''}`}
          onClick={onWatch}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="5" width="20" height="14" rx="3" />
            <path d="M10 9.5l5 2.5-5 2.5z" />
          </svg>
          {translated(busy ? AD_RUNNING : WATCH_AD)}
        </button>
        <button className="btn btn--ghost ad-sheet__dismiss" onClick={onClose} disabled={busy}>
          {translated(COME_BACK)}
        </button>
      </div>
    </>
  );
}
