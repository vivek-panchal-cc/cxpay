import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useInvitedContacts = ({ page = 1, search = "" }) => {
  const [loading, setLoading] = useState(false);
  const [listInvitedContacts, setListInvitedContacts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveInvitedContacts = async (page = 1, search = "") => {
    setLoading(true);
    try {
      const { data } = await apiRequest.invitedContactsList({ page, search });
      if (!data.success) throw data.message;
      const { contacts = [], pagination } = data.data || {};
      setListInvitedContacts(contacts || []);
      setPagination(pagination);
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        setListInvitedContacts([]);
        setPagination({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search === "") {
      retrieveInvitedContacts(page, search);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveInvitedContacts(page, search);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [page, search.trim(), reloadFlag]);

  return [
    loading,
    pagination,
    listInvitedContacts,
    setListInvitedContacts,
    reload,
  ];
};

export default useInvitedContacts;
