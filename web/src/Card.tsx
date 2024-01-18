import { useState, useRef, useEffect } from 'react';
import { makeImageUrl } from './api';

// SVG for the card back image
export function CardBack() {
  const innerSvgSize = 200;
  const [centerX, centerY] = [innerSvgSize / 2, innerSvgSize / 2];
  const radius = innerSvgSize / 4;

  const findPoint = (cx: number, cy: number, rad: number, cornerGrad: number): [number, number] => {
    let cornerRad = (cornerGrad * Math.PI) / 180;
    let nx = Math.cos(cornerRad) * rad + cx;
    let ny = Math.sin(cornerRad) * rad + cy;
    return [nx, ny];
  };

  let circlePoints = Array(6)
    .fill(null)
    .map((_, i) => findPoint(centerX, centerY, radius, 60 * i));

  let circles = circlePoints.map(([x, y], i) => (
    <circle cx={x} cy={y} r={radius} fill="transparent" key={i} />
  ));

  return (
    <div className="card-back" style={{ width: '100%', height: '100%' }}>
      <svg
        version="1.1"
        width={'100%'}
        height={'100%'}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={'0 0  100% 100%'}
      >
        <rect width={'100%'} height={'100%'} fill={'black'} />
        <svg viewBox={`0 0 ${innerSvgSize} ${innerSvgSize}`}>
          <g stroke="white" strokeWidth={2} transform={'translate("50%", "50%")'}>
            {circles}
            <circle
              className="center-circle"
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="transparent"
            />
          </g>
        </svg>
      </svg>
    </div>
  );
}

interface CardProps {
  image: string;
  isReversed: boolean;
}

export default function Card({ image, isReversed }: CardProps) {
  const animationSecs = 0.7;

  const [isFlipping, setIsFlipping] = useState(true);
  const displayReversed = useRef<boolean>(isReversed);

  const displayImage = useRef<string>(image);

  useEffect(() => {
    setIsFlipping(true);

    setTimeout(() => {
      displayImage.current = image;
      displayReversed.current = isReversed;
      setIsFlipping(false);
    }, animationSecs * 1000);
  }, [image]);

  return (
    <div className="card-container">
      <div className={`  card ${isFlipping ? 'card flipping' : 'card'}  `}>
        <div className="front " style={{ transition: `transform ${animationSecs}s` }}>
          <img
            className={displayReversed.current ? 'reversed' : ''}
            src={makeImageUrl(displayImage.current)}
          />
        </div>

        <div className="back" style={{ transition: `transform ${animationSecs}s` }}>
          <CardBack />
        </div>
      </div>
    </div>
  );
}
