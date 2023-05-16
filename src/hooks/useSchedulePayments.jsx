import React, { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useSchedulePayments = ({ page = 1, start_date = "", end_date = "" }) => {
  const [loading, setLoading] = useState(false);
  const [listPayments, setListPayments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveSchedulePayments = async (
    page = 1,
    start_date = "",
    end_date = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.listSchedulePayment({
        page,
        start_date,
        end_date,
      });
      if (!data.success) throw data.message;
      const { schedule_payments, pagination } = data.data || {};
      setListPayments(schedule_payments);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveSchedulePayments(page, start_date, end_date);
  }, [page, start_date, end_date, reloadFlag]);

  return [loading, pagination, listPayments, reload];
};

export default useSchedulePayments;
