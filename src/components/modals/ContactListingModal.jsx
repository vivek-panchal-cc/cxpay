import Input from "components/ui/Input";
import React, { useContext, useState, useEffect, useRef } from "react";
import { IconSearch } from "styles/svgs";
import styles from "./modal.module.scss";
import "./contactList.css";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";

function ContactListingModal(props) {
  const {
    id,
    className,
    classNameChild,
    show,
    setShow,
    handleCallback,
    groupId,
    selectedItem,
    getItem,
    selectedFullItem,
    alldata,
  } = props;
  const modalRef = useRef(null);
  const [remainingContactListing, setRemainingContactListing] = useState([]);
  const [selectedRemainingContact, setSelectedRemainingContact] = useState([]);
  const [selectedFullContactArray, setSelectedFullContactArray] = useState([]);
  const [searchContactName, setSearchContactName] = useState("");
  const [currentListPage, setCurrentListPage] = useState(1);
  const [listingTotalData, setListingTotalData] = useState(0);
  var getCurrentData = alldata.filter((item) =>
    selectedRemainingContact.includes(item.account_number)
  );
  getCurrentData = getCurrentData.map((item) => item.member_mobile_number);
  const searchContactData = (e) => {
    setSearchContactName(e.target.value);
    retriveRemainingContact(1, e.target.value);
    setCurrentListPage(1);
  };
  const { setIsLoading } = useContext(LoaderContext);

  const handleResetContactData = () => {
    setSearchContactName("");
    setCurrentListPage(1);
    retriveRemainingContact(1, "");
  };

  const submitContactData = () => {
    if (remainingContactListing.length > 0) {
      let difference = selectedRemainingContact.filter(
        (x) => !getCurrentData.includes(x)
      );
      let selectedFullArrayDifference = selectedFullContactArray.filter(
        (item) => difference.includes(item.account_number)
      );
      if (difference.length == 0) {
        toast.warning("Please select atleast one contact");
        return false;
      }
      selectedFullItem(selectedFullArrayDifference);
      selectedItem(selectedRemainingContact);
      handleCallback(false);
    }
  };

  const handleChange = async (e) => {
    const checked = e.target.checked;
    var value = e.target.value;
    let selectedArray = [];
    if (checked) {
      selectedArray = [...selectedRemainingContact, value];
    } else {
      selectedArray = selectedRemainingContact.filter((elm) => elm !== value);
    }
    var fullArray = remainingContactListing.filter((item) =>
      selectedArray.includes(item.account_number)
    );
    setSelectedRemainingContact(selectedArray);
    setSelectedFullContactArray(fullArray);
  };
  const onScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      if (currentListPage * 10 < listingTotalData) {
        setCurrentListPage(currentListPage + 1);
        retriveRemainingContact(currentListPage + 1, searchContactName);
      }
    }
  };
  const retriveRemainingContact = async (page, searchText) => {
    try {
      setIsLoading(true);
      const { data } = await apiRequest.getRemainingGroupContact({
        group_id: groupId,
        page: page,
        search: searchText,
      });
      if (!data.success) throw data.message;
      setListingTotalData(data.data.pagination.total);
      let filterData = [];
      data.data.remain_contacts.forEach((item) => {
        var findElement = 0;
        alldata.forEach((elm) => {
          if (item.member_email == elm.member_email) {
            findElement = 1;
          }
        });
        if (findElement == 0) {
          filterData.push(item);
        }
      });
      if (page == 1) {
        setRemainingContactListing(filterData);
      } else {
        var allData2 = remainingContactListing.concat(filterData);
        setRemainingContactListing(allData2);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) retriveRemainingContact(currentListPage, searchContactName);
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        setShow && setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow, show]);

  if (!show) return null;
  return (
    <div
      className={`modal fade show ${styles.modal} ${className}`}
      id={id}
      role="dialog"
    >
      <div ref={modalRef} className={classNameChild}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h1 className="text-center mb-4">Add Contacts</h1>
              <div className="con-md-search-wrap">
                <form name="sdsa">
                  <div className="form-field search-field">
                    <div
                      className="js-clearSearchBox clearsearchbox"
                      onClick={handleResetContactData}
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
                      placeholder="Search..."
                      onChange={searchContactData}
                    />
                    <div className="search-btn">
                      <IconSearch />
                    </div>
                  </div>
                </form>
                <div className="con-md-del-wrap">
                  <a
                    className="btn btn-primary con-md-delbtn"
                    onClick={submitContactData}
                  >
                    Add
                  </a>
                </div>
              </div>
              <div className="cml-container">
                <ul onScroll={onScroll}>
                  {remainingContactListing.length > 0
                    ? remainingContactListing.map((ele) => (
                        <li key={"li-" + ele.account_number}>
                          <div className="modal-contact-list-wrap">
                            <div className="cm-listing-check">
                              <input
                                id={ele.account_number}
                                type="checkbox"
                                value={ele.account_number}
                                onChange={handleChange}
                                checked={selectedRemainingContact.includes(
                                  ele.account_number
                                )}
                              />
                              <label htmlFor={ele.account_number}>
                                {ele.member_name}
                              </label>
                            </div>
                          </div>
                        </li>
                      ))
                    : "No contacts found"}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactListingModal;
