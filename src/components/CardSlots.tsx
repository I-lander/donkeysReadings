import type { Card } from '../constants/cards';
import { cardName } from '../constants/arcana';

const CARD_BACK = '/assets/images/cards/back.png';

interface CardSlotsProps {
  cards: Card[];
  /** How many cards are face up (0-3); drives the staggered 3D flips. */
  revealed: number;
  labels: string[];
  lang: string;
}

/** The three drawn cards with 3D flip reveal (Past / Present / Future). */
export function CardSlots({ cards, revealed, labels, lang }: CardSlotsProps) {
  return (
    <div className="card-slots">
      {cards.map((card, i) => (
        <div className="card-slot" key={i}>
          <div className="card-slot__pos">{labels[i]}</div>
          <div className="card-slot__scene">
            <div className={`card-slot__flip${revealed > i ? ' card-slot__flip--on' : ''}`}>
              <img className="card-slot__face" src={CARD_BACK} alt="" />
              <img
                className="card-slot__face card-slot__face--front"
                src={card.img}
                alt={cardName(card, lang)}
              />
            </div>
          </div>
          <div className="card-slot__name">{revealed > i ? cardName(card, lang) : ''}</div>
        </div>
      ))}
    </div>
  );
}
