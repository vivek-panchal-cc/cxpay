import { apiRequest } from "helpers/apiRequests";
import { useState, useEffect } from "react";

const useCardColors = () => {
  const [colors, setColors] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiRequest.getCardColor();
        if (!data.success) throw data.message;
        setColors(data.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return [colors];
};

export default useCardColors;
