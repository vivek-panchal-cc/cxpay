import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useTopUpActivities = ({
  page = 1,
  search = "",
  from_date = "",
  to_date = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [listActivities, setListActivities] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveListActivities = async (
    page = 1,
    search = "",
    from_date = "",
    to_date = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getTopUpTransactionHistory({
        page,
        search,
        from_date,
        to_date,
      });
      if (!data.success) throw data.message;
      const { transactions, pagination } = data.data || {};
      setListActivities(transactions);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        setListActivities([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search === "") {
      retrieveListActivities(page, search, from_date, to_date);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveListActivities(page, search, from_date, to_date);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, search?.trim(), from_date, to_date, reloadFlag]);

  return [loading, pagination, listActivities, reload];
};

export default useTopUpActivities;
