import type { TarotCard, Suit, CardParams, DeckType } from '../../common/types.d.ts';
export type { CardParams, TarotCard, Suit, DeckType } from '../../common/types.d.ts';

function getAPIUrl() {
  if (import.meta.env.PROD) {
    return '/api';
  } else {
    const port = import.meta.env.VITE_PORT ?? '8080';
    return `http://localhost:${port}/api`;
  }
}

const apiUrl = getAPIUrl();

export function makeImageUrl(imageFile: string): string {
  return `${apiUrl}/images/${imageFile}`;
}

export async function apiFetch(pathParams: string): Promise<TarotCard> {
  const p = pathParams.replace(/^\/|\/$/g, '');
  const url = `${apiUrl}/${p}`;
  return await fetch(url)
    .then((x) => x.json())
    .then((j) => j as TarotCard);
}
