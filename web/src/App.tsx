import './App.css';
import Card, { CardBack } from './Card';
import { TarotCard, apiFetch, makeImageUrl, DeckType } from './api';
import {
  useState,
  useEffect,
  useTransition,
  useReducer,
  JSX,
  useRef,
  useMemo,
  Component,
  ReactNode,
} from 'react';

import _, { get } from 'lodash';

const getMask = (
  [start, end]: [number, number],
  step: number = 0.3,
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

interface CardTextProps {
  title: string;
  description: string;
  meaning: string;
}

function CardText({ title, description, meaning }: CardTextProps) {
  const [_, setRunAnimation] = useState(true);

  const [[gradientStart, gradientEnd], setGradient] = useState<[number, number]>([100, 100]);
  const requestRef = useRef<number>(0);

  const updateGradient = () => {
    setGradient(([s, e]) => getMask([s, e]));
    requestRef.current = requestAnimationFrame(updateGradient);
  };

  const resetAnimation = () => {
    setGradient([100, 100]);
    requestRef.current = 0;
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateGradient);

    if (requestRef.current != undefined) {
      setRunAnimation(false);
      return () => {
        cancelAnimationFrame(requestRef.current);
        resetAnimation();
      };
    }
  }, [title, description, meaning]);

  return (
    <>
      <div
        style={{
          maskImage: `linear-gradient(0deg, transparent ${gradientStart}%, black ${gradientEnd}%`,
        }}
      >
        <>
          {/* <div className="card-text font-sans m-10 leading-loose  text-tarot-jet"> */}
          <h2
            className="card-title"
          >
            {title.toUpperCase()}
          </h2>

          <div onClick={() => setGradient([0, 0])}>
            <br />
            <p> {meaning}</p>
            <br />
            <span className="dingbat">❂❂❂</span>

            <br />

            <div
              className="card-description-text"
            >
              {' '}
              <>
                <p> {description} </p>{' '}
              </>
            </div>
          </div>
          {/* </div> */}
        </>
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
        <button className="draw-button" onClick={() => onDrawFunc(getDeck())}>
          {' '}
          <div className="draw-button-text">Draw</div>{' '}
        </button>
        <div className="deck-select-opts">
          <div className="deck-select">
            <label className="checkbox">
              <input
                type="checkbox"
                className={`deck-checkbox ${checkedState[MAJOR_INDEX] ? 'checked' : ''}`}
                id="draw-major"
                name="draw-major"
                value="major"
                checked={checkedState[MAJOR_INDEX]}
                onChange={() => handleOnChange(MAJOR_INDEX)}
              />
              Major Arcana
            </label>
          </div>

          <div className="deck-select">
            <label className="checkbox">
              <input
                type="checkbox"
                className={`deck-checkbox ${checkedState[MINOR_INDEX] ? 'checked' : ''}`}
                id="draw-minor"
                name="draw-minor"
                value="minor"
                checked={checkedState[MINOR_INDEX]}
                onChange={() => handleOnChange(MINOR_INDEX)}
              />
              Minor Arcana
            </label>
          </div>
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
    let drawnCard = await apiFetch(`/draw/${deck}`);
    setCard(drawnCard);
    setReversed(rollReversed);
  };

  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      getCard('all');
    }
  }, []);

  if (card === undefined) {
    return <div id="card-placeholder" />;
  }

  return (
    <>
      <div className="container display-box-container ">
        <div className="content-box card-art-box">
          <Card image={card.image} isReversed={isReversed} />

          <CardDrawWidget onDrawFunc={getCard} />
        </div>

        <div className="content-box card-text-box">
          <CardText
            title={isReversed ? `${card.title.trim()} (REVERSED)` : card.title.trim()}
            meaning={isReversed ? card.reversed : card.meaning} description={card.description} />
        </div>
      </div>

        <div className="bottom-bar" >
          <a href='https://implicit.computer'>Who made this?</a>
        </div>

    </>
  );
}

export default App;
