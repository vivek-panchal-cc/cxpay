import React from "react";
import ContentLoader from "react-content-loader";

function LoaderNotificationDropdown(props) {
  return (
    <ContentLoader viewBox="0 0 260 90" height={90} width={260} {...props}>
      <circle cx="35" cy="40" r="32" />
      <rect x="90" y="10" width="125.5" height="10" />
      <rect x="90" y="30" width="296" height="10" />
      <rect x="90" y="50" width="253.5" height="10" />
      {/* <rect x="100" y="70" width="212.5" height="10" /> */}
    </ContentLoader>
  );
}

export default LoaderNotificationDropdown;
