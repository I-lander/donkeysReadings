import type { TranslatedText } from '../constants/constants';
import { TAB_ARCANA, TAB_DRAW, TAB_HISTORY } from '../constants/uiText';

export type Tab = 'draw' | 'history' | 'arcana';

interface BottomNavProps {
  tab: Tab;
  onTab: (tab: Tab) => void;
  translated: (t: TranslatedText) => string;
}

export function BottomNav({ tab, onTab, translated }: BottomNavProps) {
  const item = (id: Tab, label: string, icon: JSX.Element) => (
    <button className="bottom-nav__item" onClick={() => onTab(id)}>
      <span className={`bottom-nav__inner${tab === id ? ' bottom-nav__inner--active' : ''}`}>
        {icon}
        <span className="bottom-nav__label">{label}</span>
      </span>
    </button>
  );

  return (
    <nav className="bottom-nav">
      {item(
        'draw',
        translated(TAB_DRAW),
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="3" width="11" height="17" rx="2" transform="rotate(-8 9 11)" />
          <rect x="10" y="4" width="11" height="17" rx="2" transform="rotate(8 15 12)" />
        </svg>
      )}
      {item(
        'history',
        translated(TAB_HISTORY),
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3.5 2" />
        </svg>
      )}
      {item(
        'arcana',
        translated(TAB_ARCANA),
        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 6c-2-1.8-4.6-2.2-8-2v14c3.4-.2 6 .2 8 2 2-1.8 4.6-2.2 8-2V4c-3.4-.2-6 .2-8 2z" />
          <path d="M12 6v14" />
        </svg>
      )}
    </nav>
  );
}
