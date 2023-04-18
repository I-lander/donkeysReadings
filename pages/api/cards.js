export const cards = [
  {
    name: "The Fool",
    meaning: "New beginnings, spontaneity, and originality.",
    img: "../src/0.jpg"
  },
  {
    name: "The Magician",
    meaning: "Manifestation, resourcefulness, and power.",
    img: "../src/1.jpg"
  },
  {
    name: "The High Priestess",
    meaning: "Intuition, mystery, and inner wisdom.",
    img: "../src/2.jpg"
  },
  {
    name: "The Empress",
    meaning: "Nurturing, abundance, and fertility.",
    img: "../src/3.jpg"
  },
  {
    name: "The Emperor",
    meaning: "Authority, stability, and control.",
    img: "../src/4.jpg"
  },
  {
    name: "The Hierophant",
    meaning: "Tradition, conformity, and spirituality.",
    img: "../src/5.jpg"
  },
  {
    name: "The Lovers",
    meaning: "Relationships, harmony, and choices.",
    img: "../src/6.jpg"
  },
  {
    name: "The Chariot",
    meaning: "Determination, willpower, and victory.",
    img: "../src/7.jpg"
  },
  {
    name: "Strength",
    meaning: "Inner strength, bravery, and compassion.",
    img: "../src/8.jpg"
  },
  {
    name: "The Hermit",
    meaning: "Solitude, introspection, and guidance.",
    img: "../src/9.jpg"
  },
  {
    name: "The Wheel of Fortune",
    meaning: "Change, cycles, and destiny.",
    img: "../src/10.jpg"
  },
  {
    name: "Justice",
    meaning: "Fairness, truth, and balance.",
    img: "../src/11.jpg"
  },
  {
    name: "The Hanged Man",
    meaning: "Surrender, release, and new perspectives.",
    img: "../src/12.jpg"
  },
  {
    name: "Death",
    meaning: "Endings, transformation, and new beginnings.",
    img: "../src/13.jpg"
  },
  {
    name: "Temperance",
    meaning: "Balance, harmony, and moderation.",
    img: "../src/14.jpg"
  },
  {
    name: "The Devil",
    meaning: "Materialism, attachment, and self-bondage.",
    img: "../src/15.jpg"
  },
  {
    name: "The Tower",
    meaning: "Dramatic change, upheaval, and revelation.",
    img: "../src/16.jpg"
  },
  {
    name: "The Star",
    meaning: "Hope, inspiration, and renewal.",
    img: "../src/17.jpg"
  },
  {
    name: "The Moon",
    meaning: "Intuition, the subconscious, and mystery.",
    img: "../src/18.jpg"
  },
  {
    name: "The Sun",
    meaning: "Success, positivity, and vitality.",
    img: "../src/19.jpg"
  },
  {
    name: "Judgment",
    meaning: "Rebirth, absolution, and renewal.",
    img: "../src/20.jpg"
  },
  {
    name: "The World",
    meaning: "Completion, wholeness, and accomplishment.",
    img: "../src/21.jpg"
  },
];

export function shuffle() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
