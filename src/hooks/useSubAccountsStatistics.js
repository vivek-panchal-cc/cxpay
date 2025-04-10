import { useState, useEffect, useMemo } from "react";
import { apiRequest } from "helpers/apiRequests";

const useSubAccountsStatistics = () => {
  const [loading, setLoading] = useState(false);
  const [ownstatistics, setOwnStatistics] = useState({
    my_deposit: "",
    shared_deposit: "",
    my_reserved_balance: "",
    shared_reserved_balance: "",
  });
  const [sharedstatistics, setSharedStatistics] = useState({
    my_share: "",
    shared_share: "",
    my_shared_reserve: "",
    shared_reserved_share: "",
  });

  const getSubAccountsStatistics = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.subAccountsStatisticsForDashboard();
      if (!data.success) throw data.message;
      const { own_jar_data, share_jar_data } = data.data || {};
      const {
        my_deposit,
        shared_deposit,
        my_reserved_balance,
        shared_reserved_balance,
      } = own_jar_data;
      const {
        my_share,
        shared_share,
        my_shared_reserve,
        shared_reserved_share,
      } = share_jar_data;
      setOwnStatistics({
        my_deposit: my_deposit,
        shared_deposit: shared_deposit,
        my_reserved_balance: my_reserved_balance,
        shared_reserved_balance: shared_reserved_balance,
      });
      setSharedStatistics({
        my_share: my_share,
        shared_share: shared_share,
        my_shared_reserve: my_shared_reserve,
        shared_reserved_share: shared_reserved_share,
      });
    } catch (error) {
      setOwnStatistics({});
      setSharedStatistics({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubAccountsStatistics();
  }, []);

  const memoizedStatistics = useMemo(() => {
    return {
      ...ownstatistics,
      ...sharedstatistics,
    };
  }, [ownstatistics, sharedstatistics]);

  return [loading, memoizedStatistics, getSubAccountsStatistics];
};

export default useSubAccountsStatistics;
