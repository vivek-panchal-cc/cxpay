import React from "react";
import { IconCardBackground } from "styles/svgs";

function CreditCard(props) {
  const { bgcolor, bgimg, cardNumber } = props;

  return (
    <div
      className="wallet-ac-inner"
      bg-color={bgcolor}
      style={
        bgimg
          ? {
              background: `url(${bgimg})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }
          : {}
      }
    >
      <IconCardBackground />
      <p className="card-holder-nm">XXXXXX</p>
      <div className="card-num-date">
        <p className="">
          .... .... ....{" "}
          {cardNumber ? cardNumber?.substr(cardNumber.length - 4) : "XXXX"}
        </p>
        <p className="">XX XXX XXXX</p>
      </div>
    </div>
  );
}

export default CreditCard;
