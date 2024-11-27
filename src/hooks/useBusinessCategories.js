import { apiRequest } from "helpers/apiRequests";
import { useState, useEffect } from "react";

const useBusinessCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getBusinessCategory();
        if (!data.success) throw data.message;
        setCategories(data?.data?.category);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [categories];
};

export default useBusinessCategories;
