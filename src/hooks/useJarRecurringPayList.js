import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useJarRecurringPayList = ({
  page = 1,
  jar_id = "",
  search_name = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [jarRecurringPayList, setJarRecurringPayList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveSavingJarRecurringPayList = async (
    page = 1,
    jar_id = "",
    search_name = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.transferListSavingJarRecurringPayment({
        page,
        jar_id,
        search_name,
      });
      if (!data.success) throw data.message;
      const { transactions, pagination } = data.data;
      setJarRecurringPayList(transactions);
      setPagination(pagination);
    } catch (error) {
      if (typeof error === "string") {
        setJarRecurringPayList([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search_name === "") {
      retrieveSavingJarRecurringPayList(page, jar_id, search_name);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveSavingJarRecurringPayList(page, jar_id, search_name);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, jar_id, search_name?.trim(), reloadFlag, jar_id]);

  return [loading, pagination, jarRecurringPayList, reload];
};

export default useJarRecurringPayList;
