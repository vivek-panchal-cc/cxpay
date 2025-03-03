import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

function useJarIcons() {
  const [jarIcon, setJarIcon] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getSavingJarIcons();
        if (!data.success) throw data.message;
        setJarIcon(data?.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [jarIcon];
}

export default useJarIcons;
