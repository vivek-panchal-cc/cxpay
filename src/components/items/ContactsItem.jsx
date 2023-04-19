import { ContactsContext } from "context/contatcsContext";
import { SendPaymentContext } from "context/sendPaymentContext";
import React, { useContext } from "react";
import Delete from "styles/svgs/Delete";

const ContactsItem = (props) => {
  const { contact, selectedContacts, handleCallback } = props;
  const {
    handleFavContact,
    handleOpenConfirmModal,
    favIconShow,
  } = useContext(ContactsContext);

  const {
    handleSendContacts,
  } = useContext(SendPaymentContext);

  return (
    <li>
      <div
        className={`${contact?.name ? "con-listing-info" : "invited-con-info"}`}
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
      </div>
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
                  handleFavContact(contact?.mobile, 1, "contactsItem")
                }
                className="star_border"
                alt=""
              />
            ) : (
              <img
                src="assets/images/star_fill.svg"
                className="star_fill"
                onClick={() =>
                  handleFavContact(contact?.mobile, 0, "contactsItem")
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
            <Delete />
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
