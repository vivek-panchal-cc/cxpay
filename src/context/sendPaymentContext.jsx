import { renameKeys } from "constants/all";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SendPaymentContext = React.createContext({});

const SendPaymentProvider = ({ children }) => {
  const navigate = useNavigate();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [sendCreds, setSendCreds] = useState({ contacts: [] });

  // For Send contacts button click
  const handleSendContacts = () => {
    if (!selectedContacts || selectedContacts.length <= 0)
      return toast.warning("Please select at least one contact");
    const alias = {
      account_number: "receiver_account_number",
    };
    const listAlias = selectedContacts.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: "",
      specifications: "",
    }));
    console.log(listAlias);
    setSendCreds({ contacts: listAlias });
    navigate("/send-payment");
  };

  // For Send group button click
  const handleSendGroup = () => {
    if (!selectedGroup || selectedGroup.length <= 0)
      return toast.warning("Please select at least one group");
    const { group_details, group_id } = selectedGroup[0];
    const alias = {
      member_account_number: "receiver_account_number",
      member_profile_image: "profile_image",
      member_country_code: "country_code",
      member_mobile: "mobile",
      member_email: "email",
      member_name: "name",
    };
    const listAlias = group_details.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: "",
      specifications: "",
    }));
    console.log(listAlias);
    setSendCreds({ group_id, contacts: [...listAlias] });
    navigate("/send-payment");
  };

  // For getting selected contacts list
  const handleSelectedContacts = (contacts) => {
    if (!contacts) return;
    setSelectedContacts(contacts);
  };

  // For getting selected group || groups
  const handleSelectedGroup = (group) => {
    if (!group) return;
    setSelectedGroup(group);
  };

  return (
    <SendPaymentContext.Provider
      value={{
        handleSelectedContacts,
        handleSelectedGroup,
        handleSendContacts,
        handleSendGroup,
        sendCreds,
      }}
    >
      {children}
    </SendPaymentContext.Provider>
  );
};

export default SendPaymentProvider;
