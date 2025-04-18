import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LoaderContext } from "./loaderContext";
import useOwnJar from "hooks/useOwnJar";
import useSharedJar from "hooks/useSharedJar";
import useInvitedJar from "hooks/useInvitedJar";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import ModalJarTransferWallet from "components/modals/ModalJarTransferWallet";
import ModalRecurringPaymentDetails from "components/modals/ModalRecurringPaymentDetails";

export const SavingJarOwnContext = React.createContext({});

const SavingJarOwnProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prevPathRedirect, setPrevPathRedirect] = useState(null);
  const [prevPath, setPrevPath] = useState();
  const { setIsLoading } = useContext(LoaderContext);
  const [savingJarDetails, setSavingJarDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchSharedName, setSearchSharedName] = useState("");
  const [searchInvitedName, setSearchInvitedName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdJarData, setCreatedJarData] = useState([]);
  const [sendCreds, setSendCreds] = useState({ wallet: [] });
  const [editJar, setEditJar] = useState({ editWallet: [] });
  const [tabName, setTabName] = useState("own");
  const [jarId, setJarId] = useState(null);
  const [jarData, setJarData] = useState(null);
  const [scheduledPaymentDetails, setScheduledPaymentDetails] = useState({});
  const [recurringPaymentDetails, setRecurringPaymentDetails] = useState({});
  const [recurringPaymentDetailsId, setRecurringPaymentDetailsId] =
    useState(null);
  const [showTransferToWalletPopup, setShowTransferToWalletPopup] =
    useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [invitedViewDetailsLoading, setInvitedViewDetailsLoading] =
    useState(false);
  const [recurringDetails, setRecurringDetails] = useState({});

  const [
    loadingOwnJar,
    activeJarList,
    inactiveJarList,
    ownJarStatistics,
    reloadOwnJar,
  ] = useOwnJar({
    search_name: searchName,
  });

  const [
    loadingSharedJar,
    activeSharedJarList,
    inactiveSharedJarList,
    sharedJarStatistics,
    reloadSharedJar,
  ] = useSharedJar({
    search_name: searchSharedName,
  });

  const [
    loadingInvitedJar,
    activeInvitedJarList,
    inactiveInvitedJarList,
    reloadInvitedJar,
  ] = useInvitedJar({
    search_name: searchInvitedName,
  });

  const handleSendJarSchedule = (schedule_date = null) => {
    if (!createdJarData) return;
    const tmpCreds = {
      wallet: {
        ...createdJarData,
        schedule_date,
        deposite_amount: "",
        specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/send", { state: { scheduleDate: schedule_date } });
  };

  const handleInstantPayment = () => {
    if (!createdJarData) return;
    const tmpCreds = {
      wallet: {
        ...createdJarData,
        deposite_amount: "",
        specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/send");
  };

  const handleRecurringPayment = () => {
    if (!createdJarData) return;
    const tmpCreds = {
      wallet: {
        ...createdJarData,
        deposite_amount: "",
        specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send");
  };

  const handleRecurringSendPayment = (data) => {
    if (!data || !createdJarData) return;
    const tmpCreds = {
      wallet: {
        ...data,
        ...createdJarData,
        deposite_amount: "",
        specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send-payment");
  };

  const handleInstantPaymentForAddAmount = (details = null) => {
    if (!details) return;
    const newTargetAmount =
      parseFloat(details.target_amount) - parseFloat(details.deposite_amount);
    const tmpCreds = {
      wallet: {
        ...details,
        deposite_amount: "",
        specifications: "",
        target_amount: newTargetAmount || details.target_amount,
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/send");
  };

  const handleSendJarScheduleForAddAmount = (schedule_date = null) => {
    if (!createdJarData) return;
    const newTargetAmount =
      parseFloat(createdJarData.target_amount) -
      parseFloat(createdJarData.deposite_amount);
    const tmpCreds = {
      wallet: {
        ...createdJarData,
        schedule_date,
        deposite_amount: "",
        specifications: "",
        target_amount: newTargetAmount || createdJarData.target_amount,
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/send", { state: { scheduleDate: schedule_date } });
  };

  const handleRecurringPaymentForAddAmount = (details = null) => {
    if (!details) return;
    const tmpCreds = {
      wallet: {
        ...details,
        deposite_amount: "",
        specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send");
  };

  const handleRecurringPaymentForSharedUser = (details = null) => {
    if (!details) return;
    const tmpCreds = {
      wallet: {
        ...details,
        deposite_amount: "",
        specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send");
  };

  const handleRecurringPaymentForAddedMember = (data) => {
    if (!data) return;
    const tmpCreds = {
      wallet: {
        ...data,
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send-payment");
  };

  const handleRecurringPaymentForAddAmountToPay = (data) => {
    if (!data || !createdJarData) return;
    const newTargetAmount =
      parseFloat(createdJarData.target_amount) -
      parseFloat(createdJarData.deposite_amount);
    const tmpCreds = {
      wallet: {
        ...data,
        ...createdJarData,
        deposite_amount: "",
        specifications: "",
        target_amount: newTargetAmount || createdJarData.target_amount,
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send-payment");
  };

  const handleRecurringPaymentForAddAmountToPayForDate = (data) => {
    if (!data || !createdJarData) return;
    const newTargetAmount =
      parseFloat(createdJarData.target_amount) -
      parseFloat(createdJarData.deposite_amount);
    const tmpCreds = {
      wallet: {
        ...data,
        ...createdJarData,
        // deposite_amount: "",
        // specifications: "",
        target_amount: newTargetAmount || createdJarData.target_amount,
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send-payment");
  };

  const handleRecurringSendPaymentForDate = (data) => {
    if (!data || !createdJarData) return;
    const tmpCreds = {
      wallet: {
        ...data,
        ...createdJarData,
        // deposite_amount: "",
        // specifications: "",
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send-payment");
  };

  const handleRecurringUpdatePaymentForDate = (data) => {
    if (!data) return;
    const tmpCreds = {
      wallet: {
        ...data,
      },
    };
    setSendCreds(tmpCreds);
    navigate("/jars/own/recurring-send-payment");
  };

  const handleEditJarData = (data) => {
    if (!data) return;
    const tmpEditData = {
      editWallet: data,
    };
    setEditJar(tmpEditData);
    navigate("/jars/own/edit-jar");
  };

  const handleCreatedJarData = (data) => {
    if (!data) return;
    setCreatedJarData(data);
  };

  const cancelOwnJarPayment = () => {
    setCreatedJarData([]);
    setSavingJarDetails(null);
    setCurrentPage(1);
    setStartDate("");
    setSearchName("");
    setSearchSharedName("");
    setSearchInvitedName("");
    setEndDate("");
    setSendCreds({ wallet: [] });
    setEditJar({ editWallet: [] });
    setJarData(null);
    // setJarId(null);
    // setTabName("own");
  };

  const handleSearchName = (data) => {
    setSearchName(data);
  };

  const resetSearchName = () => {
    setSearchName("");
  };

  const handleSearchSharedName = (data) => {
    setSearchSharedName(data);
  };

  const resetSearchSharedName = () => {
    setSearchSharedName("");
  };

  const handleSearchInvitedName = (data) => {
    setSearchInvitedName(data);
  };

  const resetSearchInvitedName = () => {
    setSearchInvitedName("");
  };

  const handleStoreJarId = (id) => {
    if (!id) return;
    setJarId(id);
  };

  const handleTabList = (value) => {
    if (!value) return;
    setTabName(value);
  };

  const confirmAcceptOrDeclineTransaction = async (value, jar_id) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.acceptRejectSavingJarDetails({
        jar_id: jar_id,
        request_accept: value,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      reloadInvitedJar();
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addJarMembers = async (id, data) => {
    setIsLoading(true);
    const members = data.map((member) => member.account_number);
    try {
      const { data } = await apiRequest.addMemberInSavingJar({
        jar_id: id,
        members,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      reloadOwnJar();
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const addJarMembersWithRecurringData = async (details) => {
    setIsLoading(true);
    const members = details.members.map((member) => member.account_number);
    try {
      const { data } = await apiRequest.addMemberInSavingJar({
        jar_id: details.jar_id,
        members,
        recurring_details: details.recurring_details,
      });
      if (!data.success) throw data.message;
      return {
        success: true,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        message: error || "Something went wrong",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetShowTransferToWalletPopup = (id) => {
    if (!id) return;
    setJarId(id);
    setShowTransferToWalletPopup(true);
  };

  const handleCallbackTransferToWallet = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.transferSavingJarAmountToWallet({
        jar_id: jarId,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      navigate(`/jars/own`, { replace: true });
      reloadOwnJar();
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      setJarId(null);
      if (tabName === "shared") {
        navigate(`/jars/shared`, { replace: true });
        reloadSharedJar();
      } else {
        navigate(`/jars/own`, { replace: true });
        reloadOwnJar();
      }
    } finally {
      setIsLoading(false);
      setShowTransferToWalletPopup(false);
    }
  };

  const handleDeleteMember = async (id, acc_number) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.removeMemberInSavingJar({
        jar_id: id,
        member_account_number: acc_number,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAllMemberList = (id, data = null) => {
    if (!id) return;
    setJarId(id);
    if (data) setJarData(data);
  };

  const handleScheduledPaymentDetails = async ({ id }) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.transferListSavingJarSchedulePayment({
        jar_id: jarId,
        payment_id: id,
      });
      if (!data.success) throw data.message;
      const details = data.data.transactions[0];
      setScheduledPaymentDetails({ ...details, jarId });
      navigate("/jars/own/jar-schedule-pay-list/update", { replace: true });
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateJarScheduledPayment = async (params) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.updateSavingJarSchedulePayment(params);
      if (!data.success) throw data;
      toast.success(data.message);
      navigate("/jars/own/jar-schedule-pay-list", { replace: true });
      return { success: true };
    } catch (error) {
      if (error.data.is_suspended) {
        navigate("/logout", { replace: true });
        toast.error(error.message);
        return;
      }
      // if (typeof error.message === "string") toast.error(error.message);
      return {
        success: false,
        message: error.message || "Something went wrong",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecurringPaymentDetails = async ({ id }) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.dateListSavingJarRecurringPayment({
        jar_recurring_payment_id: id,
      });
      if (!data.success) throw data.message;
      const details = data.data;
      setRecurringPaymentDetails({ ...details, jarId });
      navigate("/jars/own/jar-recurring-pay-list/update", { replace: true });
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const jarRecurringPaymentDetailsId = (id) => {
    if (!id) return;
    setRecurringPaymentDetailsId(id);
  };

  const updateJarRecurringPayment = async (params) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.updateSavingJarRecurringPayment(params);
      if (!data.success) throw data.message;
      toast.success(data.message);
      navigate("/jars/own/jar-recurring-pay-list", { replace: true });
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
      if (error?.recurring_start_date?.[0])
        return toast.error(error?.recurring_start_date?.[0]);
      if (error?.recurring_end_date?.[0])
        return toast.error(error?.recurring_end_date?.[0]);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteScheduleItem = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteSavingJarSchedulePayment({
        schedule_payment_id: id,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteRecurringItem = async (id) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteSavingJarRecurringPayment({
        recurring_payment_id: id,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") return toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvitedJarRecurringDetails = async (id) => {
    if (!id) return;
    setShowDetails(true);
    setInvitedViewDetailsLoading(true);
    try {
      const { data } = await apiRequest.getInvitedMemberRecurringDetails({
        jar_id: id,
      });
      if (!data.success) throw data.message;
      const details = data.data;
      if (!details) return setShowDetails(false);
      setRecurringDetails(details);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      setInvitedViewDetailsLoading(false);
    } finally {
      setInvitedViewDetailsLoading(false);
    }
  };

  useEffect(() => {
    const path = location.pathname;
    setPrevPathRedirect(prevPath);
    const flag = prevPath?.includes("/jars/own") && !path.includes("/jars/own");
    if (flag) cancelOwnJarPayment();
    setPrevPath(path);
  }, [location.pathname]);

  return (
    <SavingJarOwnContext.Provider
      value={{
        reloadOwnJar,
        activeJarList,
        inactiveJarList,
        ownJarStatistics,
        loadingOwnJar,
        searchName,
        resetSearchName,
        handleSearchName,

        loadingSharedJar,
        activeSharedJarList,
        inactiveSharedJarList,
        sharedJarStatistics,
        reloadSharedJar,
        searchSharedName,
        resetSearchSharedName,
        handleSearchSharedName,

        loadingInvitedJar,
        activeInvitedJarList,
        inactiveInvitedJarList,
        reloadInvitedJar,
        searchInvitedName,
        resetSearchInvitedName,
        handleSearchInvitedName,

        handleStoreJarId,
        jarId,
        jarData,
        handleTabList,
        tabName,
        handleEditJarData,
        editJar,

        setCurrentPage,
        cancelOwnJarPayment,
        handleCreatedJarData,
        createdJarData,
        prevPathRedirect,
        sendCreds,
        handleSendJarSchedule,
        handleInstantPayment,
        handleRecurringPayment,
        handleRecurringSendPayment,
        handleInstantPaymentForAddAmount,
        handleSendJarScheduleForAddAmount,
        handleRecurringPaymentForAddAmount,
        handleRecurringPaymentForSharedUser,
        handleRecurringPaymentForAddedMember,
        handleRecurringPaymentForAddAmountToPay,
        handleRecurringPaymentForAddAmountToPayForDate,
        handleRecurringSendPaymentForDate,
        handleRecurringUpdatePaymentForDate,
        savingJarDetails,
        confirmAcceptOrDeclineTransaction,
        addJarMembers,
        addJarMembersWithRecurringData,
        handleDeleteMember,
        handleShowAllMemberList,
        handleCallbackTransferToWallet,
        handleSetShowTransferToWalletPopup,
        handleScheduledPaymentDetails,
        scheduledPaymentDetails,
        updateJarScheduledPayment,
        setScheduledPaymentDetails,
        handleRecurringPaymentDetails,
        setRecurringPaymentDetails,
        recurringPaymentDetails,
        jarRecurringPaymentDetailsId,
        setRecurringPaymentDetailsId,
        recurringPaymentDetailsId,
        updateJarRecurringPayment,
        deleteScheduleItem,
        deleteRecurringItem,
        handleInvitedJarRecurringDetails,
      }}
    >
      {children}
      <ModalJarTransferWallet
        id="delete-group-member-popup"
        show={showTransferToWalletPopup}
        setShow={setShowTransferToWalletPopup}
        headingImg={"/assets/images/jar-transfer-to-wallet.svg"}
        heading={"Do you really want to transfer to wallet?"}
        subHeading={""}
        handleCallback={handleCallbackTransferToWallet}
      />
      <ModalRecurringPaymentDetails
        id="user-details-popup"
        className="reserved-amount-modal"
        show={showDetails}
        setShow={setShowDetails}
        loading={invitedViewDetailsLoading}
        details={recurringDetails}
        onClose={() => setShowDetails(false)}
        allowClickOutSide={true}
      />
    </SavingJarOwnContext.Provider>
  );
};

export default SavingJarOwnProvider;
