import React from "react";
import { IconCardBackground } from "styles/svgs";

function CreditCard(props) {
  const { card_number, expiry_date, card_holder_name, color, bg_img } =
    props.details || {};
  const holderName = card_holder_name || "XXXXXX";

  return (
    <div
      className="wallet-ac-inner"
      style={
        bg_img
          ? {
              background: `url(${bg_img})`,
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
            }
          : {
              background: color,
            }
      }
    >
      {!bg_img ? <IconCardBackground /> : null}
      <p
        className="card-holder-nm overflow-hidden"
        style={{ maxHeight: "40%", textOverflow: "ellipsis" }}
      >
        {holderName.length > 25
          ? holderName.slice(0, 25).toUpperCase() + "..."
          : holderName.toUpperCase()}
      </p>
      <div className="card-num-date">
        <p className="">
          .... .... ....{" "}
          {card_number ? card_number?.substr(card_number.length - 4) : "XXXX"}
        </p>
        <p className="">{expiry_date ? `${expiry_date}` : `XX XXXX`}</p>
      </div>
    </div>
  );
}

export default CreditCard;
