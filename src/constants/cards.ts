export interface Card {
  nameEn: string;
  nameFr: string;
  img: string;
}

export const cards: Card[] = [
  {
    nameEn: 'The Fool',
    nameFr: 'Le Mat',
    img: '/assets/images/cards/0.png',
  },
  {
    nameEn: 'The Magician',
    nameFr: 'Le Bateleur',
    img: '/assets/images/cards/1.png',
  },
  {
    nameEn: 'The High Priestess',
    nameFr: 'La Papesse',
    img: '/assets/images/cards/2.png',
  },
  {
    nameEn: 'The Empress',
    nameFr: "L'Impératrice",
    img: '/assets/images/cards/3.png',
  },
  {
    nameEn: 'The Emperor',
    nameFr: "L'Empereur",
    img: '/assets/images/cards/4.png',
  },
  {
    nameEn: 'The Hierophant',
    nameFr: 'Le Pape',
    img: '/assets/images/cards/5.png',
  },
  {
    nameEn: 'The Lovers',
    nameFr: "L'Amoureux",
    img: '/assets/images/cards/6.png',
  },
  {
    nameEn: 'The Chariot',
    nameFr: 'Le Chariot',
    img: '/assets/images/cards/7.png',
  },
  {
    nameEn: 'Justice',
    nameFr: 'La Justice',
    img: '/assets/images/cards/8.png',
  },
  {
    nameEn: 'The Hermit',
    nameFr: "L'Hermite",
    img: '/assets/images/cards/9.png',
  },
  {
    nameEn: 'The Wheel of Fortune',
    nameFr: 'La Roue de Fortune',
    img: '/assets/images/cards/10.png',
  },
  {
    nameEn: 'Strength',
    nameFr: 'La Force',
    img: '/assets/images/cards/11.png',
  },
  {
    nameEn: 'The Hanged Man',
    nameFr: 'Le Pendu',
    img: '/assets/images/cards/12.png',
  },
  {
    nameEn: 'Death',
    nameFr: "L'Arcane sans Nom",
    img: '/assets/images/cards/13.png',
  },
  {
    nameEn: 'Temperance',
    nameFr: 'Temperance',
    img: '/assets/images/cards/14.png',
  },
  {
    nameEn: 'The Devil',
    nameFr: 'Le Diable',
    img: '/assets/images/cards/15.png',
  },
  {
    nameEn: 'The Tower',
    nameFr: 'La Maison Diev',
    img: '/assets/images/cards/16.png',
  },
  {
    nameEn: 'The Star',
    nameFr: "L'Etoile",
    img: '/assets/images/cards/17.png',
  },
  {
    nameEn: 'The Moon',
    nameFr: 'La Lune',
    img: '/assets/images/cards/18.png',
  },
  {
    nameEn: 'The Sun',
    nameFr: 'Le Soleil',
    img: '/assets/images/cards/19.png',
  },
  {
    nameEn: 'Judgment',
    nameFr: 'Le Jugement',
    img: '/assets/images/cards/20.png',
  },
  {
    nameEn: 'The World',
    nameFr: 'Le Monde',
    img: '/assets/images/cards/21.png',
  },
];

export function shuffle(): void {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
