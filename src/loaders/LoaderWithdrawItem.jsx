import React from "react";
import ContentLoader from "react-content-loader";

const LoaderWithdrawItem = (props) => {
  const { itemType = "card" } = props;

  return (
    <ContentLoader height={80} width={"100%"} {...props}>
      {itemType === "card" ? (
        <>
          <rect x="2%" y="8" rx="5" ry="5" width="9%" height="60" />
          <rect x="13%" y="20" width="15%" height="10" />
          <rect x="13%" y="40" width="12%" height="10" />
          <rect x="33%" y="30" rx="5" ry="5" width="15%" height="20" />
          <rect x="55%" y="30" rx="5" ry="5" width="7%" height="20" />
          <rect x="72%" y="30" rx="5" ry="5" width="8%" height="20" />
          <rect x="90%" y="30" rx="5" ry="5" width="8%" height="20" />
        </>
      ) : null}
      {itemType === "bank" ? (
        <>
          <circle cx="5%" cy="40" r="30" />
          <rect x="11%" y="30" width="15%" height="20" />
          <rect x="33%" y="30" rx="5" ry="5" width="15%" height="20" />
          <rect x="55%" y="30" rx="5" ry="5" width="10%" height="20" />
          <rect x="90%" y="10" rx="5" ry="5" width="8%" height="20" />
          <rect x="85%" y="40" rx="5" ry="5" width="13%" height="20" />
        </>
      ) : null}
    </ContentLoader>
  );
};

export default LoaderWithdrawItem;
