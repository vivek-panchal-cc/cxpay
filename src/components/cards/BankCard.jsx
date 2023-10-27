import { THEME_COLORS } from "constants/all";
import React from "react";
import { IconBank } from "styles/svgs";

function BankCard(props) {
  const { index, defaultText, item, defaultSelected, handleDefaultBank } =
    props;
  const { id, bank_name, bank_number, routing_number, account_type } = item;

  const getCapitalized = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const handleBankClick = (e) => {
    if (
      e.target.tagName === "INPUT" ||
      e.target.tagName === "LABEL" ||
      e.target === document.getElementById(`bnk_acc_${id}_${index}`)
    ) {
      // if the click is directly on the radio or the label, we don't want to toggle
      return;
    }
    document.getElementById(`bnk_acc_${id}_${index}`)?.click();
  };

  return (
    <li
      className="db-view-bank-div-main db-view-bank-common-div"
      onClick={handleBankClick}
    >
      <div className="bank-logo-name-wrap">
        <div
          className="bank-logo-wrap"
          bg-color={THEME_COLORS[index % THEME_COLORS.length]}
        >
          <IconBank />
        </div>
        <p className="bank-name-wrap">{bank_name}</p>
      </div>
      <div className="bank-account-type-wrap">
        <input
          type="radio"
          id={`bnk_acc_${id}_${index}`}
          name="bank-account-primary"
          checked={defaultSelected}
          onChange={(e) => handleDefaultBank(e, id)}
        />
        <label htmlFor={`bnk_acc_${id}_${index}`}>{defaultText}</label>
      </div>
      <div className="bank-account-routing-num">
        <span>{bank_number}</span>
      </div>
      <div className="bank-account-num-wrap">
        <span>{routing_number}</span>
      </div>
      <div className="bank-account-type-wrap">
        {getCapitalized(account_type) + " Account"}
      </div>
      {/* <div className="bank-bal-wrap">Balance : <span>0</span></div> */}
      {/* <button
        className="bank-del-wrap border-0"
        onClick={() => handleEditBank()}
      >
        <IconEdit style={{ stroke: "#9b9b9b" }} />
      </button>
      <div className="bank-del-wrap" onClick={() => handleOpenConfirmModal(id)}>
        <IconCross style={{ stroke: "#9B9B9B" }} />
      </div> */}
    </li>
  );
}

export default BankCard;
