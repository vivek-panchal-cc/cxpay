import React from "react";
import ContentLoader from "react-content-loader";

const LoaderActivityDetail = (props) => {
  return (
    <ContentLoader height={320} width={"100%"} {...props}>
      <rect x="0" y="15" rx="5" ry="5" width="100%" height="100" />
      <rect x="3%" y="150" rx="5" ry="5" width="20%" height="20" />
      <rect x="60%" y="150" rx="5" ry="5" width="30%" height="20" />
      <rect x="3%" y="190" rx="5" ry="5" width="20%" height="20" />
      <rect x="60%" y="190" rx="5" ry="5" width="30%" height="20" />
      <rect x="3%" y="230" rx="5" ry="5" width="20%" height="20" />
      <rect x="60%" y="230" rx="5" ry="5" width="30%" height="20" />
      <rect x="3%" y="280" rx="5" ry="5" width="45%" height="40" />
      <rect x="53%" y="280" rx="5" ry="5" width="40%" height="40" />
    </ContentLoader>
  );
};

export default LoaderActivityDetail;
