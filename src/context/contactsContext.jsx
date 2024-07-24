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
  const [confirmShow, setConfirmShow] = useState(false);
  const [removeConfirmShow, setRemoveConfirmShow] = useState(false);
  const [showDeleteGroupPopup, setShowDeleteGroupPopup] = useState(false);
  const [showConfirmDeleteContact, setShowConfirmDeleteContact] =
    useState(false);
  const [showConfirmDelSingle, setShowConfirmDelSingle] = useState(false);
  const [showConfirmDelSelected, setShowConfirmDelSelected] = useState(false);
  const [isPaymentExistMessage, setIsPaymentExistMessage] = useState("");

  // For changing fav contact in list
  const bindFavouriteContact = (favCon = {}, contacts = []) => {
    const muContacts = [...contacts]?.map((con) => {
      if (
        con.mobile === favCon.mobile &&
        con.country_code === favCon.country_code
      )
        con.is_favourite = !con.is_favourite;
      return con;
    });
    return muContacts;
  };

  //For changing favourite contact status @return List
  const changeFavouriteContact = async (
    contact = {},
    contacts = [],
    setContacts = () => {}
  ) => {
    const reqData = {
      // country_code: contact?.country_code || "",
      mobile: contact?.mobile || "",
      mark_as_fav: contact.is_favourite ? 0 : 1,
    };
    try {
      const chContacts = bindFavouriteContact(contact, contacts);
      if (setContacts) setContacts(chContacts);
      const { data } = await apiRequest.markAsFavourite(reqData);
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      const chContacts = bindFavouriteContact(contact, contacts);
      if (setContacts) setContacts(chContacts);
    }
  };

  // For check customer payments through account_number from the list
  const checkCustomerPayment = async (
    delContactUniqIds = [],
    contacts = []
  ) => {
    setIsLoading(true);
    try {
      const delContacts = [];
      contacts?.map((con) => {
        const { account_number, mobile } = con;
        if (
          delContactUniqIds.includes(account_number) ||
          delContactUniqIds.includes(mobile)
        )
          delContacts.push({ account_number });
        return con;
      });
      const { data } = await apiRequest.checkCustomerPayment({
        contacts: delContacts,
      });
      if (!data.success) throw data.message;
      if (data.data.isPaymentExist) {
        setIsPaymentExistMessage(data.message);
        setShowConfirmDeleteContact(true);
      } else if(delContactUniqIds?.length >= 2) {
        setShowConfirmDelSelected(true);
      } else {
        setShowConfirmDelSingle(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // For delete contacts from the list
  const deleteContact = async (delContactUniqIds = [], contacts = []) => {
    setIsLoading(true);
    try {
      const delContacts = [];
      contacts?.map((con) => {
        const { account_number, mobile } = con;
        if (
          delContactUniqIds.includes(account_number) ||
          delContactUniqIds.includes(mobile)
        )
          delContacts.push({ mobile });
        return con;
      });
      const { data } = await apiRequest.deleteContact({
        contacts: delContacts,
      });
      if (!data.success) throw data.message;
      setIsPaymentExistMessage("");
      toast.success(data.message);
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

  useEffect(() => {
    setSelectedContacts([]);
  }, [location.pathname]);

  return (
    <ContactsContext.Provider
      value={{
        deleteContact,
        checkCustomerPayment,
        changeFavouriteContact,
        confirmShow,
        setConfirmShow,
        setRemoveConfirmShow,
        removeConfirmShow,
        handleSelectedContacts,
        isDisabled,
        deleteGroup,
        deleteGroupData,
        isPaymentExistMessage,
        showDeleteGroupPopup,
        setShowDeleteGroupPopup,
        setShowConfirmDeleteContact,
        showConfirmDeleteContact,
        setShowConfirmDelSingle,
        showConfirmDelSingle,
        setShowConfirmDelSelected,
        showConfirmDelSelected
      }}
    >
      {children}
    </ContactsContext.Provider>
  );
};

export default ContactsProvider;
