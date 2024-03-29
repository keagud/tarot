import rawData from './cards.json';

import type { TarotCard, Suit, CardParams } from '../../common/types.d.ts';
export type { TarotCard, Suit, CardParams } from '../../common/types.d.ts';

function must<T>(val?: T, message: string | undefined = undefined): NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(message ?? 'Unexpected null value');
  } else {
    return val;
  }
}

function dbg<T>(val: T, message: string | undefined = undefined): T {
  console.log(`${message ?? 'DEBUG'} : ${val}`);
  return val;
}

const cardData = Object.freeze(rawData);

function parseCard(
  data: (typeof cardData.major)[number] | (typeof cardData.minor)[number],
): TarotCard {
  return {
    rank: data.rank,
    suit: data.suit as Suit,
    description: data.description,
    meaning: data.meaning,
    reversed: data.reversed,
    title: data.title,
    image: data.image,
    slug: data.slug,
  } as TarotCard;
}

export const MAJOR_ARCANA = Object.freeze(cardData.major.map(parseCard));
export const MINOR_ARCANA = Object.freeze(cardData.minor.map(parseCard));

export type DeckType = 'major' | 'minor' | 'all';

function getDeck(deck: DeckType): readonly TarotCard[] {
  switch (deck) {
    case 'major':
      return MAJOR_ARCANA;
    case 'minor':
      return MINOR_ARCANA;
    case 'all':
      return [...MAJOR_ARCANA, ...MINOR_ARCANA];
  }
}

export function findCards(params: CardParams): Array<TarotCard> | undefined {
  const deck = getDeck(params.deckType ?? 'all');
  const { deckType, ...searchParams } = params;

  const paramsMap = new Map(Object.entries(searchParams));

  const isMatchingCard = (card: TarotCard) => {
    for (const [k, v] of Object.entries(card)) {
      const desiredVal = paramsMap.get(k);
      if (desiredVal === undefined || desiredVal == v) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  };

  const cardResults = deck.filter(isMatchingCard);

  return cardResults.length === 0 ? undefined : cardResults;
}

export function findSingleCard(params: CardParams): TarotCard | undefined {
  return findCards(params)?.at(0);
}

export function drawCard(deck: DeckType = 'all'): TarotCard | undefined {
  const chosenDeck = getDeck(deck);

  const index = Math.floor(Math.random() * (chosenDeck.length - 1));
  console.log(`index = ${index}`);
  const drawn = chosenDeck[index];

  console.log(`drawn = ${drawn}`);

  return drawn;
}
