import React from "react";
import ContentLoader from "react-content-loader";

const LoaderProfileQr = (props) => {
  return (
    <ContentLoader height={"100%"} width={"100%"} {...props}>
      <rect x="0" y="0" rx="15" ry="0" width="100%" height="100%" />
    </ContentLoader>
  );
};

export default LoaderProfileQr;
