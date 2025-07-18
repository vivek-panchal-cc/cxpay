import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useJarMemberList = ({ jar_id = "", search_name = "" }) => {
  const [loading, setLoading] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveSavingJarMemberList = async (jar_id = "", search_name = "") => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getSavingJarMemberList({
        jar_id,
        search_name,
      });
      if (!data.success) throw data.message;
      setMemberList(data.data || {});
    } catch (error) {
      console.log(error);
      setMemberList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search_name === "") {
      retrieveSavingJarMemberList(jar_id, search_name);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveSavingJarMemberList(jar_id, search_name);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [jar_id, search_name?.trim(), reloadFlag, jar_id]);

  return [loading, memberList, reload];
};

export default useJarMemberList;
