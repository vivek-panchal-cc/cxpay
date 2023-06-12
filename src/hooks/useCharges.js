import { apiRequest } from "helpers/apiRequests";
import { useState, useEffect } from "react";

const useCharges = ({ chargesType = "" }) => {
  const [loading, setLoading] = useState(false);
  const [charges, setCharges] = useState([]);

  // For getting the charges of payment from API
  const getPaymentCharges = async (chargesType = "") => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getCharges(chargesType);
      if (!data.success) throw data.message;
      setCharges(data.data);
    } catch (error) {
      console.log(error);
      setCharges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPaymentCharges(chargesType);
  }, [chargesType]);

  return [loading, charges];
};

export default useCharges;
