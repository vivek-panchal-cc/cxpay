import React, { useEffect, useState } from "react";
import LoaderRecentActivityItem from "loaders/LoaderRecentActivityItem";
import TopUpActivityItem from "../items/TopUpActivityItem";

const TopUpActivityList = (props) => {
  const { classNameList = "", loading, activitiesList } = props;
  const [activitiesDateBind, setActivitiesDateBind] = useState({});
  const mainDivStyle = {
    textAlign: "center",
    textTransform: "capitalize",
    color: "#363853",
    fontFamily: "Visby Round CF",
    fontStyle: "normal",
    fontWeight: "700",
  };

  const visibility = {
    visibility: "hidden",
  };

  const combinedStyle = { ...mainDivStyle, ...visibility };

  useEffect(() => {
    if (!activitiesList || activitiesList.length <= 0) return;
    const activityDateList = {};
    activitiesList?.map((item) => {
      const { date } = item || {};
      // const [dd, mm, yr] = date?.split("/") || [];
      const [yr, mm, dd] = date?.split(" ")[0].split("-") || [];
      if (!dd || !mm || !yr) return;
      const dt = new Date(`${yr}-${mm}-${dd}`);
      const month = dt.toLocaleDateString("default", { month: "long" });
      const dtList = activityDateList[`${month} ${yr}`] || [];
      activityDateList[`${month} ${yr}`] = [...dtList, item];
      return item;
    });
    setActivitiesDateBind(activityDateList);
  }, [activitiesList]);

  return (
    <div className="tab-inner-wrap">
      {/*    <!-- tab-content-block-part starts -->*/}
      {loading ? (
        <div className="pt-4">
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <LoaderRecentActivityItem key={item} />
          ))}
        </div>
      ) : (
        Object.keys(activitiesDateBind)?.map((key, index) => (
          <div className="tab-content-block-part" key={key}>
            {/* <p>{key}</p> */}
            <ul className={`activity-lw-main ${classNameList}`}>
              <table className="border-none full-width activity-list-table agent-recent-activity-list-table">
                {index === 0 ? (
                  <thead>
                    <tr>
                      <th className="activity-month">{key}</th>
                      <th style={mainDivStyle} className="topup-table-header">
                        Customer Amount
                      </th>
                      <th style={mainDivStyle} className="topup-table-header">
                        Commission
                      </th>
                      <th style={mainDivStyle} className="topup-table-header">
                        Total Amount
                      </th>
                      <th></th>
                    </tr>
                  </thead>
                ) : (
                  index !== 0 && (
                    <thead>
                      <tr>
                        <th className="activity-month">{key}</th>
                        <th
                          style={combinedStyle}
                          className="topup-table-header"
                        >
                          Customer Amount
                        </th>
                        <th
                          style={combinedStyle}
                          className="topup-table-header"
                        >
                          Commission
                        </th>
                        <th
                          style={combinedStyle}
                          className="topup-table-header"
                        >
                          Total Amount
                        </th>
                        <th></th>
                      </tr>
                    </thead>
                  )
                )}
                <tbody>
                  {activitiesDateBind[key]?.map((activity, index) => {
                    return (
                      <TopUpActivityItem
                        key={activity?.id || index}
                        activityDetails={activity}
                        handleClick={() => {}}
                        visibleIcon={false}
                      />
                    );
                  })}
                </tbody>
              </table>
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default TopUpActivityList;
