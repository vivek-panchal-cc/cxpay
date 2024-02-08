import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { useParams } from "react-router-dom";
import { LoaderContext } from "context/loaderContext";

const CMSContent = (props) => {
  const params = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    const fetchCMSContent = async () => {
      setIsLoading(true);
      try {
        const response = await apiRequest.getCMSPage(params.slug);
        setHtmlContent(response.data);
      } catch (error) {
        console.error("Error fetching CMS content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCMSContent();
  }, [params.slug]);

  return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
};

export default CMSContent;
