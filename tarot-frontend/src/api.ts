import type { TarotCard, Suit, CardParams, DeckType } from '../../common/types.d.ts';
export type { CardParams, TarotCard, Suit, DeckType } from '../../common/types.d.ts';

import { port } from '../port.json';

function getAPIUrl() {
//  return `http://localhost:${port}`;
  return "/api"
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
