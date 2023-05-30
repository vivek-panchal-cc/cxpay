import React, { useState, useContext } from "react";
import Input from "components/ui/Input";
import Pagination from "components/pagination/Pagination";
import { toast } from "react-toastify";
import ModalConfirmation from "components/modals/ModalConfirmation";
import ContactDetail from "./components/ContactDetail";
import { Link } from "react-router-dom";
import { MAX_GROUP_MEMBERS } from "constants/all";
import ModalCreateGroup from "components/modals/ModalCreateGroup";
import ModalAddContact from "components/modals/ModalAddContact";
import { ContactsContext } from "context/contactsContext";
import ContactsItem from "components/items/ContactsItem";
import { IconCross, IconSearch } from "styles/svgs";
import LoaderContact from "loaders/LoaderContact";
import { uniqueId } from "helpers/commonHelpers";
import useContacts from "hooks/useContacts";

const Contacts = () => {
  const {
    deleteContact,
    changeFavouriteContact,
    contactName,
    handleSelectedContacts,
    isDisabled,
  } = useContext(ContactsContext);
  const [invitetitle, setInviteTitle] = useState("Invite");
  const [show, setShow] = useState(false);
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);
  const [showInvitationSentPopup, setInvitationSentPopup] = useState(false);
  const [showConatctDetailPopup, setConatctDetailPopup] = useState(false);
  const [contactData, setConatctData] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

  const [showConfirmDelSingle, setShowConfirmDelSingle] = useState(false);
  const [showConfirmDelSelected, setShowConfirmDelSelected] = useState(false);

  // Contacts and it's pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [
    isLoadingConts,
    paginationConts,
    contacts,
    setContacts,
    reloadContacts,
  ] = useContacts({
    page: currentPage,
    search: search,
  });

  const handleSearchContact = (elm) => {
    setCurrentPage(1);
    setSearch(elm.target.value);
  };

  const handlePopupInvite = (e) => {
    setShow(true);
    setInviteTitle(e.currentTarget.value);
  };

  const handleCreateGroup = async () => {
    if (selectedContacts.length > MAX_GROUP_MEMBERS) {
      toast.error(`You have exceed the contact limit.`);
      return;
    }
    setShowCreateGroupPopup(true);
  };

  const handleChange = async (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedContacts([...selectedContacts, value]);
    } else {
      setSelectedContacts(selectedContacts.filter((elm) => elm !== value));
    }
    handleSelectedContacts(selectedContacts);
  };

  const handleFavContact = (contact) => {
    if (!contact) return;
    changeFavouriteContact(contact, contacts, setContacts);
  };

  const handleConfirmDeleteSingle = (contUniqId) => {
    if (!contUniqId) return;
    setSelectedContacts([contUniqId]);
    setShowConfirmDelSingle(true);
  };

  const handleConfirmDeleteSelected = () => {
    if (selectedContacts.length <= 0) return;
    setShowConfirmDelSelected(true);
    setShowConfirmDelSelected(true);
  };

  const handleDeleteContact = async () => {
    await deleteContact(selectedContacts, contacts);
    setSelectedContacts([]);
    setShowConfirmDelSingle(false);
    setShowConfirmDelSelected(false);
    reloadContacts();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="contact-sec">
          <div className="contact-top-sec">
            <div className="title-content-wrap">
              <h3>Contacts</h3>
            </div>
          </div>
          <div className="contact-top-search-sec d-flex align-items-center">
            <div className="contact-serch-main">
                <div className="form-field search-field">
                  <div
                    className="clearsearchbox"
                    style={{ opacity: search ? 1 : 0 }}
                    onClick={() => setSearch("")}
                  >
                    <IconCross />
                  </div>
                  <Input
                    type="search"
                    className="form-control js-searchBox-input"
                    name="search-field"
                    value={search}
                    onChange={handleSearchContact}
                    placeholder="Search..."
                  />
                  <div className="search-btn">
                    <IconSearch />
                  </div>
                </div>
            </div>
            <div className="contact-top-btn-nav">
              <div className="con-btn-wrap con-add-btn-wrap">
                <button
                  type="button"
                  className="btn"
                  value="Add Contact"
                  onClick={handlePopupInvite}
                >
                  <img src="assets/images/Add_icon.svg" alt="" />
                  <span>Add Contact</span>
                </button>
              </div>
              <div className="con-btn-wrap con-remove-btn-wrap">
                <button
                  disabled={isDisabled && isDisabled()}
                  className="btn"
                  type="button"
                  value="Remove Contact"
                  onClick={handleConfirmDeleteSelected}
                >
                  <img src="/assets/images/Remove_icon.svg" alt="" />
                  <span>Remove Contact</span>
                </button>
              </div>
              <div className="con-btn-wrap con-invite-btn-wrap">
                <ContactDetail
                  id="contact_detail"
                  data={contactData}
                  show={showConatctDetailPopup}
                  setShow={setConatctDetailPopup}
                  handleClose={setConatctDetailPopup}
                />
                <button
                  className="btn"
                  type="button"
                  value={"Invited Contacts"}
                >
                  <Link to="/contacts-invited">
                    <img
                      src="assets/images/invite_group-ic.svg"
                      alt=""
                      className="invited-contacts-img"
                    />
                    <span>Invited Contacts</span>
                  </Link>
                </button>
              </div>
              <div className="con-btn-wrap con-add-btn-wrap">
                <button
                  type="button"
                  className="btn"
                  value="Create Group"
                  onClick={handleCreateGroup}
                  disabled={selectedContacts.length < 2}
                >
                  <img src="assets/images/Add_icon.svg" alt="" />
                  <span>Create Group</span>
                </button>
              </div>
            </div>
          </div>
          <div className="con-listing-container">
            <ul className="contact-listing-wrap">
              {isLoadingConts ? (
                <div className="d-flex flex-column gap-3 mt-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                    <LoaderContact
                      key={item}
                      style={{
                        background: item % 2 === 0 ? "#f6f6f670" : "#fafafa70",
                        fill: "#000000",
                      }}
                    />
                  ))}
                </div>
              ) : (
                contacts?.map((contact) => (
                  <ContactsItem
                    key={uniqueId()}
                    contact={contact}
                    handleCallback={handleChange}
                    handleFavContact={handleFavContact}
                    handleDeleteContact={handleConfirmDeleteSingle}
                    selectedContacts={selectedContacts}
                  />
                ))
              )}
              {contacts.length <= 0 && (
                <p className="text-center">Contacts Not Found.</p>
              )}
            </ul>
          </div>
          {!isLoadingConts && paginationConts && paginationConts.total > 10 && (
            <Pagination
              siblingCount={1}
              active={paginationConts?.current_page}
              size={paginationConts?.last_page}
              onClickHandler={setCurrentPage}
            ></Pagination>
          )}
        </div>
      </div>
      <ModalAddContact
        id="add_contact"
        show={show}
        setShow={setShow}
        getConatcts={reloadContacts}
        getInvitedConatcts={reloadContacts}
        setConatctData={setConatctData}
        setInvitationSentPopup={setInvitationSentPopup}
        setConatctDetailPopup={setConatctDetailPopup}
        {...{ invitetitle }}
      />
      <ModalCreateGroup
        id="create-group-popup"
        show={showCreateGroupPopup}
        setShow={setShowCreateGroupPopup}
        selectedContacts={selectedContacts}
        setSelectedContacts={setSelectedContacts}
      />
      <ModalConfirmation
        heading={"Delete Contact"}
        subHeading={`Are you sure to remove ${contactName} ?`}
        show={showConfirmDelSingle}
        setShow={setShowConfirmDelSingle}
        handleCallback={handleDeleteContact}
      />
      <ModalConfirmation
        heading={"Delete Contact"}
        subHeading={"Are you sure to remove contacts?"}
        show={showConfirmDelSelected}
        setShow={setShowConfirmDelSelected}
        handleCallback={handleDeleteContact}
      />
    </div>
  );
};

export default Contacts;
