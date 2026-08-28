import { FormEvent, useEffect, useState } from 'react';
import { generateReading } from './api';
import { AppVisibilityButton } from './components/AppVisibilityButton';
import { CanvasBlock } from './components/CanvasBlock';
import { Language, LanguageSelector } from './components/LanguageSelector';
import { ReadingBlock } from './components/ReadingBlock';
import { getPlaceholderText, TranslateObject } from './components/TranslateObject';
import { cards, shuffle } from './constants/cards';
import { DESCRIPTION, INTRODUCTION } from './constants/constants';

const CARD_BACK = '/assets/images/cards/back.png';

const languages: Language[] = [
  { code: 'en', icon: '/assets/images/english.png' },
  { code: 'fr', icon: '/assets/images/french.png' },
];

export function App() {
  const [isLoading, setIsLoading] = useState(false);

  const [questionInput, setQuestionInput] = useState('');
  const [placeholderText, setPlaceholderText] = useState('');
  const [question, setQuestion] = useState<string>();
  const [result, setResult] = useState<string>();
  const [card1, setCard1] = useState(CARD_BACK);
  const [card2, setCard2] = useState(CARD_BACK);
  const [card3, setCard3] = useState(CARD_BACK);
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);
  const [appVisible, setAppVisible] = useState(false);
  const [headerCollapsed, setHeaderCollapsed] = useState(false);

  useEffect(() => {
    if (result) {
      setIsLoading(false);
    }
  }, [result]);

  useEffect(() => {
    setPlaceholderText(getPlaceholderText(currentLanguage.code));
  }, [currentLanguage]);

  function toggleAppVisibility() {
    setHeaderCollapsed(!headerCollapsed);
    setAppVisible(!appVisible);
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    setIsLoading(true);
    setResult(undefined);
    setCard1(CARD_BACK);
    setCard2(CARD_BACK);
    setCard3(CARD_BACK);
    setQuestion(questionInput);
    event.preventDefault();
    try {
      shuffle();
      setCard1(cards[0].img);
      setCard2(cards[1].img);
      setCard3(cards[2].img);
      const reading = await generateReading(questionInput, cards.slice(0, 3), currentLanguage.code);
      setResult(reading);
      setQuestionInput('');
    } catch (error) {
      setIsLoading(false);
      setCard1(CARD_BACK);
      setCard2(CARD_BACK);
      setCard3(CARD_BACK);
      console.error(error);
      alert(error instanceof Error ? error.message : String(error));
    }
  }

  return (
    <main className="container">
      <CanvasBlock />

      <div className={`header ${headerCollapsed ? 'header--collapsed' : ''}`}>
        <div className="header-content">
          <img className="logo" src="/assets/images/icon.png" alt="Donkeys Readings" />
          <div className="language-selector">
            <LanguageSelector languages={languages} onLanguageChange={setCurrentLanguage} />
          </div>
        </div>
        <div className="description">
          <div className="introduction">
            <TranslateObject object={INTRODUCTION} language={currentLanguage} />
          </div>
          <br />
          <br />
          <TranslateObject object={DESCRIPTION} language={currentLanguage} />
        </div>
        {!appVisible && (
          <AppVisibilityButton appVisible={appVisible} toggleAppVisibility={toggleAppVisibility} />
        )}
      </div>

      <div className={`app ${appVisible ? 'app--visible' : ''}`}>
        <form onSubmit={onSubmit} className="input-container">
          <input
            type="text"
            name="question"
            placeholder={placeholderText}
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <button type="submit" className="submit-btn" value="Submit" disabled={isLoading}></button>
        </form>
        <ReadingBlock
          card1={card1}
          card2={card2}
          card3={card3}
          isLoading={isLoading}
          question={question}
          result={result}
        />
      </div>
      {appVisible && (
        <AppVisibilityButton appVisible={appVisible} toggleAppVisibility={toggleAppVisibility} />
      )}
    </main>
  );
}
