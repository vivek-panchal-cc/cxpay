import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useJarSchedulePayList = ({ page = 1, jar_id = "", search_name = "" }) => {
  const [loading, setLoading] = useState(false);
  const [jarSchedulePayList, setJarSchedulePayList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveSavingJarSchedulePayList = async (
    page = 1,
    jar_id = "",
    search_name = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.transferListSavingJarSchedulePayment({
        page,
        jar_id,
        search_name,
      });
      if (!data.success) throw data.message;
      const { transactions, pagination } = data.data;
      setJarSchedulePayList(transactions);
      setPagination(pagination);
    } catch (error) {
      if (typeof error === "string") {
        setJarSchedulePayList([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search_name === "") {
      retrieveSavingJarSchedulePayList(page, jar_id, search_name);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveSavingJarSchedulePayList(page, jar_id, search_name);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, jar_id, search_name?.trim(), reloadFlag, jar_id]);

  return [loading, pagination, jarSchedulePayList, reload];
};

export default useJarSchedulePayList;
