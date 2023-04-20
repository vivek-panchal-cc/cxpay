import { ContactsContext } from "context/contactsContext";
import React, { useContext } from "react";
import { IconDelete } from "styles/svgs";

const InviteContactItem = (props) => {
  const { contact, selectedContacts, handleCallback } = props;
  const { handleFavContact, handleOpenConfirmModal, favIconShow } =
    useContext(ContactsContext);

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
            {!favIconShow && contact?.is_favourite === false ? (
              <img
                src="../assets/images/Star.svg"
                onClick={() =>
                  handleFavContact(contact?.mobile,contact?.country_code, 1, "inviteContactsItem")
                }
                className="star_border"
                alt=""
              />
            ) : (
              <img
                src="../assets/images/star_fill.svg"
                className="star_fill"
                onClick={() =>
                  handleFavContact(contact?.mobile,contact?.country_code, 0, "inviteContactsItem")
                }
                alt=""
              />
            )}
          </a>
          <button
            onClick={() =>
              handleOpenConfirmModal(
                [contact?.mobile],
                contact?.name ? contact?.name : "this contact",
                "inviteContactsItem"
              )
            }
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
