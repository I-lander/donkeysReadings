import { useState } from 'react';
import { arcanaIndex, arcanaInfo, cardName } from '../constants/arcana';
import { cards, type Card } from '../constants/cards';
import type { TranslatedText } from '../constants/constants';
import { ARCANA_TITLE, CLOSE } from '../constants/uiText';

interface ArcanaGridProps {
  lang: string;
  translated: (t: TranslatedText) => string;
}

/** Library of the 22 major arcana with a detail overlay. */
export function ArcanaGrid({ lang, translated }: ArcanaGridProps) {
  const [detail, setDetail] = useState<Card | null>(null);
  const sorted = [...cards].sort((a, b) => arcanaIndex(a) - arcanaIndex(b));

  return (
    <div className="arcana">
      <h2 className="screen-title">{translated(ARCANA_TITLE)}</h2>
      <div className="arcana__grid">
        {sorted.map((card) => (
          <button className="arcana__cell" key={card.img} onClick={() => setDetail(card)}>
            <img src={card.img} alt={cardName(card, lang)} />
            <div className="arcana__name">{cardName(card, lang)}</div>
          </button>
        ))}
      </div>

      {detail && (
        <>
          <div className="scrim scrim--deep" onClick={() => setDetail(null)} />
          <div className="arcana-detail">
            <img className="arcana-detail__img" src={detail.img} alt="" />
            <div className="arcana-detail__name">{cardName(detail, lang)}</div>
            <div className="arcana-detail__kw">
              {arcanaInfo(detail).kw[lang === 'fr' ? 'fr' : 'en']}
            </div>
            <p className="arcana-detail__text">
              {arcanaInfo(detail).meaning[lang === 'fr' ? 'fr' : 'en']}
            </p>
            <button className="btn btn--outline" onClick={() => setDetail(null)}>
              {translated(CLOSE)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
