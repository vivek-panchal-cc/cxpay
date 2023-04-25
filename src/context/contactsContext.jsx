import { apiRequest } from "helpers/apiRequests";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { LoaderContext } from "./loaderContext";
import { useNavigate } from "react-router";

export const ContactsContext = React.createContext({});

const ContactsProvider = ({ children }) => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [favIconShow, setfavIconShow] = useState(false);
  // Added Contacts and it's pagination
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  // Invited Contacts
  const [contactsInvited, setContactsInvited] = useState([]);
  const [search, setSearch] = useState("");
  const [contactsType, setContactsType] = useState([]);
  const [contactName, setContactName] = useState("");
  const [deleteContactArr, setDeleteContactArr] = useState([]);
  const [confirmShow, setConfirmShow] = useState(false);
  const [contactsOrInvited, setContactsOrInvited] = useState("");
  const [removeConfirmShow, setRemoveConfirmShow] = useState(false);
  const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);

  //For add contacts to favourite list
  const handleFavContact = async (mobile, country_code, remove_flg, type) => {
    setIsLoading(true);

    let reqData = {
      country_code: country_code,
      mobile: mobile,
      mark_as_fav: remove_flg,
    };

    try {
      const { data } = await apiRequest.markAsFavourite(reqData);
      if (!data.success) throw data.message;
      if (type == "contactsItem") {
        contacts?.contacts?.filter((con) => {
          if (con.mobile == mobile && con.country_code == country_code) {
            return (con.is_favourite = con.is_favourite ? false : true);
          }
        });
        setContacts(contacts);
      } else {
        contactsInvited?.contacts?.filter((con) => {
          if (con.mobile == mobile && con.country_code == country_code) {
            return (con.is_favourite = con.is_favourite ? false : true);
          }
        });
        setContactsInvited(contactsInvited);
      }
      setfavIconShow(favIconShow);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // For getting contacts list
  const retrieveContacts = async (page = 1, search = "") => {
    setIsLoadingContacts(true);
    try {
      const { data } = await apiRequest.contactsList({ page, search });
      if (!data.success) throw data.message;
      const { contacts = [], pagination } = data.data || {};
      setPagination(pagination);
      setContacts(contacts);
    } catch (error) {
      if (typeof error === "string") setContacts(null);
      console.log(error);
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // For open confirm popup
  const handleOpenConfirmModal = (idArr, name, type) => {
    setContactName(name);
    setDeleteContactArr(idArr);
    setConfirmShow(true);
    setContactsType(type);
  };

  // For remove confirm popup
  const handleRemoveConfirmModal = (idArr) => {
    setDeleteContactArr(idArr);
    setRemoveConfirmShow(true);
  };

  // For delete contacts from the list
  const handleDeleteContact = async () => {
    setIsLoading(true);
    try {
      let selectedConts = [];
      const accountNos = deleteContactArr;
      if (contactsType == "contactsItem") {
        selectedConts = contacts?.contacts?.filter((con) =>
          accountNos.includes(con.account_number)
        );
      } else {
        selectedConts = contactsInvited?.contacts?.filter((con) =>
          accountNos.includes(con.mobile)
        );
      }
      const ids = selectedConts.map(({ country_code, mobile }) => ({
        country_code,
        mobile,
      }));
      const { data } = await apiRequest.deleteContact({ contacts: ids });
      if (!data.success) throw data.message;

      if (contactsType == "contactsItem") {
        retrieveContacts(pagination?.current_page);
      } else {
        handleInvitedContacts(pagination?.current_page);
      }
      setSelectedContacts([]);
      toast.success(data.message);
      setConfirmShow(false);
      setRemoveConfirmShow(false);
      setDeleteContactArr("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // For getting selected contacts list
  const handleSelectedContacts = (contacts) => {
    if (!contacts) return;
    setSelectedContacts(contacts);
  };

  // For getting invited contacts list
  const handleInvitedContacts = async (currentPage = 1, search) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.invitedContactsList({
        page: currentPage,
        search: search,
      });
      if (!data.success) throw data.message;
      setContactsOrInvited("invited");
      // setPagination(currentPage);
      setContactsInvited(data.data);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        setContactsOrInvited("invited");
        setContactsInvited(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // For disable remove contact button
  const isDisabled = () => {
    const len = selectedContacts.filter((conatct) => conatct).length;
    return len === 0;
  };

  // For handle filter of both contacts or invited contacts
  const handleChangeFilter = (e, type) => {
    const val = e.target.value;
    setSearch(val);
    if (type == "contactsItem") {
      retrieveContacts(pagination?.current_page, val);
    } else {
      handleInvitedContacts(pagination?.currentPage, val);
    }
  };

  // For handle reset filter of bith contacts or invite contacts
  const handleResetFilter = (type) => {
    setSearch("");
    if (type == "contactsItem") {
      retrieveContacts();
    } else {
      handleInvitedContacts();
    }
  };

  const deleteGroupData = () => {
    setShowDeleteGroupPopup(true);
  };

  const deleteGroup = async (id) => {
    try {
      var param = { group_id: id };
      const { data } = await apiRequest.deleteGroup(param);
      if (!data.success) throw data.message;
      setShowDeleteGroupPopup(false);
      toast.success(data.message);
      navigate("/send");
    } catch (error) {}
  };

  return (
    <ContactsContext.Provider
      value={{
        handleFavContact,
        handleOpenConfirmModal,
        handleRemoveConfirmModal,
        handleDeleteContact,
        contactName,
        confirmShow,
        setConfirmShow,
        setRemoveConfirmShow,
        removeConfirmShow,
        favIconShow,
        // contacts
        contacts,
        pagination,
        isLoadingContacts,
        retrieveContacts,
        handleSelectedContacts,
        contactsType,
        handleInvitedContacts,
        contactsInvited,
        isDisabled,
        handleChangeFilter,
        handleResetFilter,
        search,
        deleteGroup,
        deleteGroupData,
        showDeleteGroupPopup,
        setShowDeleteGroupPopup,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
