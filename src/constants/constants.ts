export type TranslatedText = Record<string, string>;

export const INTRODUCTION: TranslatedText = {
  en: "Welcome to the Donkey's Readings!",
  fr: "Bienvenue dans les Lectures de l'Ane !",
};

export const DESCRIPTION: TranslatedText = {
  en: 'Ask a question and our AI will provide a reading based on the Marseille Tarot.\r\nThe more specific the question, the more accurate the reading will be.',
  fr: 'Posez une question et notre IA vous proposera un tirage basé sur le tarot de Marseille.\r\nPlus la question sera précise, plus la lecture le sera.',
};

export const PLACEHOLDER: TranslatedText = { en: 'Your question', fr: 'Votre question' };

export const WATCH_AD_PROMPT: TranslatedText = {
  en: 'You have used your free readings for today. Watch a short ad to unlock another reading?',
  fr: 'Vous avez utilisé vos tirages gratuits du jour. Regarder une courte publicité pour débloquer un tirage ?',
};

export const QUOTA_EXHAUSTED: TranslatedText = {
  en: 'You have used your free readings for today. Come back tomorrow!',
  fr: 'Vous avez utilisé vos tirages gratuits du jour. Revenez demain !',
};

export const SIGN_IN: TranslatedText = {
  en: 'Sign in with Google',
  fr: 'Se connecter avec Google',
};

export const SIGN_OUT: TranslatedText = {
  en: 'Sign out',
  fr: 'Se déconnecter',
};

export const SIGN_IN_FAILED: TranslatedText = {
  en: 'Google sign-in failed. Please try again.',
  fr: 'La connexion Google a échoué. Réessayez.',
};

export const AD_FAILED: TranslatedText = {
  en: 'The ad could not be shown. Please try again later.',
  fr: "La publicité n'a pas pu être affichée. Réessayez plus tard.",
};
