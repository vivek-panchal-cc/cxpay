import React from "react";
import ContentLoader from "react-content-loader";

const LoaderContact = (props) => {
  return (
    <ContentLoader height={65} width={"100%"} {...props}>
      <rect x="3%" y="20" rx="5" ry="5" width="2%" height="20" />
      <circle cx="9%" cy="30" r="24" />
      <rect x="13%" y="15" rx="5" ry="5" width="12%" height="20" />
      <rect x="81%" y="15" rx="5" ry="5" width="7%" height="30" />
      <rect x="89%" y="15" rx="5" ry="5" width="7%" height="30" />
    </ContentLoader>
  );
};

export default LoaderContact;
