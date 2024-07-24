import React, { useState, useEffect, useContext } from "react";
import {
  CHARGES_TYPE_WW,
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
  const [prevPathRedirect, setPrevPathRedirect] = useState(null);
  const [prevPath, setPrevPath] = useState();
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState([]);
  const [sendCreds, setSendCreds] = useState({ wallet: [] });
  const [requestCreds, setRequestCreds] = useState({});
  const [charges, setCharges] = useState([]);
  const [disableEdit, setDisableEdit] = useState(false);

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
    const tmpCreds = { wallet: listAlias };
    setDisableEdit(request_id ? true : false);
    if (request_id && request_id.length > 0) {
      tmpCreds.request_id = request_id;
      setSelectedContacts([]);
      setSelectedGroup([]);
      setRequestCreds([]);
    }
    setSendCreds(tmpCreds);
    navigate("/send/payment");
  };

  // For Send contacts button click
  const handleSendContactsSchedule = (schedule_date = null, contacts = null, request_id = "") => {    
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
    const tmpCreds = { wallet: listAlias };
    setDisableEdit(request_id ? true : false);
    if (request_id && request_id.length > 0) {
      tmpCreds.request_id = request_id;
      setSelectedContacts([]);
      setSelectedGroup([]);
      setRequestCreds([]);
    }
    setSendCreds(tmpCreds);
    navigate("/send/payment", { state: { scheduleDate: schedule_date } });
  };

  // For Send contacts button click for recurring
  const handleSendRecurringContacts = (contacts = null, request_id = "") => {
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
    const tmpCreds = { wallet: listAlias };
    setDisableEdit(request_id ? true : false);
    if (request_id && request_id.length > 0) {
      tmpCreds.request_id = request_id;
      setSelectedContacts([]);
      setSelectedGroup([]);
      setRequestCreds([]);
    }
    setSendCreds(tmpCreds);
    navigate("/send/recurring-payment");
  };

  const handleSendRecurringGroup = async () => {
    if (!selectedGroup || selectedGroup.length <= 0)
      return toast.warning("Please select at least one group");
    const { group_id } = selectedGroup[0];
    const groupDetails = await getGroupDetail(group_id);
    if (!groupDetails) return;
    const { group_member_details } = groupDetails;
    if (!group_member_details || group_member_details.length <= 0)
      return toast.warning(`Group contains no contacts`);
    if (group_member_details.length > MAX_PAYMENT_CONTACTS)
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
    const listAlias = group_member_details.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: "",
      specifications: "",
    }));
    setSendCreds({ group_id, wallet: [...listAlias] });
    navigate("/send/recurring-payment");
  };

  // For Send group button click
  const handleSendGroup = async () => {
    if (!selectedGroup || selectedGroup.length <= 0)
      return toast.warning("Please select at least one group");
    const { group_id } = selectedGroup[0];
    const groupDetails = await getGroupDetail(group_id);
    if (!groupDetails) return;
    const { group_member_details } = groupDetails;
    if (!group_member_details || group_member_details.length <= 0)
      return toast.warning(`Group contains no contacts`);
    if (group_member_details.length > MAX_PAYMENT_CONTACTS)
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
    const listAlias = group_member_details.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: "",
      specifications: "",
    }));
    setSendCreds({ group_id, wallet: [...listAlias] });
    navigate("/send/payment");
  };

  const handleSendGroupSchedule = async (schedule_date = null) => {
    if (!selectedGroup || selectedGroup.length <= 0)
      return toast.warning("Please select at least one group");
    const { group_id } = selectedGroup[0];
    const groupDetails = await getGroupDetail(group_id);
    if (!groupDetails) return;
    const { group_member_details } = groupDetails;
    if (!group_member_details || group_member_details.length <= 0)
      return toast.warning(`Group contains no contacts`);
    if (group_member_details.length > MAX_PAYMENT_CONTACTS)
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
    const listAlias = group_member_details.map((item) => ({
      ...renameKeys(alias, item),
      personal_amount: "",
      specifications: "",
    }));
    setSendCreds({ group_id, wallet: [...listAlias] });
    navigate("/send/payment", { state: { scheduleDate: schedule_date } });
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
    setSendCreds({ wallet: [] });
    setRequestCreds([]);
    setDisableEdit(false);
  };

  // For getting the group details
  const getGroupDetail = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getGroupDetail({ group_id: id });
      if (!data.success) throw data.message;
      const { group_details } = data.data || {};
      return group_details;
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  // For getting the charges of payment from API
  const getPaymentCharges = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getCharges(CHARGES_TYPE_WW);
      if (!data.success) throw data.message;
      setCharges(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { wallet } = sendCreds || {};
    if (!wallet || wallet.length <= 0) return;
    (async () => {
      await getPaymentCharges();
    })();
  }, [sendCreds]);

  useEffect(() => {
    const path = location.pathname;
    setPrevPathRedirect(prevPath);
    const flag =
      (prevPath?.includes("/send") && !path.includes("/send")) ||
      (prevPath?.includes("/request") &&
        !disableEdit &&
        !path.includes("/request"));
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
        handleSendRecurringContacts,
        handleSendRecurringGroup,
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
        prevPathRedirect,
        handleSendContactsSchedule,
        handleSendGroupSchedule,
      }}
    >
      {children}
    </SendPaymentContext.Provider>
  );
};

export default SendPaymentProvider;
