import React from "react";
import ContentLoader from "react-content-loader";

const LoaderRecentContact = (props) => {
  return (
    <ContentLoader
      width={75}
      height={72}
      viewBox="0 0 75 72"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="45" cy="30" r="30" />
      <rect x="15" y="67" rx="5" ry="5" width="60" height="5" />
    </ContentLoader>
  );
};

export default LoaderRecentContact;
