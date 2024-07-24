import React from "react";
import ContentLoader from "react-content-loader";

const LoaderActivityItem = (props) => {
  return (
    <ContentLoader height={70} width={"100%"} {...props}>
      <circle cx="3.5%" cy="30" r="26" />
      <rect x="9%" y="15" width="12%" height="10" />
      <rect x="9%" y="33" width="12%" height="10" />
      <rect x="35%" y="20" rx="5" ry="5" width="15%" height="20" />
      <rect x="63%" y="20" rx="5" ry="5" width="7%" height="20" />
      <rect x="85%" y="20" rx="5" ry="5" width="10%" height="20" />
    </ContentLoader>
  );
};

export default LoaderActivityItem;
