import React from "react";
import ContentLoader from "react-content-loader";

const LoaderActivityProfile = (props) => {
  return (
    <ContentLoader height={"100%"} width={"100%"} {...props}>
      <circle cx="50%" cy="50%" r="50%" />
    </ContentLoader>
  );
};

export default LoaderActivityProfile;
