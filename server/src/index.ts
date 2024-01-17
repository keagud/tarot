import path from 'path';
import express, { Express, Response } from 'express';
import { findSingleCard, DeckType, drawCard } from './tarot';
import morgan from 'morgan';
import cors from 'cors';

import type { Suit, TarotCard } from './tarot';

function handleResponse<R extends Response>(res: R, card?: TarotCard) {
  card === undefined ? res.sendStatus(404) : res.json(card);
  console.log(card ?? 'UNDEFINED');
  res.end();
  return res;
}

function main() {
  const isDebug = (process.env.NODE_ENV ?? 'development') === 'development';

  console.log(`EXPRESS DEBUG STATUS: ${isDebug}`)

  const app: Express = express();
  const port = process.env.PORT ?? '8080';
  console.log(`Using port ${port}`);

  const router = express.Router();

  // in prod nginx handles trimming the urls
  const routeRoot = isDebug ? '/api' : '/';

  const staticDir = process.env.STATIC_DIR ?? path.resolve(process.cwd() + '/static/');
  console.log(`static directory = ${staticDir}`);

  app.use(routeRoot, express.static(staticDir));
  app.use(morgan('combined'));

  //get a random card from :deck
  router.get('/draw/:deck', (req, res) => {
    const { deck } = req.params;
    handleResponse(res, drawCard(deck as DeckType));
  });

  // get a major arcana card by name
  router.get('/cards/major-arcana/:cardName', (req, res) => {
    const { cardName } = req.params;
    const drawn = findSingleCard({ deckType: 'major' });
    handleResponse(res, drawn);
  });

  // get a minor arcana card by suit and rank
  router.get('/cards/minor-arcana/:suit/:rank', (req, res) => {
    const { suit, rank } = req.params;
    handleResponse(
      res,
      findSingleCard({ suit: suit as Suit, rank: Number(rank), deckType: 'minor' }),
    );
  });

  if (isDebug) {
    app.use(cors());
  }
  app.use(routeRoot, router);

  app.listen(port);
}

main();
