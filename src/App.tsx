import { FormEvent, useEffect, useRef, useState } from 'react';
import { adsAvailable, initAds, showRewardedAd } from './ads';
import {
  fetchQuota,
  generateReading,
  loginWithGoogle,
  QuotaExhaustedError,
  waitForCredit,
  type ReadingResponse,
} from './api';
import {
  authAvailable,
  getSession,
  googleSignIn,
  googleSignOut,
  initAuth,
  setSession,
  type AuthSession,
} from './auth';
import { AdSheet } from './components/AdSheet';
import { ArcanaGrid } from './components/ArcanaGrid';
import { BottomNav, type Tab } from './components/BottomNav';
import { CardSlots } from './components/CardSlots';
import { HistoryList } from './components/HistoryList';
import { LanguageSelector, type Language } from './components/LanguageSelector';
import { QuotaPips } from './components/QuotaPips';
import { ReadingPanel } from './components/ReadingPanel';
import { Starfield } from './components/Starfield';
import { cards, shuffle, type Card } from './constants/cards';
import {
  AD_FAILED,
  QUOTA_EXHAUSTED,
  SIGN_IN_FAILED,
  type TranslatedText,
} from './constants/constants';
import {
  ASK_SUB,
  ASK_TITLE,
  PLACEHOLDER_TEXT,
  pickSuggestions,
  POSITIONS,
  SHUFFLING,
  SUGGESTIONS_HINT,
  TOAST_SHARED,
} from './constants/uiText';
import { getDeviceId } from './deviceId';
import { addHistory, loadHistory, type HistoryEntry } from './history';
import { bumpStreak, currentStreak } from './streak';
import { captureDivAsDataURL, saveScreenshot } from './share';

const CARD_BACK = '/assets/images/cards/back.png';
const FREE_READINGS_PER_DAY = 3;

const languages: Language[] = [
  { code: 'en', icon: '/assets/images/english.png' },
  { code: 'fr', icon: '/assets/images/french.png' },
];

type Phase = 'idle' | 'shuffling' | 'cards' | 'reading';

