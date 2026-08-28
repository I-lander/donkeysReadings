import { useEffect, useRef, useState } from 'react';
import { NEW_DRAW, SHARE } from '../constants/uiText';
import type { TranslatedText } from '../constants/constants';

interface ReadingPanelProps {
  question: string;
  /** Full reading text; typing starts when it arrives. */
  result: string;
  translated: (t: TranslatedText) => string;
  onShare: () => void;
  onNewDraw: () => void;
  /** Fired once, when the typewriter finishes. */
  onTypingDone: () => void;
}

/** Parchment panel: typewriter reveal of the reading, then share / new-draw actions. */
export function ReadingPanel({
  question,
  result,
  translated,
  onShare,
  onNewDraw,
  onTypingDone,
}: ReadingPanelProps) {
  const [typedLength, setTypedLength] = useState(0);
  const startRef = useRef<number>(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setTypedLength(0);
    doneRef.current = false;
    startRef.current = Date.now();
    let raf = 0;
    const tick = () => {
      // Time-based so it survives re-renders and background throttling.
      const n = Math.min(result.length, Math.floor((Date.now() - startRef.current) / 8));
      setTypedLength(n);
      if (n >= result.length) {
        if (!doneRef.current) {
          doneRef.current = true;
          onTypingDone();
        }
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const typing = typedLength < result.length;

  return (
    <div className="reading-panel">
      <div className="reading-panel__question">« {question} »</div>
      <div className="reading-panel__text">
        {result.slice(0, typedLength)}
        {typing && <span className="reading-panel__cursor" />}
      </div>
      {!typing && (
        <div className="reading-panel__actions">
          <button className="btn btn--outline-dark" onClick={onShare}>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="5" r="3" />
              <circle cx="18" cy="19" r="3" />
              <path d="M8.7 10.6l6.6-3.8M8.7 13.4l6.6 3.8" />
            </svg>
            {translated(SHARE)}
          </button>
          <button className="btn btn--primary" onClick={onNewDraw}>
            {translated(NEW_DRAW)}
          </button>
        </div>
      )}
    </div>
  );
}
