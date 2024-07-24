import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "helpers/apiRequests";

const CmsContext = createContext();

export const CmsProvider = ({ children }) => {
  const [cmsPages, setCmsPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch CMS pages when the component mounts
    const fetchCMSPages = async () => {
      try {
        const response = await apiRequest.getCMSPageLists();
        const { data } = response.data;

        if (data && data.cms_pages) {
          setCmsPages(data.cms_pages);
        }
      } catch (error) {
        console.error("Error fetching CMS pages:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCMSPages();
  }, []);

  return (
    <CmsContext.Provider value={{ cmsPages, loading, error }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => {
  return useContext(CmsContext);
};
