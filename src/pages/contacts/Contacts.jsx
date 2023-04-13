import React, { useEffect, useState, useContext } from "react";
import Input from "components/ui/Input";
import { apiRequest } from "helpers/apiRequests";
import Modal from "components/modals/Modal";
import InviteContact from "./components/InviteContact";
import Pagination from "components/pagination/Pagination";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import CreateGroup from "./components/CreateGroup";
import ModalConfirmation from "components/modals/ModalConfirmation";
import InvitationSent from "./components/InvitationSent";
import ContactDetail from "./components/ContactDetail";
import Delete from "styles/svgs/Delete";
import { Link } from "react-router-dom";
import { SendPaymentContext } from "context/sendPaymentContext";

const Contacts = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const { handleSendContacts } = useContext(SendPaymentContext);

  const [contacts, setContacts] = useState([]);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [invitetitle, setInviteTitle] = useState("Invite");
  const [show, setShow] = useState(false);
  const [confirmShow, setConfirmShow] = useState(false);
  const [favIconShow, setfavIconShow] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = useState("");
  const [deleteContactArr, setDeleteContactArr] = useState([]);
  const [showCreateGroupPopup, setShowCreateGroupPopup] = useState(false);
  const [removeConfirmShow, setRemoveConfirmShow] = useState(false);
  const [showInvitationSentPopup, setInvitationSentPopup] = useState(false);
  const [showConatctDetailPopup, setConatctDetailPopup] = useState(false);
  const [contactData, setConatctData] = useState([]);
  const [contactName, setContactName] = useState("");

  const handlePopupInvite = (e) => {
    setShow(true);
    setInviteTitle(e.currentTarget.value);
  };

  const handleCreateGroup = async () => {
    setShowCreateGroupPopup(true);
  };

  const handleChangeFilter = (e) => {
    const val = e.target.value;
    setSearch(val);
    retrieveContacts(page, val);
  };

  const handleOpenConfirmModal = (idArr, name) => {
    setContactName(name);
    setDeleteContactArr(idArr);
    setConfirmShow(true);
  };

  const handleRemoveConfirmModal = (idArr) => {
    setDeleteContactArr(idArr);
    setRemoveConfirmShow(true);
  };

  const handleDeleteContact = async () => {
    setIsLoading(true);
    const accountNos = deleteContactArr;
    const selectedConts = contacts?.contacts?.filter((con) =>
      accountNos.includes(con.account_number)
    );
    const ids = selectedConts.map(({ country_code, mobile }) => ({
      country_code,
      mobile,
    }));
    try {
      const { data } = await apiRequest.deleteContact({ contacts: ids });
      data["status_code"] === 200 && retrieveContacts(page);
      data["status_code"] === 200 && setSelectedContacts([]);
      toast.success(data.message);
      setConfirmShow(false);
      setRemoveConfirmShow(false);
      setDeleteContactArr("");
      if (!data.success || data.data === null) throw data.message;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavContact = async (mobile, remove_flg) => {
    setIsLoading(true);
    const reqData = {
      mobile: mobile,
      mark_as_fav: remove_flg,
    };
    try {
      const { data } = await apiRequest.favContact(reqData);

      data["status_code"] === 200 && retrieveContacts(page);
      setfavIconShow(favIconShow);
      toast.success(data.message);

      if (!data.success || data.data === null) throw data.message;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    retrieveContacts();
  }, []);

  const retrieveContacts = async (currentPage = 1, search) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getConatcts({
        page: currentPage,
        search: search,
      });
      if (!data.success || data.data === null) throw data.message;
      setPage(currentPage);
      setContacts(data.data);
      setIsLoading(false);
    } catch (error) {
      if (error === "Contact not found") {
        setContacts(null);
      }
      console.log(error);
      setIsLoading(false);
    }
    //  finally {
    //   setIsLoading(false);
    // }
  };

  const handleChange = async (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedContacts([...selectedContacts, value]);
    } else {
      setSelectedContacts(selectedContacts.filter((elm) => elm !== value));
    }
  };

  function isDisabled() {
    const len = selectedContacts.filter((conatct) => conatct).length;
    return len === 0;
  }

  const handleResetFilter = () => {
    setSearch("");
    retrieveContacts();
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
                    onClick={handleResetFilter}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M13 1L0.999999 13"
                        stroke="#9B9B9B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M1 1L13 13"
                        stroke="#9B9B9B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </div>
                  <Input
                    type="search"
                    className="form-control js-searchBox-input"
                    name="search-field"
                    value={search}
                    onChange={handleChangeFilter}
                    placeholder="Search..."
                  />
                  <div className="search-btn">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.94288 13.4033C10.9586 13.4033 13.4033 10.9586 13.4033 7.94288C13.4033 4.92715 10.9586 2.48242 7.94288 2.48242C4.92715 2.48242 2.48242 4.92715 2.48242 7.94288C2.48242 10.9586 4.92715 13.4033 7.94288 13.4033Z"
                        stroke="#969696"
                        strokeWidth="0.975"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M11.8071 11.8066L15.0005 15"
                        stroke="#969696"
                        strokeWidth="0.975"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
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
                <Modal id="invite_contact" show={show} setShow={setShow}>
                  <InviteContact
                    getConatcts={retrieveContacts}
                    getInvitedConatcts={[]}
                    page={page}
                    search={search}
                    setShow={setShow}
                    contactData={contactData}
                    setConatctData={setConatctData}
                    showInvitationSentPopup={showInvitationSentPopup}
                    setInvitationSentPopup={setInvitationSentPopup}
                    showConatctDetailPopup={showConatctDetailPopup}
                    setConatctDetailPopup={setConatctDetailPopup}
                    {...{ invitetitle }}
                  />
                </Modal>
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
                  <Link to="/contacts/invited">
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
              {contacts?.contacts && contacts.contacts.length > 0 ? (
                contacts.contacts.map((contact, index) => (
                  <li key={index}>
                    <div
                      className={`${
                        contact?.name ? "con-listing-info" : "invited-con-info"
                      }`}
                    >
                      <div className="con-listing-check">
                        <input
                          id={contact.account_number}
                          type="checkbox"
                          onChange={handleChange}
                          checked={selectedContacts.includes(
                            contact.account_number
                          )}
                          value={contact.account_number}
                        />
                        <label htmlFor={contact.account_number}></label>
                      </div>
                      <div className="con-list-uimg">
                        <img
                          src={
                            contact.profile_image
                              ? contact.profile_image
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
                      className={`${
                        contact?.name ? "con-listing-mail" : "invited-con-mail"
                      }`}
                    >
                      <p>{contact?.email}</p>
                    </div>
                    <div className="cont-listing-last-wrap">
                      <div className="con-listing-edit-wrap">
                        <a className="conlist-edit-a con-list-edit-star">
                          {!favIconShow && contact.is_favourite === false ? (
                            <img
                              src="assets/images/Star.svg"
                              onClick={() =>
                                handleFavContact(contact.mobile, 1)
                              }
                              className="star_border"
                              alt=""
                            />
                          ) : (
                            <img
                              src="assets/images/star_fill.svg"
                              className="star_fill"
                              onClick={() =>
                                handleFavContact(contact.mobile, 0)
                              }
                              alt=""
                            />
                          )}
                        </a>
                        <button
                          onClick={() =>
                            handleOpenConfirmModal(
                              [contact.account_number],
                              contact.name ? contact.name : "this contact"
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
                ))
              ) : (
                <p className="text-center">Contacts Not Found.</p>
              )}
            </ul>
          </div>
          {contacts &&
            contacts.pagination &&
            contacts.pagination.total > 10 && (
              <Pagination
                active={page}
                size={contacts?.pagination?.last_page}
                siblingCount={1}
                onClickHandler={retrieveContacts}
              ></Pagination>
            )}
        </div>
      </div>
      <ModalConfirmation
        heading={"Delete Contact"}
        subHeading={`Are you sure to remove ${contactName} ?`}
        show={confirmShow}
        setShow={setConfirmShow}
        handleCallback={handleDeleteContact}
      />
      <Modal
        id="create-group-popup"
        show={showCreateGroupPopup}
        setShow={setShowCreateGroupPopup}
      >
        <CreateGroup values={selectedContacts} />
      </Modal>
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
