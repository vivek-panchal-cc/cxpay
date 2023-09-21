import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LoaderContext } from "./loaderContext";
import { apiRequest } from "helpers/apiRequests";
import useRecurringPayments from "hooks/useRecurringPayments";

export const RecurringPaymentContext = React.createContext({});

const RecurringPaymentProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading, setIsLoading } = useContext(LoaderContext);
  const [upPaymentEntry, setUpPaymentEntry] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loadingPayments, pagination, listPayments, reloadRecurringPayments] =
    useRecurringPayments({
      page: currentPage,
      start_date: startDate,
      end_date: endDate,
    });

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
      reloadRecurringPayments();
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
      await reloadRecurringPayments();
      navigate("/view-recurring-payment", { replace: true });
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
    navigate("/view-recurring-payment", { replace: true });
  };

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <RecurringPaymentContext.Provider
      value={{
        pagination,
        listPayments,
        upPaymentEntry,
        loadingPayments,
        resetDateFilter,
        handleDateFilter,
        setCurrentPage,
        deleteRecurringPayment,
        handleSelectPaymentEntry,
        updateRecurringPayment,
        cancelUpdatePayment,
      }}
    >
      {children}
    </RecurringPaymentContext.Provider>
  );
};

export default RecurringPaymentProvider;
