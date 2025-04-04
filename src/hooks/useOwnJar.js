import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useOwnJar = ({ search_name = "" }) => {
  const [loading, setLoading] = useState(false);
  const [activeJarList, setActiveJars] = useState([]);
  const [inactiveJarList, setInActiveJars] = useState([]);
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveOwnJarList = async (search_name = "") => {
    setLoading(true);
    let error = null;
    try {
      const { data } = await apiRequest.getUserOwnSavingJar({
        search_name,
      });
      if (!data.success) throw data.message;
      const { active_jars, inactive_jars } = data.data || {};
      setActiveJars(active_jars);
      setInActiveJars(inactive_jars);
    } catch (err) {
      error = err;
      if (error?.code === "ERR_CANCELED") {
        setLoading(true);
        return;
      }
      // console.log(error);
      setActiveJars([]);
      setInActiveJars([]);
    } finally {
      if (error?.code !== "ERR_CANCELED") {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (search_name === "") {
      retrieveOwnJarList(search_name);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveOwnJarList(search_name);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [search_name?.trim(), reloadFlag]);

  return [loading, activeJarList, inactiveJarList, reload];
};

export default useOwnJar;
