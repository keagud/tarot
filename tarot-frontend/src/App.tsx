//import Card from "./Card";
import { TarotCard, apiFetch, makeImageUrl } from "./api"
import { useState, useEffect } from "react";
import "./Card.css"
/*
 
import React, { useState } from 'react';

enum CardFace {
  Front = 1,
  Back = -1,
}

interface ICardProps {
  frontFace: JSX.Element;
  backFace: JSX.Element;
}

const Card: React.FC<ICardProps> = ({ frontFace, backFace }) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`w-64 h-80 bg-white rounded shadow-md cursor-pointer transform ${isFlipped ? 'rotate-y-180' : 'rotate-y-0'} transition-transform duration-700 ease-in`} 
      onClick={handleClick}
    >
      <div 
        className={`absolute w-full h-full rounded bg-red-600 ${!isFlipped ? 'invisible' : ''} backface-hidden`}
      >
        {frontFace}
      </div>
      <div 
        className={`absolute w-full h-full rounded bg-blue-600 ${isFlipped ? 'invisible' : ''} backface-hidden`}
      >
        {backFace}
      </div>
    </div>
  );
};

export default Card;

 */

interface CardProps {

  title: string
  image: string

}

function Card({ title, image }: CardProps) {

  const [isFlipped, setFlipped] = useState(false);

  const cardBackImage = makeImageUrl("cardback.jpg")
  const cardFrontImage = makeImageUrl(image)
  console.log(cardFrontImage);

  const toggleFlipped = () => { setFlipped(!isFlipped); };

  return (<div className={`card ${isFlipped ? "flipped" : ""}`} onClick={toggleFlipped}>

    <div className="card-face front"> <img src={cardFrontImage} /></div>
    <div className="card-face back"><img src={cardBackImage} /></div>


  </div >)

}

function App() {

  const [card, setCard] = useState<TarotCard | undefined>()

  useEffect(() => {
    const getCard = async () => {
      const fetchedCard = await apiFetch("/draw/all");
      setCard(fetchedCard);
    };

    getCard();
  }, []);

  const displayCard = card === undefined ? <div></div> : <Card title={card.title} image={card.image} />;
  return (
    <>
      <h1> Hello world! </h1>
      {displayCard}
    </>
  );
}

export default App;
