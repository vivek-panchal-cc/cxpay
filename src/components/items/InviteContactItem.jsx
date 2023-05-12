import { ContactsContext } from "context/contactsContext";
import React, { useContext } from "react";
import { IconBackgroundStar, IconDelete } from "styles/svgs";

const InviteContactItem = (props) => {
  const {
    contact,
    selectedContacts,
    handleCallback,
    handleFavContact,
    handleDeleteContact,
  } = props;

  return (
    <li>
      <div
        className={`${contact?.name ? "con-listing-info" : "invited-con-info"}`}
      >
        <div className="con-listing-check">
          <input
            id={contact?.mobile}
            type="checkbox"
            onChange={handleCallback}
            checked={selectedContacts.includes(contact?.mobile)}
            value={contact?.mobile}
          />
          <label htmlFor={contact?.mobile}></label>
        </div>
        <div className="con-list-uimg">
          <img
            src={
              contact?.profile_image
                ? contact?.profile_image
                : "../assets/images/user-avatar.png"
            }
            alt=""
          />
        </div>
        {contact?.name ? (
          <div className="con-list-uname">{contact?.name}</div>
        ) : (
          ""
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
            <IconBackgroundStar
              fillBack={contact?.is_favourite ? "#F9DB3E" : "#F3F3F3"}
              fillStar={contact?.is_favourite ? "#fff" : ""}
              onClick={() => handleFavContact(contact)}
            />
          </a>
          <button
            onClick={() => handleDeleteContact(contact?.mobile)}
            className="conlist-del-a con-list-up"
          >
            <IconDelete />
          </button>
        </div>
      </div>
    </li>
  );
};

export default InviteContactItem;
