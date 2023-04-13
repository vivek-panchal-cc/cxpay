import { MAX_PAYMENT_CONTACTS, renameKeys } from "constants/all";
import { apiRequest } from "helpers/apiRequests";
import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoaderContext } from "./loaderContext";

export const SendPaymentContext = React.createContext({});

const SendPaymentProvider = ({ children }) => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [sendCreds, setSendCreds] = useState({ wallet: [] });
  const [charges, setCharges] = useState([]);

  // For Send contacts button click
  const handleSendContacts = (contacts = null) => {
    const sendContactsList =
      contacts && contacts.length > 0 ? contacts : selectedContacts;
    if (!sendContactsList || sendContactsList.length <= 0)
      return toast.warning("Please select at least one contact");
    if (sendContactsList.length > MAX_PAYMENT_CONTACTS)
      return toast.warning(
        `Maximum contacts limit is ${MAX_PAYMENT_CONTACTS} contacts`
      );
    const alias = {
      account_number: "receiver_account_number",
    };
    const listAlias = sendContactsList.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: "",
      specifications: "",
    }));
    setSendCreds({ wallet: listAlias });
    navigate("/send-payment");
  };

  // For Send group button click
  const handleSendGroup = () => {
    if (!selectedGroup || selectedGroup.length <= 0)
      return toast.warning("Please select at least one group");
    const { group_details, group_id } = selectedGroup[0];
    if (!group_details || group_details.length <= 0)
      return toast.warning(`Group contains no contacts`);
    if (group_details.length > MAX_PAYMENT_CONTACTS)
      return toast.warning(
        `Group contains more than ${MAX_PAYMENT_CONTACTS} contacts`
      );
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
    setSendCreds({ group_id, wallet: [...listAlias] });
    navigate("/send-payment");
  };

  // For making change (like remove) in the selected contacts
  const handleSendCreds = (credsContacts) => {
    setSendCreds((cs) => ({ ...cs, wallet: credsContacts }));
    if (selectedContacts && selectedContacts.length > 0) {
      const accountsNo = credsContacts?.map(
        (item) => item.receiver_account_number
      );
      const filter = selectedContacts.filter((con) =>
        accountsNo.includes(con.account_number)
      );
      setSelectedContacts(filter);
    }
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

  // For cancel the transaction
  const handleCancelPayment = () => {
    setSelectedContacts([]);
    setSelectedGroup([]);
    setSendCreds([]);
  };

  // For getting the charges of payment from API
  const getPaymentCharges = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getCharges("pay_type=WW");
      if (!data.success) throw data.message;
      setCharges(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!sendCreds || sendCreds.length <= 0) return;
    (async () => {
      await getPaymentCharges();
    })();
  }, [sendCreds]);

  return (
    <SendPaymentContext.Provider
      value={{
        handleSelectedContacts,
        handleSelectedGroup,
        handleSendContacts,
        handleSendGroup,
        handleSendCreds,
        handleCancelPayment,
        selectedContacts,
        selectedGroup,
        sendCreds,
        charges,
      }}
    >
      {children}
    </SendPaymentContext.Provider>
  );
};

export default SendPaymentProvider;
