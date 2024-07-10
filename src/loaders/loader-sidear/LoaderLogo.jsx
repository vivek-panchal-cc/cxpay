import React from "react";
import ContentLoader from "react-content-loader";

const LoaderLogo = () => (
  <ContentLoader
    width={"100%"}
    height={200}
    backgroundColor="#0978f6"
    foregroundColor="#2a81c5"
  >
    <rect x="20" y="20" rx="10" ry="10" width="80%" height="80" />
    <rect x={(100 - 60) / 2 + '%'} y="110" rx="5" ry="5" width="60%" height="30" />
  </ContentLoader>
);

export default LoaderLogo;
