export const cards = [
  {
    nameEn: "The Fool",
    nameFr: "Le Mat",
    img: "../src/images/cards/0.png",
  },
  {
    nameEn: "The Magician",
    nameFr: "Le Bateleur",
    img: "../src/images/cards/1.png",
  },
  {
    nameEn: "The High Priestess",
    nameFr: "La Papesse",
    img: "../src/images/cards/2.png",
  },
  {
    nameEn: "The Empress",
    nameFr: "L'Impératrice",
    img: "../src/images/cards/3.png",
  },
  {
    nameEn: "The Emperor",
    nameFr: "L'Empereur",
    img: "../src/images/cards/4.png",
  },
  {
    nameEn: "The Hierophant",
    nameFr: "Le Pape",
    img: "../src/images/cards/5.png",
  },
  {
    nameEn: "The Lovers",
    nameFr: "L'Amoureux",
    img: "../src/images/cards/6.png",
  },
  {
    nameEn: "The Chariot",
    nameFr: "Le Chariot",
    img: "../src/images/cards/7.png",
  },
  {
    nameEn: "Justice",
    nameFr: "La Justice",
    img: "../src/images/cards/8.png",
  },
  {
    nameEn: "The Hermit",
    nameFr: "L'Hermite",
    img: "../src/images/cards/9.png",
  },
  {
    nameEn: "The Wheel of Fortune",
    nameFr: "La Roue de Fortune",
    img: "../src/images/cards/10.png",
  },
  {
    nameEn: "Strength",
    nameFr: "La Force",
    img: "../src/images/cards/11.png",
  },
  {
    nameEn: "The Hanged Man",
    nameFr: "Le Pendu",
    img: "../src/images/cards/12.png",
  },
  {
    nameEn: "Death",
    nameFr: "L'Arcane sans Nom",
    img: "../src/images/cards/13.png",
  },
  {
    nameEn: "Temperance",
    nameFr: "Temperance",
    img: "../src/images/cards/14.png",
  },
  {
    nameEn: "The Devil",
    nameFr: "Le Diable",
    img: "../src/images/cards/15.png",
  },
  {
    nameEn: "The Tower",
    nameFr: "La Maison Diev",
    img: "../src/images/cards/16.png",
  },
  {
    nameEn: "The Star",
    nameFr: "L'Etoile",
    img: "../src/images/cards/17.png",
  },
  {
    nameEn: "The Moon",
    nameFr: "La Lune",
    img: "../src/images/cards/18.png",
  },
  {
    nameEn: "The Sun",
    nameFr: "Le Soleil",
    img: "../src/images/cards/19.png",
  },
  {
    nameEn: "Judgment",
    nameFr: "Le Jugement",
    img: "../src/images/cards/20.png",
  },
  {
    nameEn: "The World",
    nameFr: "Le Monde",
    img: "../src/images/cards/21.png",
  },
];

export function shuffle() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
