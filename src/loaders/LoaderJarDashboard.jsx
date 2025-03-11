import React from "react";
import ContentLoader from "react-content-loader";

const LoaderJarDashboard = (props) => {
  return (
    <ContentLoader
      height={props?.height}
      width={"100%"}
      style={{ borderRadius: "12px" }}
      foregroundColor="#7a59af"
      speed={2}
      {...props}
    >
      <rect
        rx={props?.rx || "5"}
        ry={props?.ry || "5"}
        width={props?.width}
        height={props?.height}
      />
    </ContentLoader>
  );
};

export default LoaderJarDashboard;
