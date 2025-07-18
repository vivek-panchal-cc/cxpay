import { apiRequest } from "helpers/apiRequests";
import { useState, useEffect } from "react";

const useAppInstall = () => {
  const [appUrl, setAppUrl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.appInstall();
        if (!data.success) throw data.message;
        setAppUrl(data.data || "");
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [appUrl];
};

export default useAppInstall;
