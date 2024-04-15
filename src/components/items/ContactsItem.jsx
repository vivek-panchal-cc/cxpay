import React, { useContext } from "react";
import { SendPaymentContext } from "context/sendPaymentContext";
import { IconBackgroundStar, IconDelete } from "styles/svgs";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

const ContactsItem = (props) => {
  const {
    contact,
    selectedContacts,
    handleCallback,
    handleFavContact,
    handleDeleteContact,
  } = props;

  const { profile } = useSelector((state) => state?.userProfile);
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const { handleSendContacts, handleSendRequest } =
    useContext(SendPaymentContext);

  const userType =
    contact?.user_type?.charAt(0).toUpperCase() + contact?.user_type?.slice(1);

  const renderButtons = () => {
    if (profile.admin_approved) {
      if (
        contact.admin_approved &&
        contact.kyc_approved &&
        show_renew_section !== "disable_fund_action" &&
        show_renew_section !== "renew_limit_exceed_and_disable"
      ) {
        return (
          <div className="con-listing-btn-wrap">
            <button
              className="btn btn-primary con-send-btn"
              onClick={() => handleSendContacts([contact])}
            >
              Send
            </button>
            <button
              className="btn btn-primary con-req-btn"
              onClick={() => handleSendRequest([contact])}
            >
              Request
            </button>
          </div>
        );
      } else {
        return (
          <div className="con-listing-btn-wrap">
            <button className="btn btn-primary contacts-admin-approved-disabled">
              Send
            </button>
            <button className="btn btn-primary contacts-admin-approved-disabled">
              Request
            </button>
          </div>
        );
      }
    } else {
      return (
        <div className="con-listing-btn-wrap">
          <button className="btn btn-primary contacts-admin-approved-disabled">
            Send
          </button>
          <button className="btn btn-primary contacts-admin-approved-disabled">
            Request
          </button>
        </div>
      );
    }
  };

  const disabledCheckedBox = () => {
    if (profile.admin_approved) {
      return !contact.admin_approved || !contact.kyc_approved;
    } else {
      return true;
    }
  };

  return (
    <li>
      <label
        className={`${contact?.name ? "con-listing-info" : "invited-con-info"}`}
        htmlFor={contact?.account_number}
      >
        <div className="con-listing-check">
          <input
            id={contact?.account_number}
            type="checkbox"
            onChange={handleCallback}
            checked={selectedContacts?.includes(contact?.account_number)}
            value={contact?.account_number}
            disabled={disabledCheckedBox()}
          />
          <label htmlFor={contact?.account_number}></label>
        </div>
        <div className="con-list-uimg">
          <img
            src={
              contact?.profile_image
                ? contact?.profile_image
                : "/assets/images/single_contact_profile.png"
            }
            className="blue-bg"
            alt=""
          />
        </div>
        {contact?.name ? (
          <div className="con-list-uname">{contact?.name}</div>
        ) : (
          contact?.mobile
        )}
      </label>
      <div className="con-listing-phone">
        <p>+{contact?.mobile}</p>
      </div>
      <div
        className={`${contact?.name ? "con-listing-mail" : "invited-con-mail"}`}
      >
        <p>{contact?.email}</p>
      </div>
      <div className="con-listing-phone">
        <p>{userType}</p>
      </div>
      <div className="cont-listing-last-wrap">
        <div className="con-listing-edit-wrap">
          <a className="conlist-edit-a con-list-edit-star">
            <IconBackgroundStar
              fillBack={contact?.is_favourite ? "#F9DB3E" : "#F3F3F3"}
              fillStar={contact?.is_favourite ? "#fff" : ""}
              onClick={() => handleFavContact(contact)}
            />
          </a>
          <button
            onClick={() => handleDeleteContact(contact)}
            className="conlist-del-a con-list-up"
          >
            <IconDelete />
          </button>
        </div>
        {renderButtons()}
        {/* {contact.admin_approved ? (
          <div className="con-listing-btn-wrap">
            <button
              className="btn btn-primary con-send-btn"
              onClick={() => handleSendContacts([contact])}
            >
              Send
            </button>
            <button
              className="btn btn-primary con-req-btn"
              onClick={() => handleSendRequest([contact])}
            >
              Request
            </button>
          </div>
        ) : (
          <div className="con-listing-btn-wrap">
            <button className="btn btn-primary contacts-admin-approved-disabled">
              Send
            </button>
            <button className="btn btn-primary contacts-admin-approved-disabled">
              Request
            </button>
          </div>
        )} */}
      </div>
    </li>
  );
};

export default ContactsItem;
