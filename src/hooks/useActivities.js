import React, { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useActivities = ({
  page = 1,
  search = "",
  start_date = "",
  end_date = "",
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
    start_date = "",
    end_date = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.activityList({
        page,
        search,
        start_date,
        end_date,
      });
      if (!data.success) throw data.message;
      const { transactions, pagination } = data.data || {};
      setListActivities(transactions);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
      setListActivities([]);
      setPagination({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveListActivities(page, search, start_date, end_date);
  }, [page, search, start_date, end_date, reloadFlag]);

  return [loading, pagination, listActivities, reload];
};

export default useActivities;
