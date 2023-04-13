import React from "react";
import ContentLoader from "react-content-loader";

const LoaderSendContactButtons = (props) => {
  const arr = [1, 2, 3, 4, 5, 6];
  return (
    <ContentLoader
      width={260}
      height={50}
      viewBox="0 0 260 50"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      {...props}
    >
      <rect x="5" y="5" rx="5" ry="5" width="104" height="44" />
      <rect x="130" y="5" rx="5" ry="5" width="104" height="44" />
    </ContentLoader>
  );
};

export default LoaderSendContactButtons;
