import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useMerchants = ({
  page = 1,
  search = "",
  country = "",
  category = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [listMerchants, setListMerchants] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  // For getting merchants list
  const retrieveMerchants = async (
    page = 1,
    search = "",
    country = "",
    category = ""
  ) => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getMerchantList({
        page,
        search,
        country,
        category,
      });
      if (!data.success) throw data.message;
      const { customers = [], pagination } = data.data || {};
      setPagination(pagination);
      setListMerchants(customers || []);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        setListMerchants([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search === "") {
      retrieveMerchants(page, search, country, category);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveMerchants(page, search, country, category);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, search.trim(), country.trim(), category.trim(), reloadFlag]);

  return [loading, pagination, listMerchants, setListMerchants, reload];
};

export default useMerchants;
