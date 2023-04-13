import React from "react";
import ContentLoader from "react-content-loader";

const LoaderSendContact = (props) => {
  const arr = [1, 2, 3, 4, 5, 6];
  return (
    <ContentLoader
      width={140}
      height={212}
      viewBox="0 0 140 212"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <circle cx="70" cy="90" r="58" />
      <rect x="20" y="160" rx="5" ry="5" width="100" height="10" />
    </ContentLoader>
  );
};

export default LoaderSendContact;
