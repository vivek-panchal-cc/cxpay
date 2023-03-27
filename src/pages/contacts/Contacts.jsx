import React, { useEffect, useState, useContext } from "react";
import { apiRequest } from "helpers/apiRequests";
import Modal from "components/modals/Modal";
import InviteContact from "./components/InviteContact";
import Pagination from "components/pagination/Pagination";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import CreateGroup from './components/CreateGroup';
import ModalConfirmation from "components/modals/ModalConfirmation";
import { useNavigate } from "react-router-dom";

const Contacts = (props) => {
  
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
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
  

  const handleCreateGroup = async () => {
    setShowCreateGroupPopup(true);
  }

  const handlePopupInvite = (e) => {
    setShow(true);
    setInviteTitle(e.currentTarget.value);
  };

  const handleChangeFilter = (e) => {
    const val = e.target.value;
    setSearch(val);
    retrieveContacts(page, val);
  };

  const handleOpenConfirmModal = (idArr) => {
    setDeleteContactArr(idArr);
    console.log(deleteContactArr);
    setConfirmShow(true);
  };

  const handleDeleteContact = async () => {
    setIsLoading(true);
    const id = deleteContactArr;
    try {
      const { data } = await apiRequest.deleteContact({ mobile: id });
      data["status_code"] === 200 && retrieveContacts(page);
      data["status_code"] === 200 && setSelectedContacts([]);
      toast.success(data.message);
      setConfirmShow(false);
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
    try {
      const { data } = await apiRequest.getConatcts({
        page: currentPage,
        search: search,
      });

      if (!data.success || data.data === null) throw data.message;
      setPage(currentPage);
      setContacts(data.data);
    } catch (error) {
      if (error === "Contact not found") {
        setContacts(null);
      }
      console.log(error);
    }
  };

  const handleChange = async (e) => {
    const { checked, value } = e.target;
    if (checked) {
      setSelectedContacts([...selectedContacts, value]);
    } else {
      setSelectedContacts(selectedContacts.filter((elm) => elm !== value));
    }
  };

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
                  <input
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
                {/* <div className="form-field search-field">
                  <div className="js-clearSearchBox clearsearchbox">
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
                      />
                      <path
                        d="M1 1L13 13"
                        stroke="#9B9B9B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div> */}
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
                  className="btn"
                  type="button"
                  value="Remove Contact"
                  onClick={() => handleOpenConfirmModal(selectedContacts)}
                >
                  <img src="assets/images/Remove_icon.svg" alt="" />
                  <span>Remove Contact</span>
                </button>
              </div>
              <div className="con-btn-wrap con-invite-btn-wrap">
                <Modal id="invite_contact" show={show} setShow={setShow}>
                  <InviteContact
                    getConatcts={retrieveContacts}
                    page={page}
                    search={search}
                    setShow={setShow}
                    {...{ invitetitle }}
                  />
                </Modal>
                <button
                  className="btn"
                  type="button"
                  value={"Invite Contact"}
                  onClick={handlePopupInvite}
                >
                  <img src="assets/images/Invite_icon.svg" alt="" />
                  <span>Invite Contact</span>
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
                  <li key={contact.mobile}>
                    <div className="con-listing-info">
                      <div className="con-listing-check">
                        <input
                          id={contact.mobile}
                          type="checkbox"
                          onChange={handleChange}
                          checked={selectedContacts.includes(contact.mobile)}
                          value={contact.mobile}
                        />
                        <label htmlFor={contact.mobile}></label>
                      </div>
                      <div className="con-list-uimg">
                        <img
                          src={
                            contact.profile_image
                              ? contact.profile_image
                              : "assets/images/user-avatar.png"
                          }
                          alt=""
                        />
                      </div>
                      <div className="con-list-uname">
                        {contact?.name ? contact?.name : "Invited"}
                      </div>
                    </div>
                    <div className="con-listing-phone">
                      <p>{contact?.mobile}</p>
                    </div>
                    <div className="con-listing-mail">
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
                            handleOpenConfirmModal([contact.mobile])
                          }
                          className="conlist-del-a con-list-up"
                        >
                          <svg
                            width="16"
                            height="18"
                            viewBox="0 0 16 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M1 4.11133H2.55556H15"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                            <path
                              d="M13.4446 4.11111V15C13.4446 15.4126 13.2807 15.8082 12.9889 16.0999C12.6972 16.3917 12.3016 16.5556 11.889 16.5556H4.11122C3.69866 16.5556 3.303 16.3917 3.01128 16.0999C2.71955 15.8082 2.55566 15.4126 2.55566 15V4.11111M4.889 4.11111V2.55556C4.889 2.143 5.05289 1.74733 5.34461 1.45561C5.63633 1.16389 6.03199 1 6.44455 1H9.55566C9.96822 1 10.3639 1.16389 10.6556 1.45561C10.9473 1.74733 11.1112 2.143 11.1112 2.55556V4.11111"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </button>
                      </div>
                      <div className="con-listing-btn-wrap">
                        <a href="/" className="btn btn-primary con-send-btn">
                          Send
                        </a>
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
          {contacts && contacts && (
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
        subHeading={"Are you sure want to delete - Contact Name?"}
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
    </div>
  );
};

export default Contacts;
