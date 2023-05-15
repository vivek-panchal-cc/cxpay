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

  const [loadingPayments, pagination, listPayments, reloadSchedulePayments] =
    useSchedulePayments();
  const [upPaymentEntry, setUpPaymentEntry] = useState(null);

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
      console.log(data);
      setUpPaymentEntry(data.data);
      navigate("/view-schedule-payment/update");
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateScheduledPayment = async () => {
    setIsLoading(true);
    try {
      const { data } = apiRequest.updateSchedulePayment({
        schedule_payment_id: upPaymentEntry.id,
        schedule_date: "",
        overall_specification: "",
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

  return (
    <ScheduledPaymentContext.Provider
      value={{
        loadingPayments,
        pagination,
        listPayments,
        upPaymentEntry,
        deleteScheduledPayment,
        handleSelectPaymentEntry,
        updateScheduledPayment,
      }}
    >
      {children}
    </ScheduledPaymentContext.Provider>
  );
};

export default ScheduledPaymentProvider;
