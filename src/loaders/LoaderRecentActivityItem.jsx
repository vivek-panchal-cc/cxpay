import React from "react";
import ContentLoader from "react-content-loader";

const LoaderRecentActivityItem = (props) => {
  return (
    <ContentLoader height={70} width={"100%"} {...props}>
      <circle cx="6%" cy="30" r="26" />
      <rect x="15%" y="15" width="12%" height="10" />
      <rect x="15%" y="33" width="12%" height="10" />
      <rect x="50%" y="20" rx="5" ry="5" width="15%" height="20" />
      <rect x="85%" y="20" rx="5" ry="5" width="10%" height="20" />
    </ContentLoader>
  );
};

export default LoaderRecentActivityItem;
