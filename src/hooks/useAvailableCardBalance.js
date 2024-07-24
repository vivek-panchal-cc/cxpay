import React, { useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const useAvailableCardBalance = () => {
  const [loading, setLoading] = useState(false);
  const [cardBalance, setCardBalance] = useState({
    remaining_amount: "",
    bank_withdraw: "",
  });

  const getAvailableCardBalance = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.availableCardBalance();
      if (!data.success) throw data.message;
      const { remaining_amount, bank_withdraw } = data.data || {};
      setCardBalance({ remaining_amount, bank_withdraw });
    } catch (error) {
      console.log(error);
      setCardBalance({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAvailableCardBalance();
  }, []);

  return [loading, cardBalance];
};

export default useAvailableCardBalance;
