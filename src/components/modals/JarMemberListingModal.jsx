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

function JarMemberListingModal(props) {
  const {
    id,
    className,
    classNameChild,
    show,
    setShow,
    handleCallback,
    jarId,
    selectedItem,
    selectedFullItem,
    selectedMembers,
  } = props;
  const modalRef = useRef(null);
  useContext(LoaderContext);
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
    if (selectedFullContactArray.length === 0) {
      toast.warning("Please select atleast one contact");
      return false;
    }
    selectedFullItem([...selectedFullContactArray]);
    selectedItem([...selectedRemainingContact]);
    handleCallback(false);
  };

  const handleChange = (e) => {
    const checked = e.target.checked;
    const value = e.target.value;
    let updatedSelectedContacts = [...selectedRemainingContact];

    if (checked) {
      updatedSelectedContacts.push(value);
    } else {
      updatedSelectedContacts = updatedSelectedContacts.filter(
        (item) => item !== value
      );
    }

    const fullSelectedContacts = remainingContactListing.filter((item) =>
      updatedSelectedContacts.includes(item.account_number)
    );

    setSelectedRemainingContact(updatedSelectedContacts);
    setSelectedFullContactArray(fullSelectedContacts);
  };

  const onScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom && currentListPage * 10 < listingTotalData) {
      setCurrentListPage((prev) => prev + 1);
      retriveRemainingContact(currentListPage + 1, searchContactName);
    }
  };

  const retriveRemainingContact = async (page, searchText) => {
    let error = null;
    try {
      setLoadingContacts(true);
      const { data } = await apiRequest.getRemainingContacts({
        jar_id: jarId || null,
        page: page,
        search: searchText,
      });
      if (!data.success) throw data.message;

      setListingTotalData(data.data.pagination.total);

      setRemainingContactListing((prevContacts) => {
        if (page === 1) {
          return data.data.remain_contacts; // Reset list on new search
        }

        // Merge new contacts while preventing duplicates
        const newContacts = data.data.remain_contacts.filter(
          (newItem) =>
            !prevContacts.some(
              (prevItem) => prevItem.account_number === newItem.account_number
            )
        );

        return [...prevContacts, ...newContacts];
      });
    } catch (err) {
      error = err;
      if (error?.code === "ERR_CANCELED") {
        setLoadingContacts(true);
        return;
      }
    } finally {
      if (error?.code !== "ERR_CANCELED") {
        setLoadingContacts(false);
      }
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

  useEffect(() => {
    if (selectedMembers) {
      // Keep only the selected members that are still in jarMembers
      const updatedSelectedContacts = selectedRemainingContact.filter((item) =>
        selectedMembers.some((member) => member.account_number === item)
      );

      const updatedFullContacts = remainingContactListing.filter((item) =>
        updatedSelectedContacts.includes(item.account_number)
      );

      setSelectedRemainingContact(updatedSelectedContacts);
      setSelectedFullContactArray(updatedFullContacts);
    }
  }, [selectedMembers, remainingContactListing]);

  const disabledCheckedBox = (ele) => {
    if (profile.admin_approved) {
      return !ele.admin_approved || !ele.kyc_approved;
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
              <h1 className="text-center mb-4">Add Members</h1>
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
                        <div
                          className={`cm-listing-check ${
                            disabledCheckedBox(ele) ||
                            show_renew_section === "disable_fund_action" ||
                            show_renew_section ===
                              "renew_limit_exceed_and_disable"
                              ? "cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <input
                            id={ele.account_number}
                            type="checkbox"
                            value={ele.account_number}
                            onChange={handleChange}
                            checked={selectedRemainingContact.includes(
                              ele.account_number
                            )}
                            disabled={
                              disabledCheckedBox(ele) ||
                              show_renew_section === "disable_fund_action" ||
                              show_renew_section ===
                                "renew_limit_exceed_and_disable"
                            }
                          />
                          <label htmlFor={ele.account_number}>
                            {ele.member_name}
                          </label>
                        </div>
                      </div>
                    </li>
                  ))}
                  {loadingContacts
                    ? [1, 2, 3, 4, 5, 6]?.map((item) => (
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

export default JarMemberListingModal;
