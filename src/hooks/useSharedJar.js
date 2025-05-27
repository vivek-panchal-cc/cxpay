import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useSharedJar = ({ search_name = "" }) => {
  const [loading, setLoading] = useState(false);
  const [activeJarList, setActiveJars] = useState([]);
  const [inactiveJarList, setInActiveJars] = useState([]);
  const [jarStatistics, setJarStatistics] = useState({
    active_jar_total_amount: "",
    active_jar_paid_amount: "",
  });
  const [reloadFlag, setReloadFlag] = useState(false);

  const reload = () => {
    setReloadFlag((cs) => !cs);
  };

  const retrieveSharedJarList = async (search_name = "") => {
    setLoading(true);
    let error = null;
    try {
      const { data } = await apiRequest.getUserSharedSavingJar({
        search_name,
      });
      if (!data.success) throw data.message;
      const { active_jars, inactive_jars, jar_statistics } = data.data || {};
      setActiveJars(active_jars);
      setInActiveJars(inactive_jars);
      setJarStatistics(jar_statistics || {});
    } catch (err) {
      error = err;
      if (error?.code === "ERR_CANCELED") {
        setLoading(true);
        return;
      }
      // console.log(error);
      setActiveJars([]);
      setInActiveJars([]);
      setJarStatistics({});
    } finally {
      if (error?.code !== "ERR_CANCELED") {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (search_name === "") {
      retrieveSharedJarList(search_name);
      return;
    }
    const timeOut = setTimeout(() => {
      retrieveSharedJarList(search_name);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [search_name?.trim(), reloadFlag]);

  return [loading, activeJarList, inactiveJarList, jarStatistics, reload];
};

export default useSharedJar;
