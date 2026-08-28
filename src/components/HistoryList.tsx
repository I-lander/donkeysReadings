import type { TranslatedText } from '../constants/constants';
import { HISTORY_EMPTY, HISTORY_HINT, HISTORY_TITLE } from '../constants/uiText';
import { formatHistoryDate, type HistoryEntry } from '../history';

interface HistoryListProps {
  entries: HistoryEntry[];
  lang: string;
  translated: (t: TranslatedText) => string;
  onOpen: (entry: HistoryEntry) => void;
}

export function HistoryList({ entries, lang, translated, onOpen }: HistoryListProps) {
  return (
    <div className="history">
      <h2 className="screen-title">{translated(HISTORY_TITLE)}</h2>
      {entries.length === 0 && <div className="history__empty">{translated(HISTORY_EMPTY)}</div>}
      {entries.map((entry) => (
        <button className="history__item" key={entry.q + entry.date} onClick={() => onOpen(entry)}>
          <div className="history__thumbs">
            {entry.cardImgs.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>
          <div className="history__body">
            <div className="history__q">{entry.q}</div>
            <div className="history__date">{formatHistoryDate(entry.date, lang)}</div>
          </div>
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
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      ))}
      <div className="history__hint">{translated(HISTORY_HINT)}</div>
    </div>
  );
}
