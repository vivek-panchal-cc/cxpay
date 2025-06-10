import React from "react";
import ContentLoader from "react-content-loader";

const LoaderParagraphContents = (props) => (
  <ContentLoader
    speed={2}
    width={"100%"}
    height={"100%"}
    viewBox="0 0 400 100"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    {...props}
  >
    <rect x="0" y="0" rx="2" ry="2" width="20%" height="8" />
    <rect x="0" y="15" rx="2" ry="2" width="100%" height="8" />
    <rect x="0" y="30" rx="2" ry="2" width="85%" height="8" />
    <rect x="0" y="45" rx="2" ry="2" width="75%" height="8" />
    <rect x="0" y="60" rx="2" ry="2" width="90%" height="8" />
    <rect x="0" y="75" rx="2" ry="2" width="100%" height="8" />
  </ContentLoader>
);

export default LoaderParagraphContents;
