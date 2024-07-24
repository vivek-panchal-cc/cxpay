import React from "react";
import ContentLoader from "react-content-loader";

const LoaderWdrawHeader = (props) => {
  return (
    <ContentLoader height={80} width={"100%"} {...props}>
      <rect x="0%" y="5" rx="5" ry="5" width="20%" height="30" />
      <rect x="0%" y="45" rx="5" ry="5" width="12%" height="15" />
      <rect x="90%" y="5" rx="5" ry="5" width="10%" height="15" />
      <rect x="80%" y="30" rx="5" ry="5" width="20%" height="30" />
    </ContentLoader>
  );
};

export default LoaderWdrawHeader;
