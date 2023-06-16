import React, { useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

const useWithdrawDetails = ({ transaction_id = "", withdrawType = "" }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({});

  const retrieveWithdrawDetails = async (
    transaction_id = "",
    withdrawType = ""
  ) => {
    setLoading(true);
    try {
      const type = withdrawType?.toLocaleLowerCase();
      let fetcher;
      switch (type) {
        case "card":
          fetcher = apiRequest.cardTransactionsDetails;
          break;
        case "bank":
          fetcher = apiRequest.bankWithdrawDetails;
          break;
        default:
          fetcher = () => {};
      }
      const { data } = await fetcher({
        transaction_id: transaction_id,
      });
      if (!data.success) throw data.message;
      setDetails(data?.data || {});
    } catch (error) {
      console.log(error);
      if (typeof error === "string") {
        toast.error(error);
        setDetails({});
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    retrieveWithdrawDetails(transaction_id, withdrawType);
  }, [transaction_id, withdrawType]);

  return [loading, details];
};

export default useWithdrawDetails;
