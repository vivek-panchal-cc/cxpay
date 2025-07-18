import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const FaqContext = createContext();

export const FaqProvider = ({ children }) => {
  const [faqList, setFaqList] = useState([]);
  const [error, setError] = useState(null);
  const [listIsLoading, setListIsLoading] = useState(false);

  useEffect(() => {
    // Fetch CMS pages when the component mounts
    const fetchFaqList = async () => {
      setListIsLoading(true);
      try {
        const { data } = await apiRequest.getFaqList();
        const sortedFaqList = data?.result?.sort(
          (a, b) => a.sequence - b.sequence
        );
        const filteredFaqList = sortedFaqList?.filter(
          (item) => item.status !== false
        );

        setFaqList(filteredFaqList);
      } catch (error) {
        console.error("Error fetching FAQ list:", error);
        setError(error);
      } finally {
        setListIsLoading(false);
      }
    };

    fetchFaqList();
  }, []);

  return (
    <FaqContext.Provider value={{ faqList, listIsLoading, error }}>
      {children}
    </FaqContext.Provider>
  );
};

export const useFaq = () => {
  return useContext(FaqContext);
};
