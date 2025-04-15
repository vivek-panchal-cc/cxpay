import React from "react";
import ContentLoader from "react-content-loader";

const LoaderJarWdrawHeader = (props) => {
  return (
    <ContentLoader height={80} width={"100%"} {...props}>
      <rect x="10%" y="5" rx="5" ry="5" width="80%" height="30" />
      <rect x="20%" y="45" rx="5" ry="5" width="60%" height="15" />
    </ContentLoader>
  );
};

export default LoaderJarWdrawHeader;
