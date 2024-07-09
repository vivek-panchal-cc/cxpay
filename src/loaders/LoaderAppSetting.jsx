import React from "react";
import ContentLoader from "react-content-loader";

const LoaderAppSetting = () => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={"100%"}
    viewBox="0 0 400 50"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="0" y="0" rx="10" ry="10" width="100%" height="50" />
  </ContentLoader>
);

export default LoaderAppSetting;
