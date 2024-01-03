const suits = ['pentacles', 'wands', 'swords', 'cups', 'major'] as const;

export type Suit = (typeof suits)[number];

export interface TarotCard {
  rank: number;
  suit: Suit;
  description: string;
  meaning: string;
  reversed: string;
  title: string;
  image: string;
  slug: string
}

export type CardParams = Partial<TarotCard & { deckType: DeckType }>;
export type DeckType = 'major' | 'minor' | 'all';