export function App() {
  const [tab, setTab] = useState<Tab>('draw');
  const [phase, setPhase] = useState<Phase>('idle');
  const [questionInput, setQuestionInput] = useState('');
  const [question, setQuestion] = useState('');
  const [drawn, setDrawn] = useState<Card[]>([]);
  const [revealed, setRevealed] = useState(0);
  const [result, setResult] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [account, setAccount] = useState<AuthSession | undefined>(getSession());
  const [remaining, setRemaining] = useState(FREE_READINGS_PER_DAY);
  const [streak, setStreak] = useState(currentStreak());
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory());
  const [suggestions, setSuggestions] = useState<string[]>(() => pickSuggestions('en'));
  const [sheetOpen, setSheetOpen] = useState(false);
  const [toast, setToast] = useState('');

  const captureRef = useRef<HTMLDivElement>(null);
  const pendingQuestion = useRef('');
  const timers = useRef<number[]>([]);

  const lang = currentLanguage.code;
  const translated = (text: TranslatedText) => text[lang] ?? text.en;

  useEffect(() => {
    initAds().catch((error) => console.error('AdMob init failed:', error));
    initAuth().catch((error) => console.error('Google Auth init failed:', error));
    refreshQuota();
    return () => timers.current.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSuggestions(pickSuggestions(lang));
  }, [lang]);

  function later(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function showToast(message: string) {
    setToast(message);
    later(() => setToast(''), 2400);
  }

  async function refreshQuota() {
    try {
      const quota = await fetchQuota();
      setRemaining(quota.freeRemaining + quota.credits);
    } catch {
      // offline / cold server: keep the optimistic default
    }
  }

  async function onSignIn() {
    try {
      const { idToken, email } = await googleSignIn();
      const login = await loginWithGoogle(idToken);
      const next: AuthSession = { idToken, email: login.email ?? email, userId: login.userId };
      setSession(next);
      setAccount(next);
      setRemaining(login.quota.freeRemaining + login.quota.credits);
    } catch (error) {
      console.error(error);
      alert(translated(SIGN_IN_FAILED));
    }
  }

  async function onSignOut() {
    await googleSignOut();
    setAccount(undefined);
  }

  /** Rewarded-ad flow: show the ad, then poll until the server-side credit lands. */
  async function requestAd(): Promise<boolean> {
    if (!adsAvailable()) {
      alert(translated(QUOTA_EXHAUSTED));
      return false;
    }
    try {
      const rewarded = await showRewardedAd(account?.userId ?? getDeviceId());
      if (!rewarded) return false;
      return await waitForCredit();
    } catch (error) {
      console.error(error);
      alert(translated(AD_FAILED));
      return false;
    }
  }

  function resetDraw() {
    setPhase('idle');
    setDrawn([]);
    setRevealed(0);
    setResult('');
    setQuestion('');
    setSuggestions(pickSuggestions(lang));
  }

  function revealSequence(finalCards: Card[], reading: string) {
    setDrawn(finalCards);
    setPhase('cards');
    [0, 1, 2].forEach((i) => later(() => setRevealed(i + 1), 350 + i * 620));
    later(
      () => {
        setResult(reading);
        setPhase('reading');
      },
      350 + 3 * 620 + 300
    );
  }

  async function runReading(q: string) {
    setPhase('shuffling');
    setRevealed(0);
    setResult('');
    setQuestion(q);
    setQuestionInput('');
    shuffle();
    const drawnCards = cards.slice(0, 3);
    const startedAt = Date.now();

    let reading: ReadingResponse;
    try {
      reading = await generateReading(q, drawnCards, lang);
    } catch (error) {
      setPhase('idle');
      if (error instanceof QuotaExhaustedError) {
        pendingQuestion.current = q;
        setSheetOpen(true);
        return;
      }
      console.error(error);
      alert(error instanceof Error ? error.message : String(error));
      return;
    }

    // A repeated question returns the original draw: show those cards, not the new shuffle.
    const finalCards =
      reading.cards && reading.cards.length >= 3 ? reading.cards.slice(0, 3) : drawnCards;

    // Let the shuffle animation breathe even when the API answers fast.
    const minShuffleMs = 1500;
    const wait = Math.max(0, minShuffleMs - (Date.now() - startedAt));
    later(() => revealSequence(finalCards, reading.result), wait);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = questionInput.trim();
    if (!q || phase === 'shuffling' || phase === 'cards') return;
    void runReading(q);
  }

  function onTypingDone() {
    setHistory(
      addHistory({
        q: question,
        cardImgs: drawn.map((c) => c.img),
        result,
        date: new Date().toISOString(),
      })
    );
    setStreak(bumpStreak());
    void refreshQuota();
  }

  async function onShare() {
    if (!captureRef.current) return;
    try {
      const dataURL = await captureDivAsDataURL(captureRef.current);
      await saveScreenshot(dataURL);
      showToast(translated(TOAST_SHARED));
    } catch (error) {
      console.error(error);
    }
  }

  function openHistoryEntry(entry: HistoryEntry) {
    setTab('draw');
    setQuestion(entry.q);
    const entryCards = entry.cardImgs.map(
      (img) => cards.find((c) => c.img === img) ?? { nameEn: '', nameFr: '', img }
    );
    setDrawn(entryCards);
    setRevealed(3);
    setResult(entry.result);
    setPhase('reading');
  }

  const positionLabels = POSITIONS.map((p) => translated(p));
  const canSend = questionInput.trim().length > 0 && phase !== 'shuffling' && phase !== 'cards';

  return (
    <main className="app-root">
      <Starfield />

      <header className="app-header">
        <img className="app-header__logo" src="/assets/images/icon.png" alt="Donkeys Readings" />
        <div className="app-header__titles">
          <div className="app-header__title">Les Lectures de l'Âne</div>
          <div className="app-header__subtitle">Tarot de Marseille</div>
        </div>
        <div className="app-header__spacer" />
        {streak > 0 && (
          <div className="streak" title="Jours consécutifs">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22c4.4 0 7-2.8 7-6.5 0-4-3.5-6-3.5-9.5-2 1-3 2.6-3 5C11 8.5 9.5 5.5 10 2 6 5 5 8.8 5 12.5 5 19.2 7.6 22 12 22z" />
            </svg>
            {streak}
          </div>
        )}
        <QuotaPips remaining={remaining} total={FREE_READINGS_PER_DAY} />
        <LanguageSelector languages={languages} onLanguageChange={setCurrentLanguage} />
        {authAvailable() && (
          <button
            className="auth-chip"
            onClick={account ? onSignOut : onSignIn}
            title={account?.email}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" />
            </svg>
          </button>
        )}
      </header>

      <div className="app-content">
        {tab === 'draw' && (
          <>
            {phase === 'idle' && (
              <div className="hero">
                <div className="hero__fan">
                  <img src={CARD_BACK} alt="" className="hero__card hero__card--left" />
                  <img src={CARD_BACK} alt="" className="hero__card hero__card--right" />
                  <img src={CARD_BACK} alt="" className="hero__card hero__card--center" />
                </div>
                <h1 className="hero__title">{translated(ASK_TITLE)}</h1>
                <p className="hero__sub">{translated(ASK_SUB)}</p>
                <div className="chips">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="chips__chip"
                      onClick={() => setQuestionInput(s.replace(/…$/, ' '))}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="chips__hint">{translated(SUGGESTIONS_HINT)}</p>
              </div>
            )}

            {phase === 'shuffling' && (
              <div className="shuffling">
                <div className="shuffling__stack">
                  <img src={CARD_BACK} alt="" />
                  <img src={CARD_BACK} alt="" />
                  <img src={CARD_BACK} alt="" />
                </div>
                <div className="shuffling__label">{translated(SHUFFLING)}</div>
              </div>
            )}

            {(phase === 'cards' || phase === 'reading') && (
              <div ref={captureRef} className="draw-result">
                <CardSlots cards={drawn} revealed={revealed} labels={positionLabels} lang={lang} />
                {phase === 'reading' && (
                  <ReadingPanel
                    question={question}
                    result={result}
                    translated={translated}
                    onShare={onShare}
                    onNewDraw={resetDraw}
                    onTypingDone={onTypingDone}
                  />
                )}
              </div>
            )}

            <div className="app-content__spacer" />
            <form className="ask-bar" onSubmit={onSubmit}>
              <input
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder={translated(PLACEHOLDER_TEXT)}
              />
              <button
                type="submit"
                className={`ask-bar__send${canSend ? ' ask-bar__send--ready' : ''}`}
                disabled={!canSend}
              >
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </>
        )}

        {tab === 'history' && (
          <HistoryList
            entries={history}
            lang={lang}
            translated={translated}
            onOpen={openHistoryEntry}
          />
        )}

        {tab === 'arcana' && <ArcanaGrid lang={lang} translated={translated} />}
      </div>

      <BottomNav tab={tab} onTab={setTab} translated={translated} />

      {toast && <div className="toast">{toast}</div>}

      <AdSheet
        open={sheetOpen}
        translated={translated}
        onClose={() => setSheetOpen(false)}
        requestAd={requestAd}
        onUnlocked={() => {
          setSheetOpen(false);
          void refreshQuota();
          if (pendingQuestion.current) void runReading(pendingQuestion.current);
          pendingQuestion.current = '';
        }}
      />
    </main>
  );
}
