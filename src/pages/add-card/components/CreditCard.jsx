import React from "react";
import { IconCardBackground } from "styles/svgs";

function CreditCard(props) {
  const { card_number, expiry_date, card_holder_name, color, bg_img } =
    props.details || {};

  return (
    <div
      className="wallet-ac-inner"
      bg-color={color}
      style={
        bg_img
          ? {
              background: `url(${bg_img})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }
          : {}
      }
    >
      {!bg_img && <IconCardBackground />}
      <p
        className="card-holder-nm overflow-hidden"
        style={{ maxHeight: "40%" }}
      >
        {card_holder_name ? card_holder_name.toUpperCase() : "XXXXXX"}
      </p>
      <div className="card-num-date">
        <p className="">
          .... .... ....{" "}
          {card_number ? card_number?.substr(card_number.length - 4) : "XXXX"}
        </p>
        <p className="">
          {expiry_date
            ? `${expiry_date.split("/")[0]} ${expiry_date.split("/")[1]}`
            : `XX XXXX`}
        </p>
      </div>
    </div>
  );
}

export default CreditCard;
