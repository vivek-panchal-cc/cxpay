import React from "react";
import ContentLoader from "react-content-loader";

const LoaderLeftWrap = () => (
  <ContentLoader
    width={"100%"}
    height={100}
    backgroundColor="#0978f6"
    foregroundColor="#2a81c5"
  >
    <rect x={(100 - 60) / 2 + '%'} y="40" rx="5" ry="5" width="60%" height="20" />
  </ContentLoader>
);

export default LoaderLeftWrap;
