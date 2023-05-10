import { apiRequest } from "helpers/apiRequests";
import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { LoaderContext } from "./loaderContext";
import { useNavigate, useLocation } from "react-router-dom";

export const ContactsContext = React.createContext({});

const ContactsProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoading } = useContext(LoaderContext);
  const [selectedContacts, setSelectedContacts] = useState([]);
  // Contacts and it's pagination
  const [contacts, setContacts] = useState([]);
  const [paginationConts, setPaginationConts] = useState({});
  const [isLoadingConts, setIsLoadingConts] = useState(false);
  // Invited Contacts and it's pagination
  const [contactsInvited, setContactsInvited] = useState([]);
  const [paginationInConts, setPaginationInConts] = useState({});
  const [isLoadingInConts, setIsLoadingInConts] = useState(false);
  //
  const [search, setSearch] = useState("");
  const [contactsType, setContactsType] = useState([]);
  const [contactName, setContactName] = useState("");
  const [deleteContactArr, setDeleteContactArr] = useState([]);
  const [confirmShow, setConfirmShow] = useState(false);
  const [removeConfirmShow, setRemoveConfirmShow] = useState(false);
  const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);

  // For changing fav contact in list
  const bindFavouriteContact = (favCon = {}, type = "") => {
    switch (type) {
      case "contactsItem":
        const muContacts = [...contacts]?.map((con) => {
          if (
            con.mobile === favCon.mobile &&
            con.country_code === favCon.country_code
          )
            con.is_favourite = !con.is_favourite;
          return con;
        });
        setContacts(muContacts);
        return;
      case "inviteContactsItem":
        const muInvitedContacts = [...contactsInvited]?.map((con) => {
          if (
            con.mobile === favCon.mobile &&
            con.country_code === favCon.country_code
          )
            con.is_favourite = !con.is_favourite;
          return con;
        });
        setContactsInvited(muInvitedContacts);
        return;
      default:
        return;
    }
  };

  //For add contacts to favourite list
  const handleFavContact = async (contact, type) => {
    const reqData = {
      country_code: contact.country_code,
      mobile: contact.mobile,
      mark_as_fav: contact.is_favourite ? 0 : 1,
    };
    bindFavouriteContact(contact, type);
    try {
      const { data } = await apiRequest.markAsFavourite(reqData);
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      bindFavouriteContact(contact, type);
    }
  };

  // // For getting contacts list
  // const retrieveContacts = async (page = 1, search = "") => {
  //   setIsLoadingConts(true);
  //   try {
  //     const { data } = await apiRequest.contactsList({ page, search });
  //     if (!data.success) throw data.message;
  //     const { contacts = [], pagination } = data.data || {};
  //     setPaginationConts(pagination);
  //     setContacts(contacts || []);
  //   } catch (error) {
  //     if (typeof error === "string") setContacts([]);
  //     console.log(error);
  //   } finally {
  //     setIsLoadingConts(false);
  //   }
  // };

  // For getting invited contacts list
  const handleInvitedContacts = async (page = 1, search = "") => {
    setIsLoadingInConts(true);
    try {
      const { data } = await apiRequest.invitedContactsList({ page, search });
      if (!data.success) throw data.message;
      const { contacts = [], pagination } = data.data || {};
      setContactsInvited(contacts || []);
      setPaginationInConts(pagination);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") setContactsInvited([]);
    } finally {
      setIsLoadingInConts(false);
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
  const handleRemoveConfirmModal = (idArr, type) => {
    setDeleteContactArr(idArr);
    setRemoveConfirmShow(true);
    setContactsType(type);
  };

  // For delete contacts from the list
  const handleDeleteContact = async () => {
    setIsLoading(true);
    try {
      let selectedConts = [];
      const accountNos = deleteContactArr;
      if (contactsType == "contactsItem") {
        selectedConts = contacts?.filter((con) =>
          accountNos.includes(con.account_number)
        );
      } else {
        selectedConts = contactsInvited?.filter((con) =>
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
        // retrieveContacts(paginationConts?.current_page);
      } else {
        handleInvitedContacts(paginationInConts?.current_page);
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

  // For disable remove contact button
  const isDisabled = () => {
    const len = selectedContacts.length;
    return len === 0;
  };

  // For handle filter of both contacts or invited contacts
  const handleChangeFilter = (e, type) => {
    const val = e.target.value;
    setSearch(val);
    setContactsType(type);
  };

  // For handle reset filter of bith contacts or invite contacts
  const handleResetFilter = (type) => {
    setSearch("");
    setContactsType(type);
  };

  const deleteGroupData = () => {
    setShowDeleteGroupPopup(true);
  };

  const deleteGroup = async (id) => {
    try {
      const param = { group_id: id };
      const { data } = await apiRequest.deleteGroup(param);
      if (!data.success) throw data.message;
      setShowDeleteGroupPopup(false);
      toast.success(data.message);
      navigate("/send");
    } catch (error) {}
  };

  // useEffect(() => {
  //   if (search === "") {
  //     if (contactsType == "contactsItem")
  //       retrieveContacts(paginationConts?.current_page, search);
  //     else handleInvitedContacts(paginationInConts?.currentPage, search);
  //     return;
  //   }
  //   const timeOut = setTimeout(() => {
  //     if (contactsType == "contactsItem")
  //       retrieveContacts(paginationConts?.current_page, search);
  //     else handleInvitedContacts(paginationInConts?.currentPage, search);
  //   }, 1000);
  //   return () => clearTimeout(timeOut);
  // }, [search.trim()]);

  useEffect(() => {
    setSelectedContacts([]);
  }, [location.pathname]);

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
        // contacts
        contacts,
        paginationConts,
        isLoadingConts,
        // invited contacts
        contactsInvited,
        paginationInConts,
        isLoadingInConts,
        //
        // retrieveContacts,
        handleSelectedContacts,
        contactsType,
        handleInvitedContacts,
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
