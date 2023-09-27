import React from "react";
import { Link, useLocation } from "react-router-dom";

const TabsPaymentOptions = (props) => {
  const { className = "", tabsList } = props;
  const location = useLocation();

  return (
    <div className={`${className}`}>
      {tabsList && tabsList?.length > 0
        ? tabsList?.map((tab, index) => {
            const isActive =
              location && location?.pathname === tab?.url ? true : false;
            return (
              <Link
                key={tab?.url || index}
                className={`${isActive ? "active" : ""}`}
                to={tab?.url}
              >
                {tab?.title}
              </Link>
            );
          })
        : null}
    </div>
  );
};

export default TabsPaymentOptions;
