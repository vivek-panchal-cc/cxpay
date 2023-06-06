import React from "react";
import { Link, useLocation } from "react-router-dom";

const TabsWithdrawOptions = (props) => {
  const { tabsList } = props;
  const location = useLocation();

  return (
    <div>
      <ul className="nav nav-tabs">
        {tabsList && tabsList?.length > 0
          ? tabsList?.map((tab, index) => {
              const isActive =
                location && location?.pathname === tab?.url ? true : false;
              console.log(location.pathname);
              return (
                <li className="nav-item" key={tab?.url || index}>
                  <Link
                    className={`nav-link ${isActive ? "active" : ""}`}
                    to={tab?.url}
                  >
                    {tab?.title}
                  </Link>
                </li>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default TabsWithdrawOptions;
