import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { LoaderContext } from "./loaderContext";
import { apiRequest } from "helpers/apiRequests";
import useOwnJar from "hooks/useOwnJar";

export const SavingJarOwnContext = React.createContext({});

const SavingJarOwnProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [prevPathRedirect, setPrevPathRedirect] = useState(null);
  const [prevPath, setPrevPath] = useState();
  const { setIsLoading } = useContext(LoaderContext);
  const [upPaymentEntry, setUpPaymentEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [searchName, setSearchName] = useState("");
  const [endDate, setEndDate] = useState("");
  const [createdJarData, setCreatedJarData] = useState([]);
  const [sendCreds, setSendCreds] = useState({ wallet: [] });

  const [loadingOwnJar, activeJarList, inactiveJarList, reloadOwnJar] =
    useOwnJar({
      search_name: searchName,
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

  const handleDateFilter = (stDate, edDate) => {
    if (!stDate || !edDate) return;
    setStartDate(stDate);
    setEndDate(edDate);
  };

  const deleteRecurringPayment = async (spid) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteRecurringPayment({
        recurring_payment_id: spid,
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

  const handleSelectPaymentEntry = async (paymentEntryId) => {
    if (!paymentEntryId) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.viewRecurringPayment({
        recurring_payment_id: paymentEntryId,
      });
      if (!data.success) throw data.message;
      setUpPaymentEntry(data.data);
      navigate("/view-recurring-payment/update");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecurringPayment = async (params) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.updateRecurringPayment(params);
      if (!data.success) throw data.message;
      toast.success(data.message);
      await reloadOwnJar();
      navigate("/view-recurring-payment", { replace: true });
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatedJarData = (data) => {
    if (!data) return;
    setCreatedJarData(data);
  };

  const cancelOwnJarPayment = () => {
    setCreatedJarData([]);
    setUpPaymentEntry(null);
    setCurrentPage(1);
    setStartDate("");
    setSearchName("");
    setEndDate("");
    setSendCreds({ wallet: [] });
  };

  const resetDateFilter = () => {
    setStartDate("");
    setSearchName("");
    setEndDate("");
  };

  const handleSearchName = (data) => {
    if (!data) return;
    setSearchName(data);
  };

  const resetSearchName = () => {
    setSearchName("");
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
        upPaymentEntry,
        loadingOwnJar,
        searchName,
        resetSearchName,
        handleSearchName,
        resetDateFilter,
        handleDateFilter,
        setCurrentPage,
        deleteRecurringPayment,
        handleSelectPaymentEntry,
        updateRecurringPayment,
        cancelOwnJarPayment,
        handleCreatedJarData,
        createdJarData,
        prevPathRedirect,
        sendCreds,
        handleSendJarSchedule,
        handleInstantPayment,
        handleRecurringPayment,
        handleRecurringSendPayment,
      }}
    >
      {children}
    </SavingJarOwnContext.Provider>
  );
};

export default SavingJarOwnProvider;
