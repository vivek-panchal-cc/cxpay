import React from "react";
import { IconCancel, IconCardBackground, IconEdit } from "styles/svgs";

function CardItem(props) {
  const { item, handleDelete, handleEdit } = props;
  const {
    billing_address,
    card_holder_name,
    card_number,
    color,
    expiry_date,
    id,
    image,
  } = item;

  return (
    <li className="db-view-bank-div-main db-view-bank-common-div">
      <div className="bank-card-name-wrap">
        <div
          className="bank-card-wrap"
          style={
            image
              ? {
                  background: `url(${image})`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                }
              : { background: color }
          }
        >
          {!image && <IconCardBackground height="100%" width="100%" />}
        </div>
        <p className="bank-cardname-wrap">{card_holder_name}</p>
      </div>
      <div className="bank-account-num-wrap">
        XXXXXX<span>{card_number}</span>
      </div>
      <div className="bank-account-date-wrap">{expiry_date}</div>
      {/* <div className="bank-bal-wrap">
        Balance : <span>1234.00</span>
      </div> */}
      <button
        className="bank-del-wrap border-0"
        onClick={() => handleEdit(item)}
      >
        <IconEdit style={{ stroke: "#9b9b9b" }} />
      </button>
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
