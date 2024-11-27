import React, { useContext } from "react";
import { SendPaymentContext } from "context/sendPaymentContext";
import { IconMerchantQR } from "styles/svgs";

const MerchantsItem = (props) => {
  const { merchant, selectedMerchants, handleCallback } = props;
  const {
    handleSendContacts,
    handleSendRecurringContacts,
    handleSendContactsSchedule,
  } = useContext(SendPaymentContext);

  const renderButtons = () => {
    return (
      <div className="merchant-listing-btn-wrap">
        <button
          className="btn btn-primary merchant-send-btn"
          onClick={() => handleSendContacts([merchant])}
        >
          Send
        </button>
        <button
          className="btn btn-primary merchant-rec-btn"
          onClick={() => handleSendRecurringContacts([merchant])}
        >
          Recurring
        </button>
        <button
          className="btn btn-primary merchant-sch-btn"
          onClick={() => handleSendContactsSchedule([merchant])}
        >
          Schedule
        </button>
      </div>
    );
  };

  return (
    <li>
      <label
        className={`${
          merchant?.name ? "mer-listing-info" : "invited-con-info"
        }`}
        htmlFor={merchant?.account_number}
      >
        <div className="con-list-uimg">
          <img
            src={
              merchant?.profile_image
                ? merchant?.profile_image
                : "/assets/images/single_contact_profile.png"
            }
            className="blue-bg"
            alt=""
          />
        </div>
        {merchant?.name ? (
          <div className="mer-list-uname ms-5">{merchant?.name}</div>
        ) : (
          merchant?.mobile
        )}
      </label>
      <div
        className="merchant-icon-wrap"
        onClick={() => handleCallback(merchant)}
      >
        <span className="merchant-listing-second-last-wrap merchant-icon-settings">
          <IconMerchantQR />
        </span>
      </div>
      <div className="merchant-listing-last-wrap">{renderButtons()}</div>
    </li>
  );
};

export default MerchantsItem;
