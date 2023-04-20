import React from "react";
import ContentLoader from "react-content-loader";

const LoaderSendContact = (props) => {
  return (
    <ContentLoader
      width={140}
      height={180}
      viewBox="0 0 140 180"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="70" cy="73" r="58" />
      <rect x="20" y="160" rx="5" ry="5" width="100" height="10" />
    </ContentLoader>
  );
};

export default LoaderSendContact;
