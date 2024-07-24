import { useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const useBankDetails = () => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState({
    bank_name: "",
    bank_account_number: "",
    swift_code: "",
  });

  const getBankDetails = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getBankDetails();
      if (!data.success) throw data.message;
      setDetails({ ...(data?.data || {}) });
    } catch (error) {
      setDetails({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBankDetails();
  }, []);

  return [loading, details];
};

export default useBankDetails;
