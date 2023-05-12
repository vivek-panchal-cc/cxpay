import React, { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useSchedulePayments = () => {
  const [loading, setLoading] = useState(false);
  const [listPayments, setListPayments] = useState([]);
  const [pagination, setPagination] = useState({});

  const retrieveSchedulePayments = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.listSchedulePayment();
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
    retrieveSchedulePayments();
  }, []);

  return [loading, pagination, listPayments];
};

export default useSchedulePayments;
