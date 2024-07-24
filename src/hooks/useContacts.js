import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useContacts = ({ page = 1, search = "", user_type = "" }) => {
  const [loading, setLoading] = useState(false);
  const [listContacts, setListContacts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  // For getting contacts list
  const retrieveContacts = async (page = 1, search = "", user_type = "") => {
    setLoading(true);
    try {
      const { data } = await apiRequest.contactsList({ page, search, user_type });
      if (!data.success) throw data.message;
      const { contacts = [], pagination } = data.data || {};
      setPagination(pagination);
      setListContacts(contacts || []);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        setListContacts([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search === "") {
      retrieveContacts(page, search, user_type);
      return;
    }    
    const timeOut = setTimeout(() => {
      retrieveContacts(page, search, user_type);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, search.trim(), user_type.trim(), reloadFlag]);

  return [loading, pagination, listContacts, setListContacts, reload];
};

export default useContacts;
