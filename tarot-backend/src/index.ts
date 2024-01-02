import path from 'path';
import express, { Express, Response } from 'express';
import { findSingleCard, DeckType, drawCard } from './tarot';
import cors from 'cors';

import type { Suit, RankName, TarotCard } from './tarot';

function handleResponse<R extends Response>(res: R, card?: TarotCard) {
  card === undefined ? res.sendStatus(404) : res.json(card);
  console.log(card);
  res.end();
  return res;
}

function main() {
  const app: Express = express();
  const port = process.env.PORT ?? '3000';

  app.use(cors());

  const staticDir = path.resolve(process.cwd() + '/public/');
  console.log(`static directory = ${staticDir}`);

  app.use(express.static(staticDir));

  //get a random card from :deck
  app.get('/draw/:deck', (req, res) => {
    const { deck } = req.params;
    handleResponse(res, drawCard(deck as DeckType));
  });

  // get a major arcana card by name
  app.get('/cards/major-arcana/:cardName', (req, res) => {
    const { cardName } = req.params;
    const drawn = findSingleCard({ rankName: 'major', suit: cardName as Suit, deckType: 'major' });
    handleResponse(res, drawn);
  });

  // get a minor arcana card by suit and rank
  app.get('/cards/minor-arcana/:suit/:rankName', (req, res) => {
    const { suit, rankName } = req.params;
    handleResponse(
      res,
      findSingleCard({ suit: suit as Suit, rankName: rankName as RankName, deckType: 'minor' }),
    );
  });

  app.listen(port);
}

main();
