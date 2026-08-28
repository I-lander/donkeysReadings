import type { Card } from './cards';

export interface ArcanaInfo {
  kw: { en: string; fr: string };
  meaning: { en: string; fr: string };
}

/** Indexed by card number (/assets/images/cards/<n>.png). */
export const ARCANA_INFO: ArcanaInfo[] = [
  {
    kw: { en: 'freedom', fr: 'liberté' },
    meaning: {
      en: 'A new departure opens up: travel light, without looking back.',
      fr: "Un nouveau départ s'offre à toi : pars léger, sans regarder en arrière.",
    },
  },
  {
    kw: { en: 'potential', fr: 'potentiel' },
    meaning: {
      en: 'You hold every tool in hand; now is the moment to begin.',
      fr: "Tu as tous les outils en main ; c'est le moment de commencer.",
    },
  },
  {
    kw: { en: 'intuition', fr: 'intuition' },
    meaning: {
      en: 'Not everything is revealed yet: listen to your inner voice.',
      fr: "Tout n'est pas encore révélé : écoute ta voix intérieure.",
    },
  },
  {
    kw: { en: 'creativity', fr: 'créativité' },
    meaning: {
      en: 'A fertile energy nourishes your ideas and projects.',
      fr: 'Une énergie féconde nourrit tes idées et tes projets.',
    },
  },
  {
    kw: { en: 'stability', fr: 'stabilité' },
    meaning: {
      en: 'Lay solid foundations and hold your course firmly.',
      fr: 'Pose des fondations solides et garde le cap avec fermeté.',
    },
  },
  {
    kw: { en: 'wisdom', fr: 'sagesse' },
    meaning: {
      en: 'A counsel or a teaching comes to light your road.',
      fr: 'Un conseil ou un enseignement vient éclairer ta route.',
    },
  },
  {
    kw: { en: 'choice', fr: 'choix' },
    meaning: {
      en: 'A choice of the heart asks to be fully embraced.',
      fr: 'Un choix du cœur demande à être pleinement assumé.',
    },
  },
  {
    kw: { en: 'momentum', fr: 'élan' },
    meaning: {
      en: 'Your momentum carries you: hold the reins and advance.',
      fr: 'Ton élan te porte : tiens les rênes et avance.',
    },
  },
  {
    kw: { en: 'balance', fr: 'équilibre' },
    meaning: {
      en: 'The situation calls for clarity, honesty and measure.',
      fr: 'La situation réclame lucidité, honnêteté et mesure.',
    },
  },
  {
    kw: { en: 'retreat', fr: 'recul' },
    meaning: {
      en: 'Step back: the answer already lives within you.',
      fr: 'Prends du recul : la réponse se trouve déjà en toi.',
    },
  },
  {
    kw: { en: 'turning point', fr: 'tournant' },
    meaning: {
      en: 'One cycle ends, another begins: let the wheel turn.',
      fr: "Un cycle s'achève, un autre s'amorce : laisse la roue tourner.",
    },
  },
  {
    kw: { en: 'courage', fr: 'courage' },
    meaning: {
      en: 'Mastered gentleness overcomes every resistance.',
      fr: 'La douceur maîtrisée vient à bout de toutes les résistances.',
    },
  },
  {
    kw: { en: 'letting go', fr: 'lâcher-prise' },
    meaning: {
      en: 'Change your point of view and accept this suspended time.',
      fr: 'Change de point de vue et accepte ce temps suspendu.',
    },
  },
  {
    kw: { en: 'transformation', fr: 'transformation' },
    meaning: {
      en: 'A page turns to make room for the new.',
      fr: 'Une page se tourne pour laisser place au neuf.',
    },
  },
  {
    kw: { en: 'harmony', fr: 'harmonie' },
    meaning: {
      en: 'Patience and measure soothe what was tense.',
      fr: 'La patience et la mesure apaisent ce qui était tendu.',
    },
  },
  {
    kw: { en: 'attachment', fr: 'attachement' },
    meaning: {
      en: 'Face what holds you back: there lies your freedom.',
      fr: 'Regarde en face ce qui te retient : là est ta liberté.',
    },
  },
  {
    kw: { en: 'revelation', fr: 'révélation' },
    meaning: {
      en: 'A jolt frees what had been frozen for too long.',
      fr: 'Une secousse libère ce qui était figé depuis trop longtemps.',
    },
  },
  {
    kw: { en: 'hope', fr: 'espoir' },
    meaning: {
      en: 'A star watches over you: hope, and dare.',
      fr: 'Une étoile veille sur toi : espère, et ose.',
    },
  },
  {
    kw: { en: 'dream', fr: 'rêve' },
    meaning: {
      en: 'Move gently through the fog of emotions; nothing is clear yet.',
      fr: "Avance doucement dans le brouillard des émotions ; rien n'est encore net.",
    },
  },
  {
    kw: { en: 'clarity', fr: 'clarté' },
    meaning: {
      en: 'Clarity returns: shine without fearing the gaze of others.',
      fr: 'La clarté revient : rayonne sans crainte du regard des autres.',
    },
  },
  {
    kw: { en: 'renewal', fr: 'renouveau' },
    meaning: {
      en: 'A call to renewal makes itself heard: answer it.',
      fr: 'Un appel au renouveau se fait entendre : réponds-lui.',
    },
  },
  {
    kw: { en: 'fulfilment', fr: 'accomplissement' },
    meaning: {
      en: 'A cycle completes itself in plenitude: celebrate the road travelled.',
      fr: "Un cycle s'accomplit dans la plénitude : célèbre le chemin parcouru.",
    },
  },
];

export function arcanaIndex(card: Card): number {
  const match = card.img.match(/(\d+)\.png$/);
  return match ? Number(match[1]) : 0;
}

export function arcanaInfo(card: Card): ArcanaInfo {
  return ARCANA_INFO[arcanaIndex(card)] ?? ARCANA_INFO[0];
}

export function cardName(card: Card, lang: string): string {
  return lang === 'fr' ? card.nameFr : card.nameEn;
}
