import { useEffect, useRef } from 'react';
import type { Card } from '../constants/cards';
import { cardName } from '../constants/arcana';
import { sparkleBurstAt } from '../fx';
import { haptics } from '../haptics';
import { sfx } from '../sound';

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
  const rootRef = useRef<HTMLDivElement>(null);
  // Seeded with the mount value so reopening a history entry (0 -> 3 at once)
  // doesn't replay the reveal effects.
  const prevRevealed = useRef(revealed);

  useEffect(() => {
    const prev = prevRevealed.current;
    prevRevealed.current = revealed;
    if (revealed !== prev + 1) return;
    const i = revealed - 1;
    sfx.flip(i);
    haptics.reveal();
    const scene = rootRef.current?.querySelectorAll('.card-slot__scene')[i];
    if (scene) {
      const rect = scene.getBoundingClientRect();
      sparkleBurstAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }, [revealed]);

  return (
    <div className="card-slots" ref={rootRef}>
      {cards.map((card, i) => (
        <div className="card-slot" key={i}>
          <div className="card-slot__pos">{labels[i]}</div>
          <div className={`card-slot__scene${revealed > i ? ' card-slot__scene--landed' : ''}`}>
            <div className={`card-slot__flip${revealed > i ? ' card-slot__flip--on' : ''}`}>
              <img className="card-slot__face" src={CARD_BACK} alt="" />
              <img
                className="card-slot__face card-slot__face--front"
                src={card.img}
                alt={cardName(card, lang)}
              />
            </div>
          </div>
          <div className={`card-slot__name${revealed > i ? ' card-slot__name--in' : ''}`}>
            {revealed > i ? cardName(card, lang) : ''}
          </div>
        </div>
      ))}
    </div>
  );
}
