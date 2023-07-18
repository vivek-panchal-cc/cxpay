import React from "react";
import ContentLoader from "react-content-loader";

const LoaderDiv = (props) => {
  return (
    <ContentLoader height={props?.height} width={"100%"} {...props}>
      <rect
        rx={props?.rx || "5"}
        ry={props?.ry || "5"}
        width={props?.width}
        height={props?.height}
      />
    </ContentLoader>
  );
};

export default LoaderDiv;
