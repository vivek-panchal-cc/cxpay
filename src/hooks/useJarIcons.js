import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

function useJarIcons() {
  const [jarIcon, setJarIcon] = useState([]);
  const [jarIconLoading, setJarIconLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setJarIconLoading(true);
      try {
        const { data } = await apiRequest.getSavingJarIcons();
        if (!data.success) throw data.message;
        setJarIcon(data?.data);
      } catch (error) {
        console.log(error);
      } finally {
        setJarIconLoading(false);
      }
    })();
  }, []);

  return [jarIcon, jarIconLoading];
}

export default useJarIcons;
