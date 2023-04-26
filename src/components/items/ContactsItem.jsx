import { ContactsContext } from "context/contactsContext";
import { SendPaymentContext } from "context/sendPaymentContext";
import React, { useContext } from "react";
import { IconDelete } from "styles/svgs";

const ContactsItem = (props) => {
  const { contact, selectedContacts, handleCallback } = props;
  const { handleFavContact, handleOpenConfirmModal, favIconShow } =
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
            {!favIconShow && contact?.is_favourite === false ? (
              <img
                src="assets/images/Star.svg"
                onClick={() =>
                  handleFavContact(
                    contact?.mobile,
                    contact?.country_code,
                    1,
                    "contactsItem"
                  )
                }
                className="star_border"
                alt=""
              />
            ) : (
              <img
                src="assets/images/star_fill.svg"
                className="star_fill"
                onClick={() =>
                  handleFavContact(
                    contact?.mobile,
                    contact?.country_code,
                    0,
                    "contactsItem"
                  )
                }
                alt=""
              />
            )}
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
          <a href="/" className="btn btn-primary con-req-btn">
            Request
          </a>
        </div>
      </div>
    </li>
  );
};

export default ContactsItem;
