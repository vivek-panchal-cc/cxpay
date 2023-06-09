import React, { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useWithdrawBankList = ({
  page = 1,
  start_date = "",
  end_date = "",
  status = [],
}) => {
  const [loading, setLoading] = useState(false);
  const [listWithdraws, setListWithdraws] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveWithdrawBankList = async (
    page = 1,
    search = "",
    start_date = "",
    end_date = "",
    status = []
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.activityList({
        page,
        search,
        start_date,
        end_date,
        status,
      });
      if (!data.success) throw data.message;
      const { list, pagination } = data.data || {};
      setListWithdraws(list);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        setListWithdraws([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveWithdrawBankList(page, start_date, end_date, status);
  }, [page, start_date, end_date, status, reloadFlag]);

  return [loading, pagination, listWithdraws, reload];
};

export default useWithdrawBankList;
