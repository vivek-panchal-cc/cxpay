import React, { useContext, useEffect, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { useParams } from "react-router-dom";
import LoaderParagraphContents from "loaders/LoaderParagraphContents";

const CMSContent = (props) => {
  const params = useParams();
  const [htmlContent, setHtmlContent] = useState("");
  const [listIsLoading, setListIsLoading] = useState(false);

  useEffect(() => {
    const fetchCMSContent = async () => {
      setListIsLoading(true);
      try {
        const response = await apiRequest.getCMSPage(params.slug);
        setHtmlContent(response.data);
      } catch (error) {
        console.error("Error fetching CMS content:", error);
      } finally {
        setListIsLoading(false);
      }
    };

    fetchCMSContent();
  }, [params.slug]);

  return (
    <div>
      {listIsLoading ? (
        <div>
          {[...Array.from({ length: 3 })].map((_, index) => (
            <LoaderParagraphContents key={`loader-${index}`} />
          ))}
        </div>
      ) : (
        <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
      )}
    </div>
  );
};

export default CMSContent;
