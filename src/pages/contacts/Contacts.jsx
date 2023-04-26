import React, { useEffect, useState, useContext } from "react";
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
import { LoaderContext } from "context/loaderContext";
import LoaderContact from "loaders/LoaderContact";

const Contacts = () => {
  const {
    handleRemoveConfirmModal,
    handleDeleteContact,
    contactName,
    confirmShow,
    setConfirmShow,
    setRemoveConfirmShow,
    removeConfirmShow,
    handleSelectedContacts,
    retrieveContacts,
    contacts,
    pagination,
    isLoadingContacts,
    isDisabled,
    handleChangeFilter,
    handleResetFilter,
    search,
  } = useContext(ContactsContext);
  const { setIsLoading } = useContext(LoaderContext);

  const [invitetitle, setInviteTitle] = useState("Invite");
  const [show, setShow] = useState(false);
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);
  const [showInvitationSentPopup, setInvitationSentPopup] = useState(false);
  const [showConatctDetailPopup, setConatctDetailPopup] = useState(false);
  const [contactData, setConatctData] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);

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

  useEffect(() => {
    (async () => {
      await retrieveContacts(1, "");
    })();
  }, []);

  const handleChange = async (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedContacts([...selectedContacts, value]);
    } else {
      setSelectedContacts(selectedContacts.filter((elm) => elm !== value));
    }
    handleSelectedContacts(selectedContacts);
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
              <form>
                <div className="form-field search-field">
                  <div
                    className="js-clearSearchBox clearsearchbox"
                    onClick={() => handleResetFilter("contactsItem")}
                  >
                    <IconCross />
                  </div>
                  <Input
                    type="search"
                    className="form-control js-searchBox-input"
                    name="search-field"
                    value={search}
                    onChange={(e) => handleChangeFilter(e, "contactsItem")}
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
                  disabled={isDisabled()}
                  className="btn"
                  type="button"
                  value="Remove Contact"
                  onClick={() => handleRemoveConfirmModal(selectedContacts)}
                >
                  <img src="assets/images/Remove_icon.svg" alt="" />
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
              {isLoadingContacts ? (
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
              ) : contacts && contacts?.length > 0 ? (
                contacts.map((contact, index) => (
                  <ContactsItem
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
          {pagination && pagination.total > 10 && (
            <Pagination
              siblingCount={1}
              active={pagination?.current_page}
              size={pagination?.last_page}
              onClickHandler={retrieveContacts}
            ></Pagination>
          )}
        </div>
      </div>
      <ModalAddContact
        id="add_contact"
        show={show}
        setShow={setShow}
        getConatcts={retrieveContacts}
        getInvitedConatcts={[]}
        page={pagination?.current_page}
        search={search}
        contactData={contactData}
        setConatctData={setConatctData}
        showInvitationSentPopup={showInvitationSentPopup}
        setInvitationSentPopup={setInvitationSentPopup}
        showConatctDetailPopup={showConatctDetailPopup}
        setConatctDetailPopup={setConatctDetailPopup}
        {...{ invitetitle }}
      />
      <ModalConfirmation
        heading={"Delete Contact"}
        subHeading={`Are you sure to remove ${contactName} ?`}
        show={confirmShow}
        setShow={setConfirmShow}
        handleCallback={handleDeleteContact}
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
        subHeading={"Are you sure to remove contacts?"}
        show={removeConfirmShow}
        setShow={setRemoveConfirmShow}
        handleCallback={handleDeleteContact}
      />
    </div>
  );
};

export default Contacts;
