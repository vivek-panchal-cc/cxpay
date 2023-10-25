import React from "react";
import { IconCancel, IconCardBackground, IconEdit } from "styles/svgs";

function CardItem(props) {
  const { index, item, handleDelete, handleEdit, handleDefaultCard } = props;
  const {
    id,
    card_holder_first_name,
    card_holder_last_name,
    card_number,
    color,
    expiry_date,
    image,
    mark_as_default,
  } = item;

  const handleCardClick = (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "LABEL" ||
      e.target === document.getElementById(`bnk_acc_${index}`)
    ) {
      // if the click is directly on the radio or the label, we don't want to toggle
      return;
    }
    document.getElementById(`bnk_acc_${index}`)?.click();
  };

  const handleButtonClick = (e, callback, item) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    callback(item);
  };

  return (
    <li
      className="db-view-bank-div-main db-view-bank-common-div"
      onClick={handleCardClick}
    >
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
          {!image ? <IconCardBackground height="100%" width="100%" /> : null}
        </div>
        <p className="bank-cardname-wrap">{`${card_holder_first_name} ${card_holder_last_name}`}</p>
      </div>
      <div className="bank-account-type-wrap">
        <input
          type="radio"
          id={`bnk_acc_${index}`}
          name="bank-account-primary"
          checked={mark_as_default === 1 ? true : false}
          onChange={(e) => handleDefaultCard(e, id)}
        />
        <label htmlFor={`bnk_acc_${index}`}>Primary Card</label>
      </div>
      <div className="bank-account-num-wrap">
        XXXXXX<span>{card_number}</span>
      </div>
      <div className="bank-account-date-wrap">{expiry_date}</div>
      <button
        type="button"
        className="bank-del-wrap border-0"
        // onClick={() => handleEdit(item)}
        onClick={(e) => handleButtonClick(e, handleEdit, item)}
      >
        <IconEdit style={{ stroke: "#9b9b9b" }} />
      </button>
      <button
        type="button"
        className="bank-del-wrap border-0"
        // onClick={() => handleDelete(item)}
        onClick={(e) => handleButtonClick(e, handleDelete, item)}
      >
        <IconCancel style={{ stroke: "#9b9b9b" }} />
      </button>
    </li>
  );
}

export default CardItem;
