import React from "react";
import ContentLoader from "react-content-loader";

const LoaderRecurringCards = (props) => {
  return (
    <ContentLoader height={"100%"} width={"100%"} {...props}>
      <rect x="2%" y="20" rx="5" ry="5" width="45%" height="100%" />
      <rect x="55%" y="20" rx="5" ry="5" width="45%" height="100%" />
    </ContentLoader>
  );
};

export default LoaderRecurringCards;
