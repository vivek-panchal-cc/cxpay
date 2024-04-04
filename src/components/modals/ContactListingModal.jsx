import Input from "components/ui/Input";
import React, { useContext, useState, useEffect, useRef, useMemo } from "react";
import { IconCross, IconSearch } from "styles/svgs";
import styles from "./modal.module.scss";
import "./contactList.css";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import LoaderAddGroupContact from "loaders/LoaderAddGroupContact";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

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
    selectedFullItem,
    alldata,
  } = props;
  const modalRef = useRef(null);
  const { setIsLoading } = useContext(LoaderContext);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [remainingContactListing, setRemainingContactListing] = useState([]);
  const [selectedRemainingContact, setSelectedRemainingContact] = useState([]);
  const [selectedFullContactArray, setSelectedFullContactArray] = useState([]);
  const [searchContactName, setSearchContactName] = useState("");
  const [currentListPage, setCurrentListPage] = useState(1);
  const [listingTotalData, setListingTotalData] = useState(0);
  const { profile } = useSelector((state) => state?.userProfile);
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const getCurrentData = useMemo(() => {
    const tmp = alldata.filter((item) =>
      selectedRemainingContact.includes(item.account_number)
    );
    return tmp.map((item) => item.member_mobile_number);
  }, [alldata, selectedRemainingContact]);

  const searchContactData = (e) => {
    setSearchContactName(e.target.value);
    retriveRemainingContact(1, e.target.value);
    setCurrentListPage(1);
  };

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
      if (difference.length === 0) {
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
    const value = e.target.value;
    let selectedArray = [];
    if (checked) {
      selectedArray = [...selectedRemainingContact, value];
    } else {
      selectedArray = selectedRemainingContact.filter((elm) => elm !== value);
    }
    const fullArray = remainingContactListing.filter((item) =>
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
      setLoadingContacts(true);
      const { data } = await apiRequest.getRemainingGroupContact({
        group_id: groupId,
        page: page,
        search: searchText,
      });
      if (!data.success) throw data.message;
      setListingTotalData(data.data.pagination.total);
      let filterData = [];
      data.data.remain_contacts.forEach((item) => {
        let findElement = 0;
        alldata.forEach((elm) => {
          if (item.member_email === elm.member_email) {
            findElement = 1;
          }
        });
        if (findElement === 0) {
          filterData.push(item);
        }
      });
      if (page === 1) {
        setRemainingContactListing(filterData);
      } else {
        const allData2 = remainingContactListing.concat(filterData);
        setRemainingContactListing(allData2);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingContacts(false);
    }
  };

  useEffect(() => {
    if (show) retriveRemainingContact(currentListPage, searchContactName);
    function handleclickOutside(event) {
      if (!modalRef.current) return;
      const childDialog = modalRef.current?.children[0];
      if (childDialog && !childDialog.contains(event.target))
        if (setShow) setShow(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [modalRef, setShow, show]);

  const disabledCheckedBox = (ele) => {
    if (profile.admin_approved) {      
      return !ele.admin_approved;
    } else {
      return true;
    }
  };

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
              <div className="con-md-search-wrap gap-3 justify-content-center">
                <div className="form-field search-field ms-0">
                  <div
                    className="clearsearchbox"
                    onClick={handleResetContactData}
                    style={{ opacity: searchContactName ? 1 : 0 }}
                  >
                    <IconCross />
                  </div>
                  <Input
                    type="search"
                    className="form-control js-searchBox-input"
                    name="search-field"
                    placeholder="Search..."
                    value={searchContactName}
                    onChange={searchContactData}
                  />
                  <div className="search-btn">
                    <IconSearch style={{ stroke: "#0081c5" }} />
                  </div>
                </div>
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
                  {remainingContactListing?.map((ele) => (
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
                            disabled={disabledCheckedBox(ele) || show_renew_section === "disable_fund_action"}
                          />
                          <label htmlFor={ele.account_number}>
                            {ele.member_name}
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
                  {loadingContacts
                    ? [1, 2, 3, 4, 5, 6].map((item) => (
                        <LoaderAddGroupContact key={item} itemType={"bank"} />
                      ))
                    : null}
                </ul>
                {!loadingContacts && remainingContactListing.length <= 0 ? (
                  <p className="text-center">No contacts found.</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactListingModal;
