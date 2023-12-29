const suits = [
  'temperance',
  'high-priestess',
  'world',
  'fool',
  'pentacles',
  'cups',
  'hermit',
  'sun',
  'swords',
  'magician',
  'hanged-man',
  'chariot',
  'strength',
  'death',
  'moon',
  'tower',
  'justice',
  'star',
  'lovers',
  'hierophant',
  'emperor',
  'judgment',
  'wands',
  'empress',
  'wheel-of-fortune',
  'devil',
] as const;

const ranks = [
  'ace',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'page',
  'knight',
  'queen',
  'king',
  'major',
] as const;

export type RankName = (typeof ranks)[number];
export type Suit = (typeof suits)[number];

export interface TarotCard {
  rank: number;
  rankName: RankName;
  suit: Suit;
  description: string;
  meaning: string;
  reversed: string;
  title: string;
  image: string;
  imageReversed: string;
  normalizedName: string;
}

export type CardParams = Partial<TarotCard & { deckType: DeckType }>;
export type DeckType = 'major' | 'minor' | 'all';
