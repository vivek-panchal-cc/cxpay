import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useRecurringPayments = ({ page = 1, from_date = "", to_date = "" }) => {
  const [loading, setLoading] = useState(false);
  const [listPayments, setListPayments] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveRecurringPayments = async (
    page = 1,
    from_date = "",
    to_date = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.listRecurringPayment({
        page,
        from_date,
        to_date,
      });
      if (!data.success) throw data.message;
      const { schedule_payments, pagination } = data.data || {};
      setListPayments(schedule_payments);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
      setListPayments([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveRecurringPayments(page, from_date, to_date);
  }, [page, from_date, to_date, reloadFlag]);

  return [loading, pagination, listPayments, reload];
};

export default useRecurringPayments;
