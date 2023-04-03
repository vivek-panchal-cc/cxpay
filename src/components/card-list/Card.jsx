import Image from "components/ui/Image";
import React from "react";
import { IconCardBackground } from "styles/svgs";

const Card = (props) => {
  const {
    cardHolderName,
    cardDate,
    cardNumber,
    customClass,
    cardBgImg,
    cardBgColor,
  } = props;
  return (
    <div
      className={`${customClass}`}
      style={
        cardBgImg
          ? {
              background: `url(${cardBgImg})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }
          : { backgroundColor: cardBgColor }
      }
    >
      {!cardBgImg && <IconCardBackground />}
      <p className="card-holder-nm">{cardHolderName}</p>
      <div className="card-num-date">
        <p className="">{cardNumber}</p>
        <p className="">{cardDate}</p>
      </div>
    </div>
  );
};

export default Card;
