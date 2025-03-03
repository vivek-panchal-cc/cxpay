import { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";

function useJarCategories() {
  const [jarCategory, setJarCategory] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getSavingJarCategories();
        if (!data.success) throw data.message;
        setJarCategory(data?.data?.category);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [jarCategory];
}

export default useJarCategories;
