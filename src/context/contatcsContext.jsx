import { apiRequest } from "helpers/apiRequests";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { LoaderContext } from "./loaderContext";

export const ContactsContext = React.createContext({});

const ContatcsProvider = ({ children }) => {
  const { setIsLoading } = useContext(LoaderContext);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [favIconShow, setfavIconShow] = useState(false);
  const [page, setPage] = useState(1);
  const [contacts, setContacts] = useState([]);
  const [contactsInvited, setContactsInvited] = useState([]);
  const [search, setSearch] = useState("");
  const [contactsType, setContactsType] = useState([]);
  const [contactName, setContactName] = useState("");
  const [deleteContactArr, setDeleteContactArr] = useState([]);
  const [confirmShow, setConfirmShow] = useState(false);
  const [contactsOrInvited, setContactsOrInvited] = useState("");
  const [removeConfirmShow, setRemoveConfirmShow] = useState(false);

  //For add contacts to favourite list
  const handleFavContact = async (mobile, remove_flg, type) => {
    setIsLoading(true);
    let selectedConts = [];
    if (type == "contactsItem") {
      selectedConts = contacts?.contacts?.filter((con) => mobile == con.mobile);
    } else {
      selectedConts = contactsInvited?.contacts?.filter(
        (con) => mobile == con.mobile
      );
    }
    const selectedData = selectedConts.map(({ country_code, mobile }) => ({
      country_code,
      mobile,
      mark_as_fav: remove_flg,
    }));

    let reqData = {};
    if (selectedData.length > 0) {
      reqData = selectedData[0];
    }
 
    try {
      const { data } = await apiRequest.favContact(reqData);
      if (type == "contactsItem") {
        data["status_code"] === 200 && retrieveContacts(page);
      } else {
        data["status_code"] === 200 && handleInvitedContacts(page);
      }
      setfavIconShow(favIconShow);
      toast.success(data.message);

      if (!data.success || data.data === null) throw data.message;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // For getting contacts list
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
    } catch (error) {
      if (error === "Contact not found") {
        setContacts(null);
      }
      console.log(error);
    } finally {
      setIsLoading(false);
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
    try {
      const { data } = await apiRequest.deleteContact({ contacts: ids });
      if (contactsType == "contactsItem") {
        data["status_code"] === 200 && retrieveContacts(page);
      } else {
        data["status_code"] === 200 && handleInvitedContacts(page);
      }
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

  // For getting selected contacts list
  const handleSelectedContacts = (contacts) => {
    if (!contacts) return;
    setSelectedContacts(contacts);
  };

  // For getting invited contacts list
  const handleInvitedContacts = async (currentPage = 1, search) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.invitedConatcts({
        page: currentPage,
        search: search,
      });
      if (!data.success || data.data === null) throw data.message;
      setContactsOrInvited("invited");
      setPage(currentPage);
      setContactsInvited(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (error === "Contact not found") {
        setContactsOrInvited("invited");
        setContactsInvited(null);
      }
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
      retrieveContacts(page, val);
    } else {
      handleInvitedContacts(page, val);
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
        contacts,
        retrieveContacts,
        handleSelectedContacts,
        contactsType,
        handleInvitedContacts,
        contactsInvited,
        isDisabled,
        handleChangeFilter,
        handleResetFilter,
        search,
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContatcsProvider;
