export const cards = [
  {
    nameEn: "The Fool",
    nameFr: "Le Mat",
    img: "../src/images/0.jpg",
  },
  {
    nameEn: "The Magician",
    nameFr: "Le Bateleur",
    img: "../src/images/1.jpg",
  },
  {
    nameEn: "The High Priestess",
    nameFr: "La Papesse",
    img: "../src/images/2.jpg",
  },
  {
    nameEn: "The Empress",
    nameFr: "L'Impératrice",
    img: "../src/images/3.jpg",
  },
  {
    nameEn: "The Emperor",
    nameFr: "L'Empereur",
    img: "../src/images/4.jpg",
  },
  {
    nameEn: "The Hierophant",
    nameFr: "Le Pape",
    img: "../src/images/5.jpg",
  },
  {
    nameEn: "The Lovers",
    nameFr: "L'Amoureux",
    img: "../src/images/6.jpg",
  },
  {
    nameEn: "The Chariot",
    nameFr: "Le Chariot",
    img: "../src/images/7.jpg",
  },
  {
    nameEn: "Justice",
    nameFr: "La Justice",
    img: "../src/images/8.jpg",
  },
  {
    nameEn: "The Hermit",
    nameFr: "L'Hermite",
    img: "../src/images/9.jpg",
  },
  {
    nameEn: "The Wheel of Fortune",
    nameFr: "La Roue de Fortune",
    img: "../src/images/10.jpg",
  },
  {
    nameEn: "Strength",
    nameFr: "La Force",
    img: "../src/images/11.jpg",
  },
  {
    nameEn: "The Hanged Man",
    nameFr: "Le Pendu",
    img: "../src/images/12.jpg",
  },
  {
    nameEn: "Death",
    nameFr: "L'Arcane sans Nom",
    img: "../src/images/13.jpg",
  },
  {
    nameEn: "Temperance",
    nameFr: "Temperance",
    img: "../src/images/14.jpg",
  },
  {
    nameEn: "The Devil",
    nameFr: "Le Diable",
    img: "../src/images/15.jpg",
  },
  {
    nameEn: "The Tower",
    nameFr: "La Maison Diev",
    img: "../src/images/16.jpg",
  },
  {
    nameEn: "The Star",
    nameFr: "L'Etoile",
    img: "../src/images/17.jpg",
  },
  {
    nameEn: "The Moon",
    nameFr: "La Lune",
    img: "../src/images/18.jpg",
  },
  {
    nameEn: "The Sun",
    nameFr: "Le Soleil",
    img: "../src/images/19.jpg",
  },
  {
    nameEn: "Judgment",
    nameFr: "Le Jugement",
    img: "../src/images/20.jpg",
  },
  {
    nameEn: "The World",
    nameFr: "Le Monde",
    img: "../src/images/21.jpg",
  },
];

export function shuffle() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
