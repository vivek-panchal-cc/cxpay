import { useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const useBalance = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState({
    available: "",
    lock: "",
  });

  const getBalance = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getBalance();
      if (!data.success) throw data.message;
      const { available_balance, lock_amount } = data.data || {};
      setBalance({
        available: available_balance || "",
        lock: lock_amount || "",
      });
    } catch (error) {
      setBalance({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBalance();
  }, []);

  return [loading, balance];
};

export default useBalance;
