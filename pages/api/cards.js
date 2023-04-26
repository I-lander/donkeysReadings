export const cards = [
  {
    name: "The Fool",
    meaning: "New beginnings, spontaneity, and originality.",
    img: "../src/images/0.jpg",
  },
  {
    name: "The Magician",
    meaning: "Manifestation, resourcefulness, and power.",
    img: "../src/images/1.jpg",
  },
  {
    name: "The High Priestess",
    meaning: "Intuition, mystery, and inner wisdom.",
    img: "../src/images/2.jpg",
  },
  {
    name: "The Empress",
    meaning: "Nurturing, abundance, and fertility.",
    img: "../src/images/3.jpg",
  },
  {
    name: "The Emperor",
    meaning: "Authority, stability, and control.",
    img: "../src/images/4.jpg",
  },
  {
    name: "The Hierophant",
    meaning: "Tradition, conformity, and spirituality.",
    img: "../src/images/5.jpg",
  },
  {
    name: "The Lovers",
    meaning: "Relationships, harmony, and choices.",
    img: "../src/images/6.jpg",
  },
  {
    name: "The Chariot",
    meaning: "Determination, willpower, and victory.",
    img: "../src/images/7.jpg",
  },
  {
    name: "Strength",
    meaning: "Inner strength, bravery, and compassion.",
    img: "../src/images/8.jpg",
  },
  {
    name: "The Hermit",
    meaning: "Solitude, introspection, and guidance.",
    img: "../src/images/9.jpg",
  },
  {
    name: "The Wheel of Fortune",
    meaning: "Change, cycles, and destiny.",
    img: "../src/images/10.jpg",
  },
  {
    name: "Justice",
    meaning: "Fairness, truth, and balance.",
    img: "../src/images/11.jpg",
  },
  {
    name: "The Hanged Man",
    meaning: "Surrender, release, and new perspectives.",
    img: "../src/images/12.jpg",
  },
  {
    name: "Death",
    meaning: "Endings, transformation, and new beginnings.",
    img: "../src/images/13.jpg",
  },
  {
    name: "Temperance",
    meaning: "Balance, harmony, and moderation.",
    img: "../src/images/14.jpg",
  },
  {
    name: "The Devil",
    meaning: "Materialism, attachment, and self-bondage.",
    img: "../src/images/15.jpg",
  },
  {
    name: "The Tower",
    meaning: "Dramatic change, upheaval, and revelation.",
    img: "../src/images/16.jpg",
  },
  {
    name: "The Star",
    meaning: "Hope, inspiration, and renewal.",
    img: "../src/images/17.jpg",
  },
  {
    name: "The Moon",
    meaning: "Intuition, the subconscious, and mystery.",
    img: "../src/images/18.jpg",
  },
  {
    name: "The Sun",
    meaning: "Success, positivity, and vitality.",
    img: "../src/images/19.jpg",
  },
  {
    name: "Judgment",
    meaning: "Rebirth, absolution, and renewal.",
    img: "../src/images/20.jpg",
  },
  {
    name: "The World",
    meaning: "Completion, wholeness, and accomplishment.",
    img: "../src/images/21.jpg",
  },
];

export function shuffle() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
