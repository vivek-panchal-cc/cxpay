import React from "react";
import { IconCancel, IconCardBackground } from "styles/svgs";

function CardItem(props) {
  const { item, handleDelete } = props;
  const {
    account_number,
    billing_address,
    card_number,
    color,
    expiry_date,
    id,
    image,
    inst_id,
  } = item;

  return (
    <li className="db-view-bank-div-main db-view-bank-common-div">
      <div className="bank-card-name-wrap">
        <div
          className="bank-card-wrap"
          bg-color={item?.color}
          style={
            image
              ? {
                  background: `url(${image})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }
              : {}
          }
        >
          <IconCardBackground height="100%" width="100%" />
        </div>
        <p className="bank-cardname-wrap">Card Bank Name</p>
      </div>
      <div className="bank-account-num-wrap">
        XXXXXX<span>{card_number}</span>
      </div>
      <div className="bank-account-date-wrap">{expiry_date}</div>
      <div className="bank-bal-wrap">
        Balance : <span>1234.00</span>
      </div>
      <button
        className="bank-del-wrap border-0"
        onClick={() => handleDelete(item)}
      >
        <IconCancel style={{ stroke: "#9b9b9b" }} />
      </button>
    </li>
  );
}

export default CardItem;
