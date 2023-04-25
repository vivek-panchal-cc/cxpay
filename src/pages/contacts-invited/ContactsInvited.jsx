import React, { useEffect, useState, useContext } from "react";
import Input from "components/ui/Input";
import Pagination from "components/pagination/Pagination";
import ModalConfirmation from "components/modals/ModalConfirmation";
import InvitationSent from "../contacts/components/InvitationSent";
import ContactDetail from "../contacts/components/ContactDetail";
import { Link } from "react-router-dom";
import ModalAddContact from "components/modals/ModalAddContact";
import InviteContactItem from "components/items/InviteContactItem";
import { ContactsContext } from "context/contactsContext";
import { IconCross, IconSearch } from "styles/svgs";

const Invited = () => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [invitetitle, setInviteTitle] = useState("Invite");
  const [show, setShow] = useState(false);
  const [page, setPage] = React.useState(1);
  const [removeConfirmShow, setRemoveConfirmShow] = useState(false);
  const [showInvitationSentPopup, setInvitationSentPopup] = useState(false);
  const [showConatctDetailPopup, setConatctDetailPopup] = useState(false);
  const [contactData, setConatctData] = useState([]);

  const {
    handleRemoveConfirmModal,
    handleDeleteContact,
    confirmShow,
    setConfirmShow,
    contactName,
    handleInvitedContacts,
    contactsInvited,
    isDisabled,
    handleChangeFilter,
    handleResetFilter,
    search,
  } = useContext(ContactsContext);

  const handleChange = async (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedContacts([...selectedContacts, value]);
    } else {
      setSelectedContacts(selectedContacts.filter((elm) => elm !== value));
    }
  };

  const handlePopupInvite = (e) => {
    setShow(true);
    setInviteTitle(e.currentTarget.value);
  };

  useEffect(() => {
    (async () => {
      await handleInvitedContacts();
    })();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="contact-sec">
          <div className="contact-top-sec">
            <div className="title-content-wrap">
              <h3>Invited Contacts</h3>
            </div>
          </div>
        </div>
        <div className="contact-top-search-sec d-flex align-items-center">
          <div className="contact-serch-main">
            <form>
              <div className="form-field search-field">
                <div
                  className="js-clearSearchBox clearsearchbox"
                  onClick={() => handleResetFilter("inviteContactsItem")}
                >
                  <IconCross />
                </div>
                <Input
                  type="search"
                  className="form-control js-searchBox-input"
                  name="search-field"
                  value={search}
                  onChange={(e) => handleChangeFilter(e, "inviteContactsItem")}
                  placeholder="Search..."
                />
                <div className="search-btn">
                  <IconSearch />
                </div>
              </div>
            </form>
          </div>
          <div className="contact-top-btn-nav">
            <div className="con-btn-wrap con-add-btn-wrap">
              <button
                className="btn"
                value="Add Contact"
                onClick={handlePopupInvite}
              >
                <img src="../assets/images/Add_icon.svg" alt="" />
                <span>Add Contact</span>
              </button>
            </div>
            <div className="con-btn-wrap con-remove-btn-wrap">
              <button
                disabled={isDisabled()}
                className="btn"
                type="button"
                value="Remove Contact"
                onClick={() => handleRemoveConfirmModal(selectedContacts)}
              >
                <img src="../assets/images/Remove_icon.svg" alt="" />
                <span>Remove Contact</span>
              </button>
            </div>
            <div className="con-btn-wrap con-invite-btn-wrap">
              <ModalAddContact
                id="invite_contact"
                show={show}
                setShow={setShow}
                getConatcts={[]}
                getInvitedConatcts={handleInvitedContacts}
                page={page}
                search={search}
                contactData={contactData}
                setConatctData={setConatctData}
                showInvitationSentPopup={showInvitationSentPopup}
                setInvitationSentPopup={setInvitationSentPopup}
                showConatctDetailPopup={showConatctDetailPopup}
                setConatctDetailPopup={setConatctDetailPopup}
                isInvitedFlag={true}
                {...{ invitetitle }}
              />
              <InvitationSent
                id="invitation_sent"
                show={showInvitationSentPopup}
                setShow={setInvitationSentPopup}
                handleClose={setInvitationSentPopup}
              />
              <ContactDetail
                id="contact_detail"
                data={contactData}
                show={showConatctDetailPopup}
                setShow={setConatctDetailPopup}
                handleClose={setConatctDetailPopup}
              />
              <button className="btn" type="button" value={"Contacts"}>
                <Link to="/contacts">
                  <img src="../assets/images/invite_group-ic.svg" alt="" />
                  <span>Contacts</span>
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div className="con-listing-container">
          <ul className="contact-listing-wrap">
            {contactsInvited?.contacts &&
            contactsInvited.contacts.length > 0 ? (
              contactsInvited.contacts.map((contact, index) => (
                <InviteContactItem
                  key={index}
                  contact={contact}
                  handleCallback={handleChange}
                  selectedContacts={selectedContacts}
                />
              ))
            ) : (
              <p className="text-center">Contacts Not Found.</p>
            )}
          </ul>
        </div>
        {contactsInvited &&
          contactsInvited.pagination &&
          contactsInvited.pagination.total > 10 && (
            <Pagination
              active={page}
              size={contactsInvited?.pagination?.last_page}
              siblingCount={1}
              onClickHandler={handleInvitedContacts}
            ></Pagination>
          )}
      </div>
      <ModalConfirmation
        heading={"Delete Contact"}
        subHeading={`Are you sure to remove ${contactName} ?`}
        show={confirmShow}
        setShow={setConfirmShow}
        handleCallback={handleDeleteContact}
      />
      <ModalConfirmation
        heading={"Delete Contact"}
        subHeading={"Are you sure to remove contacts?"}
        show={removeConfirmShow}
        setShow={setRemoveConfirmShow}
        handleCallback={handleDeleteContact}
      />
    </div>
  );
};
export default Invited;
