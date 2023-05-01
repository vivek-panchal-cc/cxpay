import { ContactsContext } from "context/contactsContext";
import { SendPaymentContext } from "context/sendPaymentContext";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { IconBackgroundStar, IconDelete } from "styles/svgs";

const ContactsItem = (props) => {
  const navigate = useNavigate();
  const { contact, selectedContacts, handleCallback } = props;
  const { handleFavContact, handleOpenConfirmModal } =
    useContext(ContactsContext);

  const { handleSendContacts } = useContext(SendPaymentContext);

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
          />
          <label htmlFor={contact?.account_number}></label>
        </div>
        <div className="con-list-uimg">
          <img
            src={
              contact?.profile_image
                ? contact?.profile_image
                : "assets/images/single_contact_profile.png"
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
        <p>{contact?.mobile}</p>
      </div>

      <div
        className={`${contact?.name ? "con-listing-mail" : "invited-con-mail"}`}
      >
        <p>{contact?.email}</p>
      </div>
      <div className="cont-listing-last-wrap">
        <div className="con-listing-edit-wrap">
          <a className="conlist-edit-a con-list-edit-star">
            <IconBackgroundStar
              fillBack={contact?.is_favourite ? "#F9DB3E" : "#F3F3F3"}
              fillStar={contact?.is_favourite ? "#fff" : ""}
              onClick={() => handleFavContact(contact, "contactsItem")}
            />
          </a>
          <button
            onClick={() =>
              handleOpenConfirmModal(
                [contact?.account_number],
                contact?.name ? contact?.name : "this contact",
                "contactsItem"
              )
            }
            className="conlist-del-a con-list-up"
          >
            <IconDelete />
          </button>
        </div>
        <div className="con-listing-btn-wrap">
          <button
            className="btn btn-primary con-send-btn"
            onClick={() => handleSendContacts([contact])}
          >
            Send
          </button>
          <button
            className="btn btn-primary con-req-btn"
            onClick={() => {
              navigate("/request", {
                state: {
                  contacts: ["HELLO", "WORLD"],
                },
              });
            }}
          >
            Request
          </button>
        </div>
      </div>
    </li>
  );
};

export default ContactsItem;
