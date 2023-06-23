import React from "react";
import ContentLoader from "react-content-loader";

const LoaderDiv = (props) => {
  return (
    <ContentLoader height={props?.height} width={"100%"}>
      <rect rx="5" ry="5" width="2%" height="20" {...props} />
    </ContentLoader>
  );
};

export default LoaderDiv;
