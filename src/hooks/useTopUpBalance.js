import { useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const useTopUpBalance = () => {
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState({
    commission_amount: "",
    recharge_amount: "",
  });

  const getBalance = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getMonthlyRechargeTotal();
      if (!data.success) throw data.message;
      const { commission_amount, recharge_amount } = data.data || {};
      setBalance({
        commission_amount: commission_amount,
        recharge_amount: recharge_amount,
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

export default useTopUpBalance;
