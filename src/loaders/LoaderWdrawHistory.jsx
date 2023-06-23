import React from "react";
import ContentLoader from "react-content-loader";

const LoaderWdrawHistory = (props) => {
  return (
    <ContentLoader height={40} width={"100%"} {...props}>
      <rect x="0%" y="0" rx="5" ry="5" width="20%" height="15" />
      <rect x="33%" y="0" rx="5" ry="5" width="30%" height="15" />
      <rect x="33%" y="20" rx="5" ry="5" width="20%" height="15" />
      <rect x="70%" y="0" rx="5" ry="5" width="10%" height="15" />
      <rect x="85%" y="0" rx="5" ry="5" width="10%" height="15" />
    </ContentLoader>
  );
};

export default LoaderWdrawHistory;
