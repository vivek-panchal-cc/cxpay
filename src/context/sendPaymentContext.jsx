import React, { useState, useEffect, useContext } from "react";
import {
  MAX_PAYMENT_CONTACTS,
  MAX_REQUEST_CONTACTS,
  renameKeys,
} from "constants/all";
import { apiRequest } from "helpers/apiRequests";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { LoaderContext } from "./loaderContext";

export const SendPaymentContext = React.createContext({});

const SendPaymentProvider = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsLoading } = useContext(LoaderContext);
  const [prevPath, setPrevPath] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [sendCreds, setSendCreds] = useState({ wallet: [] });
  const [requestCreds, setRequestCreds] = useState({});
  const [charges, setCharges] = useState([]);
  const [disableEdit, setDisableEdit] = useState(false);
  // const [isCharged, setIsCharged] = useState(false);

  // For Send contacts button click
  const handleSendContacts = (contacts = null, request_id = "") => {
    const sendContactsList =
      contacts && contacts.length > 0 ? contacts : selectedContacts;
    if (!sendContactsList || sendContactsList.length <= 0)
      return toast.warning("Please select at least one contact");
    if (sendContactsList.length > MAX_PAYMENT_CONTACTS)
      return toast.warning(`You have exceed the contact limit.`);
    const alias = {
      account_number: "receiver_account_number",
    };
    const listAlias = sendContactsList.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: item.personal_amount || "",
      specifications: item.specifications || "",
    }));
    const tmpCreds = request_id
      ? { wallet: listAlias, request_id }
      : { wallet: listAlias };
    setDisableEdit(request_id ? true : false);
    setSendCreds(tmpCreds);
    navigate("/send/payment");
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
    navigate("/send/payment");
  };

  // For Send Request to contacts, request button click
  const handleSendRequest = (contacts = null) => {
    const sendRequestList =
      contacts && contacts.length > 0 ? contacts : selectedContacts;
    if (!sendRequestList || sendRequestList.length <= 0)
      return toast.warning("Please select at least one contact");
    if (sendRequestList.length > MAX_REQUEST_CONTACTS)
      return toast.warning(`You have exceed the contact limit.`);
    const alias = {
      account_number: "receiver_account_number",
    };
    const listAlias = sendRequestList.map((item) => ({
      ...renameKeys(alias, item),
      amount: "",
      specification: "",
    }));
    setRequestCreds({ wallet: listAlias });
    navigate("/request/payment");
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

  // For making change (like remove) in the selected contacts
  const handleRequestCreds = (credsContacts) => {
    setRequestCreds((cs) => ({ ...cs, wallet: credsContacts }));
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
  const handleCancelPayment = async () => {
    setSelectedContacts([]);
    setSelectedGroup([]);
    setSendCreds([]);
    setRequestCreds([]);
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
    if (!sendCreds || !sendCreds.wallet || sendCreds.wallet.length <= 0) return;
    (async () => {
      await getPaymentCharges();
    })();
  }, [sendCreds]);

  useEffect(() => {
    const path = location.pathname;
    const flag =
      (prevPath?.includes("/send") && path === "/request") ||
      (prevPath?.includes("/request") && path === "/send") ||
      path?.includes("/contacts") ||
      path?.includes("/activities") ||
      path?.includes("/view-notification");
    if (flag) handleCancelPayment();
    setPrevPath(path);
  }, [location.pathname]);

  return (
    <SendPaymentContext.Provider
      value={{
        handleSelectedContacts,
        handleSelectedGroup,
        handleCancelPayment,
        handleSendContacts,
        handleSendRequest,
        handleSendGroup,
        handleRequestCreds,
        handleSendCreds,
        selectedContacts,
        selectedGroup,
        requestCreds,
        disableEdit,
        sendCreds,
        charges,
      }}
    >
      {children}
    </SendPaymentContext.Provider>
  );
};

export default SendPaymentProvider;
