import React from "react";
import ContentLoader from "react-content-loader";

const LoaderMerchant = (props) => {
  return (
    <ContentLoader height={65} width={"100%"} {...props}>
      <circle cx="5%" cy="30" r="24" />
      <rect x="13%" y="20" rx="5" ry="5" width="24%" height="20" />
      <rect x="55%" y="10" rx="10" ry="10" width="5%" height="40" />
      <rect x="73%" y="15" rx="5" ry="5" width="7%" height="30" />
      <rect x="81%" y="15" rx="5" ry="5" width="7%" height="30" />
      <rect x="89%" y="15" rx="5" ry="5" width="7%" height="30" />
    </ContentLoader>
  );
};

export default LoaderMerchant;
