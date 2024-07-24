import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "./loaderContext";

const FaqContext = createContext();

export const FaqProvider = ({ children }) => {
  const [faqList, setFaqList] = useState([]);
  const [error, setError] = useState(null);
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    // Fetch CMS pages when the component mounts
    const fetchFaqList = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
      }
    };

    fetchFaqList();
  }, []);

  return (
    <FaqContext.Provider value={{ faqList, setIsLoading, error }}>
      {children}
    </FaqContext.Provider>
  );
};

export const useFaq = () => {
  return useContext(FaqContext);
};
