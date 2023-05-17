import React, { useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const useChartData = () => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState({
    balanceArr: [],
    monthArr: [],
  });

  const getChartData = async () => {
    setLoading(true);
    try {
      const { data } = await apiRequest.getChartData();
      if (!data.success) throw data.message;
      setChartData({
        balanceArr: data.data?.amount || [],
        monthArr: data.data?.date || [],
      });
    } catch (error) {
      console.log(error);
      setChartData({
        balanceArr: [],
        monthArr: [],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return [loading, chartData];
};

export default useChartData;
