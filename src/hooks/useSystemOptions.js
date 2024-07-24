import React, { useLayoutEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

const useSystemOptions = () => {
  const [loading, setLoading] = useState(false);
  const [systemOptions, setSystemOptions] = useState({});

  const getSystemOptions = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getAllSystemOptions();
      if (!data?.success) throw data?.message;
      setSystemOptions(data?.data || {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    getSystemOptions();
  }, []);

  return [loading, systemOptions];
};

export default useSystemOptions;
