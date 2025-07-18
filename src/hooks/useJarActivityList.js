import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useJarActivityList = ({ page = 1, jar_id = "", search_name = "" }) => {
  const [loading, setLoading] = useState(false);
  const [jarActivityList, setJarActivityList] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveSavingJarActivityList = async (
    page = 1,
    jar_id = "",
    search_name = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getSavingJarActivityList({
        page,
        jar_id,
        search_name,
      });
      if (!data.success) throw data.message;
      const { transactions, pagination } = data.data;
      setJarActivityList(transactions);
      setPagination(pagination);
    } catch (error) {
      if (typeof error === "string") {
        setJarActivityList([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search_name === "") {
      retrieveSavingJarActivityList(page, jar_id, search_name);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveSavingJarActivityList(page, jar_id, search_name);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, jar_id, search_name?.trim(), reloadFlag, jar_id]);

  return [loading, pagination, jarActivityList, reload];
};

export default useJarActivityList;
