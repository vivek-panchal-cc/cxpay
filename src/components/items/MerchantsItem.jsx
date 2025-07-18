import React, { useContext, useState } from "react";
import { SendPaymentContext } from "context/sendPaymentContext";
import { IconQR } from "styles/svgs";
import ModalPaymentScheduler from "components/modals/ModalPaymentScheduler";
import {
  capitalizeWordByWord,
  getInitials,
  getRandomColorClass,
} from "constants/all";
import { useSelector } from "react-redux";

const MerchantsItem = (props) => {
  const { profile } = useSelector((state) => state?.userProfile);
  const { merchant, selectedMerchants, handleCallback } = props;
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const {
    handleSendContacts,
    handleSendRecurringContacts,
    handleSendContactsSchedule,
    handleSelectedContacts,
  } = useContext(SendPaymentContext);

  const renderButton = (label, baseClass, onClick, disabled = false) => {
    const className = `btn btn-primary ${!disabled ? baseClass : ""} ${
      disabled ? "merchants-admin-approved-disabled" : ""
    }`;
    return (
      <button
        className={className.trim()}
        onClick={disabled ? null : onClick}
        disabled={disabled}
      >
        {label}
      </button>
    );
  };

  const renderButtons = () => {
    const isDisabled = !profile.admin_approved;
    return (
      <div className="merchant-listing-btn-wrap">
        {renderButton(
          "Proceed to Pay",
          "merchant-send-btn",
          () => handleSendContacts([merchant]),
          isDisabled
        )}
        {renderButton(
          "Recurring",
          "merchant-rec-btn",
          () => handleSendRecurringContacts([merchant]),
          isDisabled
        )}
        {renderButton(
          "Schedule",
          "merchant-sch-btn",
          () => {
            setShowSchedulePopup(true);
            handleSelectedContacts([merchant]);
          },
          isDisabled
        )}
      </div>
    );
  };

  return (
    <>
      <li>
        <label
          className={`${
            merchant?.name ? "mer-listing-info" : "invited-con-info"
          }`}
          htmlFor={merchant?.account_number}
        >
          <div className="con-list-uimg">
            {merchant.profile_image ? (
              <img src={merchant.profile_image} className="blue-bg" alt="" />
            ) : (
              <div
                className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                  merchant?.name
                )}`}
              >
                {getInitials(merchant?.name)}
              </div>
            )}
            {/* <img
              src={
                merchant?.profile_image
                  ? merchant?.profile_image
                  : "/assets/images/single_contact_profile.png"
              }
              className="blue-bg"
              alt=""
            /> */}
          </div>
          {merchant?.name ? (
            <div className="mer-list-uname">{merchant?.name}</div>
          ) : (
            merchant?.mobile
          )}
        </label>
        {merchant?.category_name && (
          <div className="merchant-listing-category">
            <p>{capitalizeWordByWord(merchant?.category_name)}</p>
          </div>
        )}
        <div
          className="merchant-icon-wrap"
          onClick={() => handleCallback(merchant)}
        >
          <span className="merchant-listing-second-last-wrap merchant-icon-settings">
            <IconQR />
          </span>
        </div>
        <div className="merchant-listing-last-wrap">{renderButtons()}</div>
      </li>
      <ModalPaymentScheduler
        classNameChild="schedule-time-modal"
        show={showSchedulePopup}
        setShow={setShowSchedulePopup}
        handleSubmit={handleSendContactsSchedule}
      />
    </>
  );
};

export default MerchantsItem;
