//import Card from "./Card";
import { TarotCard, apiFetch, makeImageUrl } from "./api"
import { useState, useEffect } from "react";
import "./Card.css"


interface CardProps {

  title: string
  image: string

}

function Card({ title, image }: CardProps) {

  const [isFlipped, setFlipped] = useState(false);

  const cardBackImage = makeImageUrl("cardback.jpg")
  const cardFrontImage = makeImageUrl(image)

  const commonCardStyles = "w-full border-tarot-slate rounded-xl border-8 shadow-lg shadow-tarot-black"


  console.log(cardFrontImage);

  const toggleFlipped = () => { setFlipped(!isFlipped); };

  return (
    <div className="w-full m-20 relative h-3/5" >

      <div className={` w-full absolute border border-tarot-green  card ${isFlipped ? "flipped" : ""}  `} onClick={toggleFlipped}>

        <div className="card-face front "> <img src={cardFrontImage} className={commonCardStyles} /></div>
        <div className="card-face back"><img src={cardBackImage} className={commonCardStyles} /></div>

      </div>
    </div >)
}



interface CardTextProps {
  title: string
  description: string
  meaning: string
}




function CardText({ title, description, meaning }: CardTextProps) {

  return (<>
    <div className="font-sans m-10 leading-loose text-lg text-tarot-slate">
      <div>
        <h1 className="underline text-3xl text-center">{title.toUpperCase()}</h1>
      </div>


      <br />
      <div className="m-10 overflow-scroll">
        <p>{description}</p>
      </div>

      <br />
      <div className="italic border-tarot-slate border">
        <p> {meaning}</p>

      </div>
    </div>
  </>)


}




function DisplayBox(card: TarotCard) {
  return (<>
    <div className="grid grid-cols-2  w-5/6  my-40 justify-around  gap-3 bg-tarot-lightblue border-4 rounded-lg border-tarot-slate shadow-lg shadow-tarot-black">
      <div className="col-span-1 flex  place-content-center w-full h-full aspect-w-9 aspect-h-15">
        <Card image={card.image} title={card.title} />
      </div>
      <div className="col-span-1 border-l-4 border-tarot-medgray">

        <CardText title={card.title} meaning={card.meaning} description={card.description} />
      </div>


    </div>
  </>)



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

  const displayBox = card === undefined ? <div id="card-placeholder" /> : <DisplayBox {...card} />;
  return (
    <>
      <div className="flex items-center justify-center w-screen">
        {displayBox}
      </div>
    </>
  );
}

export default App;
