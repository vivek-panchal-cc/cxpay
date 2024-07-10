import React from "react";
import ContentLoader from "react-content-loader";

const LoaderBottomLink = () => (
  <ContentLoader
    width={"100%"}
    height={175}
    backgroundColor="#0978f6"
    foregroundColor="#2a81c5"
  >
    <rect x="20" y="20" rx="10" ry="10" width="100%" height="45" />
    <rect x="20" y="75" rx="10" ry="10" width="100%" height="45" />
    <rect x="20" y="130" rx="10" ry="10" width="100%" height="45" />
  </ContentLoader>
);

export default LoaderBottomLink;
