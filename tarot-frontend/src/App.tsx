//import Card from "./Card";
import { TarotCard, apiFetch, makeImageUrl, DeckType } from './api';
import { useState, useEffect, JSX, useRef, Component, ReactNode } from 'react';

import './Card.css';
import _ from 'lodash';

const getMask = (
  [start, end]: [number, number],
  step: number = 1,
  gap: number = 50,
): [number, number] => {
  const satsub = (n: number) => Math.max(0, n - step);
  if (start + gap > 100) {
    return [satsub(start), end];
  } else if (start > 0) {
    return [satsub(start), satsub(end)];
  } else if (end > 0) {
    return [0, satsub(end)];
  } else {
    return [0, 0];
  }
};

interface CardProps {
  title: string;
  image: string;
}

function Card({ title, image }: CardProps) {
  const [isFlipped, setFlipped] = useState(true);

  const cardBackImage = makeImageUrl('cardback.jpg');
  const cardFrontImage = makeImageUrl(image);
  const commonCardStyles =
    'w-full border-tarot-slate rounded-xl border-[20px] shadow-lg shadow-tarot-black';

  useEffect(() => {
    setFlipped(false);
    setTimeout(() => setFlipped(true), 300);
  }, []);

  console.log(cardFrontImage);

  const toggleFlipped = () => {
    setFlipped(!isFlipped);
  };

  return (
    <div className="w-full m-20 relative h-3/5 max-w-[700px]">
      <div
        className={` w-full absolute tarot-green  card ${isFlipped ? 'flipped' : ''}  `}
        onClick={toggleFlipped}
      >
        <div className="card-face front border-tarot-slate rounded-xl border-[2em] outline-offset-[-8] bg-tarot-lightgray">
          <img src={cardFrontImage} className={'w-full '} style={{ clipPath: 'inset(1.4em)' }} />
        </div>
        <div className="card-face back aspect-w-9 aspect-h-15 bg-tarot-orange rounded-xl"></div>
      </div>
    </div>
  );
}

interface CardTextProps {
  title: string;
  description: string;
  meaning: string;
}

function CardText({ title, description, meaning }: CardTextProps) {
  return (
    <>
      <div className="font-sans m-10 leading-loose  text-tarot-jet">
        <div>
          <h1
            className="underline text-center outline-tarot-yellow"
            style={{ fontFamily: 'Vulnus', fontSize: '3.5em' }}
          >
            {title.toUpperCase()}
          </h1>
        </div>

        <FadeInText>
          <div>
            <br />
            <div
              className="text-center m-10"
              style={{ fontFamily: 'wollstonecraft', fontSize: '1.7em' }}
            >
              <p> {meaning}</p>
            </div>
            <br />
            <div
              className="m-10 overflow-scroll"
              style={{ fontFamily: 'wollstonecraft', fontSize: '1.7em', fontStyle: 'italic' }}
            >
              <FadeInText>
                {' '}
                <>
                  <p> {description} </p>{' '}
                </>
              </FadeInText>
            </div>
          </div>
        </FadeInText>
      </div>
    </>
  );
}

function DisplayBox(card: TarotCard) {
  return (
    <>
      <div className="grid grid-cols-2  w-5/6  my-40 justify-around  gap-3 bg-tarot-lightblue border-4 rounded-lg border-tarot-slate shadow-lg shadow-tarot-black max-w-[2000px]">
        <div className="col-span-1 flex  place-content-center w-full h-full aspect-w-9 aspect-h-12">
          <Card image={card.image} title={card.title} />
        </div>
        <div className="col-span-1 border-l-4 border-tarot-medgray">
          <CardText title={card.title} meaning={card.meaning} description={card.description} />
        </div>
      </div>
    </>
  );
}

function DrawCardOptions({ selectFunc }: { selectFunc: (DeckType) => any }) {
  return (
    <>
      <div>
        <button></button>
      </div>
    </>
  );
}

function App() {
  const [card, setCard] = useState<TarotCard | undefined>();

  useEffect(() => {
    const getCard = async () => {
      const fetchedCard = await apiFetch('/draw/all');
      setCard(fetchedCard);
    };

    getCard();
  }, []);

  const displayBox = card === undefined ? <div id="card-placeholder" /> : <DisplayBox {...card} />;
  return (
    <>
      <div className="flex items-center justify-center w-screen">
        <div>{displayBox}</div>
      </div>
      <div className="border flex items-center justify-center">
        <button>foo</button>
      </div>
    </>
  );
}

function FadeInText({ children }: { children: ReactNode }) {
  const [runAnimation, setRunAnimation] = useState(true);

  const [[gradientStart, gradientEnd], setGradient] = useState<[number, number]>([100, 100]);
  const requestRef = useRef<number>(0);

  const updateGradient = () => {
    setGradient(([s, e]) => getMask([s, e]));
    requestRef.current = requestAnimationFrame(updateGradient);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGradient);

    if (requestRef.current != undefined) {
      setRunAnimation(false);
      return () => {
        cancelAnimationFrame(requestRef.current);
      };
    }
  }, []);

  return (
    <>
      <div
        style={{
          maskImage: `linear-gradient(0deg, transparent ${gradientStart}%, black ${gradientEnd}%`,
        }}
      >
        {children}
      </div>
    </>
  );
}

export default App;
