import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "./loaderContext";
import { apiRequest } from "helpers/apiRequests";
import useSchedulePayments from "hooks/useSchedulePayments";

export const ScheduledPaymentContext = React.createContext({});

const ScheduledPaymentProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [upPaymentEntry, setUpPaymentEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loadingPayments, pagination, listPayments, reloadSchedulePayments] =
    useSchedulePayments({
      page: currentPage,
      start_date: startDate,
      end_date: endDate,
    });

  const handleDateFilter = (stDate, edDate) => {
    if (!stDate || !edDate) return;
    setStartDate(stDate);
    setEndDate(edDate);
  };

  const deleteScheduledPayment = async (spid) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.deleteSchedulePayment({
        schedule_payment_id: spid,
      });
      if (!data.success) throw data.message;
      toast.success(data.message);
      reloadSchedulePayments();
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
      const { data } = await apiRequest.viewSchedulePayment({
        schedule_payment_id: paymentEntryId,
      });
      if (!data.success) throw data.message;
      setUpPaymentEntry(data.data);
      navigate("/view-schedule-payment/update");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateScheduledPayment = async (params) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.updateSchedulePayment(params);
      if (!data.success) throw data.message;
      toast.success(data.message);
      await reloadSchedulePayments();
      navigate("/view-schedule-payment", { replace: true });
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelUpdatePayment = () => {
    setUpPaymentEntry(null);
    setCurrentPage(1);
    setStartDate("");
    setEndDate("");
    navigate("/view-schedule-payment", { replace: true });
  };

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <ScheduledPaymentContext.Provider
      value={{
        pagination,
        listPayments,
        upPaymentEntry,
        loadingPayments,
        resetDateFilter,
        handleDateFilter,
        setCurrentPage,
        deleteScheduledPayment,
        handleSelectPaymentEntry,
        updateScheduledPayment,
        cancelUpdatePayment,
      }}
    >
      {children}
    </ScheduledPaymentContext.Provider>
  );
};

export default ScheduledPaymentProvider;
