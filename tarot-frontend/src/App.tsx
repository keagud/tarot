//import Card from "./Card";
import { TarotCard, apiFetch, makeImageUrl, DeckType } from './api';
import { useState, useEffect, useTransition, useReducer, JSX, useRef, useMemo, Component, ReactNode } from 'react';

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
  isReversed: boolean;
}



function Card({ title, image }: CardProps) {

  const transitionDuration = 0.9;
  const transitionDelay = 300;


  const [isFaceUp, setFaceUp] = useState(false);

  const [displayIsFaceup, setDisplayIsFaceup] = useState(false);


  const [displayImage, setDisplayImage] = useState<string>(image);


  const cardBackImage = makeImageUrl('cardback.jpg');


  useEffect(() => {
    setFaceUp(false);
  }, [image]);

  useEffect(() => {
    if (!displayIsFaceup) setFaceUp(true);

  }, [])

  const toggleFaceup = () => {
    setFaceUp(!isFaceUp);
  };

  return (
    <div className="card-container">
      <div
      
        
        className={`  card ${isFaceUp ? 'faceup' : ''}  `}
        style={{ transition: `${transitionDuration}s` }}
        onTransitionEnd={() => {
          setDisplayIsFaceup(isFaceUp)

          if (!displayIsFaceup) {
            setDisplayImage(image);

          }

        }
        }
        onClick={toggleFaceup}
      >
        <div className="card-face front ">
          <img src={makeImageUrl(displayImage)} style={{ clipPath: 'inset(1.4em)' }} />
        </div>
        <div className="card-face back "></div>
      </div>
    </div >
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

function CardDrawWidget({ onDrawFunc }: { onDrawFunc: (_: DeckType) => any }) {
  const [checkedState, setCheckedState] = useState<Array<boolean>>([true, true]);

  const MAJOR_INDEX = 0;
  const MINOR_INDEX = 1;

  const handleOnChange = (d: typeof MAJOR_INDEX | typeof MINOR_INDEX) => {
    const newState = [...checkedState];
    newState[d] = !newState[d];

    // checkbox state can't have both unchecked at once
    if (!newState.every((x) => !x)) {
      setCheckedState(newState);
    }
  };

  const getDeck = () => {
    if (checkedState.every((x) => x)) {
      return 'all';
    }
    return checkedState[MAJOR_INDEX] ? 'major' : 'minor';
  };

  return (
    <>
      <div className="card-draw-widget">
        <div>
          <button onClick={() => onDrawFunc(getDeck())}> Draw </button>
        </div>
        <div>
          <input
            type="checkbox"
            id="draw-major"
            name="draw-major"
            value="major"
            checked={checkedState[MAJOR_INDEX]}
            onChange={() => handleOnChange(MAJOR_INDEX)}
          />
          <label htmlFor="draw-major">Major Arcana</label>

          <input
            type="checkbox"
            id="draw-minor"
            name="draw-minor"
            value="minor"
            checked={checkedState[MINOR_INDEX]}
            onChange={() => handleOnChange(MINOR_INDEX)}
          />
          <label htmlFor="draw-minor">Minor Arcana</label>
        </div>
      </div>
    </>
  );
}

function App() {
  const reversedChance = 0.3;
  const rollReversed = () => Math.random() < reversedChance;

  const [card, setCard] = useState<TarotCard | undefined>();
  const [isReversed, setReversed] = useState(rollReversed());

  const getCard = async (deck: DeckType) => {
    const fetchedCard = await apiFetch(`/draw/${deck}`);

    setReversed(rollReversed);
    setCard(fetchedCard);
  };

  useEffect(() => {
    getCard('all');
  }, []);

  if (card === undefined) {
    return <div id="card-placeholder" />;
  }

  return (
    <>
      <div className="container">
        <div className="display-box-container ">
          <div className="content-box">
            <Card image={card.image} title={card.title} />

            <CardDrawWidget onDrawFunc={getCard} />
          </div>

          <div className="content-box">
            <CardText title={card.title} meaning={card.meaning} description={card.description} />
          </div>
        </div>
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
  }, [children]);

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
