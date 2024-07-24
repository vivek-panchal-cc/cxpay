import React from "react";
import ContentLoader from "react-content-loader";

const LoaderAddGroupContact = (props) => {
  return (
    <ContentLoader height={"42"} width={"100%"} {...props}>
      <rect y="4" width="30%" height="18" />
      <circle cx="98%" cy="14" r="10" />
    </ContentLoader>
  );
};

export default LoaderAddGroupContact;
