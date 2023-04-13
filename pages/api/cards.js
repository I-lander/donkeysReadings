export const cards = [
  {
    name: "The Fool",
    meaning: "New beginnings, spontaneity, and originality.",
  },
  {
    name: "The Magician",
    meaning: "Manifestation, resourcefulness, and power.",
  },
  {
    name: "The High Priestess",
    meaning: "Intuition, mystery, and inner wisdom.",
  },
  {
    name: "The Empress",
    meaning: "Nurturing, abundance, and fertility.",
  },
  {
    name: "The Emperor",
    meaning: "Authority, stability, and control.",
  },
  {
    name: "The Hierophant",
    meaning: "Tradition, conformity, and spirituality.",
  },
  {
    name: "The Lovers",
    meaning: "Relationships, harmony, and choices.",
  },
  {
    name: "The Chariot",
    meaning: "Determination, willpower, and victory.",
  },
  {
    name: "Strength",
    meaning: "Inner strength, bravery, and compassion.",
  },
  {
    name: "The Hermit",
    meaning: "Solitude, introspection, and guidance.",
  },
  {
    name: "The Wheel of Fortune",
    meaning: "Change, cycles, and destiny.",
  },
  {
    name: "Justice",
    meaning: "Fairness, truth, and balance.",
  },
  {
    name: "The Hanged Man",
    meaning: "Surrender, release, and new perspectives.",
  },
  {
    name: "Death",
    meaning: "Endings, transformation, and new beginnings.",
  },
  {
    name: "Temperance",
    meaning: "Balance, harmony, and moderation.",
  },
  {
    name: "The Devil",
    meaning: "Materialism, attachment, and self-bondage.",
  },
  {
    name: "The Tower",
    meaning: "Dramatic change, upheaval, and revelation.",
  },
  {
    name: "The Star",
    meaning: "Hope, inspiration, and renewal.",
  },
  {
    name: "The Moon",
    meaning: "Intuition, the subconscious, and mystery.",
  },
  {
    name: "The Sun",
    meaning: "Success, positivity, and vitality.",
  },
  {
    name: "Judgment",
    meaning: "Rebirth, absolution, and renewal.",
  },
  {
    name: "The World",
    meaning: "Completion, wholeness, and accomplishment.",
  },
];

export function shuffle() {
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
}
