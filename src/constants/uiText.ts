import type { TranslatedText } from './constants';

export const ASK_TITLE: TranslatedText = {
  en: 'What do you wish to know?',
  fr: 'Que veux-tu savoir ?',
};

export const ASK_SUB: TranslatedText = {
  en: 'Ask your question — the donkey draws three cards and reads the stars for you. The more precise the question, the more precise the reading.',
  fr: "Pose ta question, l'âne tire trois cartes et lit les étoiles pour toi. Plus la question est précise, plus la lecture le sera.",
};

export const SUGGESTIONS_HINT: TranslatedText = {
  en: 'Prompts to complete: make them yours for a deeper reading. Or write your own question from scratch.',
  fr: 'Des amorces à compléter : précise-les avec ta situation pour une lecture plus profonde. Ou écris ta propre question, en partant de zéro.',
};

export const SHUFFLING: TranslatedText = {
  en: 'The donkey shuffles the cards…',
  fr: "L'âne bat les cartes…",
};

export const POSITIONS: TranslatedText[] = [
  { en: 'Past', fr: 'Passé' },
  { en: 'Present', fr: 'Présent' },
  { en: 'Future', fr: 'Avenir' },
];

export const SHARE: TranslatedText = { en: 'Share', fr: 'Partager' };
export const NEW_DRAW: TranslatedText = { en: 'New reading', fr: 'Nouveau tirage' };

export const TAB_DRAW: TranslatedText = { en: 'Reading', fr: 'Tirage' };
export const TAB_HISTORY: TranslatedText = { en: 'History', fr: 'Historique' };
export const TAB_ARCANA: TranslatedText = { en: 'Arcana', fr: 'Arcanes' };

export const HISTORY_TITLE: TranslatedText = { en: 'Your readings', fr: 'Tes tirages' };
export const HISTORY_HINT: TranslatedText = {
  en: 'Asking the exact same question returns the original reading, without using a credit.',
  fr: "Reposer la même question renvoie la lecture d'origine, sans consommer de tirage.",
};
export const HISTORY_EMPTY: TranslatedText = {
  en: 'No readings yet',
  fr: 'Aucun tirage pour le moment',
};

export const ARCANA_TITLE: TranslatedText = { en: 'The 22 arcana', fr: 'Les 22 arcanes' };
export const CLOSE: TranslatedText = { en: 'Close', fr: 'Fermer' };

export const SHEET_TITLE: TranslatedText = {
  en: 'The stars are resting',
  fr: 'Les étoiles se reposent',
};
export const SHEET_TEXT: TranslatedText = {
  en: 'You have used your free readings for today. Watch a short ad to unlock one more reading.',
  fr: 'Tu as utilisé tes tirages gratuits du jour. Regarde une courte publicité pour débloquer un tirage de plus.',
};
export const WATCH_AD: TranslatedText = {
  en: 'Watch an ad · +1 reading',
  fr: 'Regarder une pub · +1 tirage',
};
export const AD_RUNNING: TranslatedText = { en: 'Ad in progress…', fr: 'Publicité en cours…' };
export const COME_BACK: TranslatedText = { en: 'Come back tomorrow', fr: 'Revenir demain' };
export const TOAST_CREDIT: TranslatedText = { en: '+1 reading unlocked', fr: '+1 tirage débloqué' };
export const TOAST_SHARED: TranslatedText = {
  en: 'Reading image ready to share',
  fr: 'Image du tirage prête à partager',
};

export const PLACEHOLDER_TEXT: TranslatedText = { en: 'Your question…', fr: 'Votre question…' };

/** Question starters — deliberately unfinished; the user completes them. */
export const SUGGESTION_POOL: Record<string, string[]> = {
  fr: [
    'Comment mon travail va-t-il évoluer si…',
    'Que dois-je comprendre de ma relation avec…',
    "Qu'est-ce qui me bloque dans…",
    "Ai-je raison d'hésiter à propos de…",
    "Quelle énergie m'accompagne pour…",
    'Que me réserve ce changement de…',
    'Comment retrouver confiance dans…',
    "Quel chemin s'ouvre à moi côté…",
    'Que dit mon cœur au sujet de…',
    "Qu'ai-je besoin de laisser derrière moi concernant…",
    'Comment aborder ma décision sur…',
    'Quelle leçon dois-je tirer de…',
  ],
  en: [
    'How will my work evolve if…',
    'What should I understand about my relationship with…',
    'What is blocking me in…',
    'Am I right to hesitate about…',
    'What energy accompanies me for…',
    'What does this change hold for…',
    'How can I regain confidence in…',
    'What path opens for me regarding…',
    'What does my heart say about…',
    'What do I need to leave behind concerning…',
    'How should I approach my decision on…',
    'What lesson must I draw from…',
  ],
};

export function pickSuggestions(lang: string, count = 3): string[] {
  const pool = [...(SUGGESTION_POOL[lang] ?? SUGGESTION_POOL.en)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}
