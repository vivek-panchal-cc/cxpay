import React from "react";
import ContentLoader from "react-content-loader";

const LoaderSendContactButtons = (props) => {
  const arr = [1, 2, 3, 4, 5, 6];
  return (
    <ContentLoader
      width={260}
      height={60}
      viewBox="0 0 260 60"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="5" y="16" rx="5" ry="5" width="104" height="40" />
      <rect x="130" y="16" rx="5" ry="5" width="104" height="40" />
    </ContentLoader>
  );
};

export default LoaderSendContactButtons;
