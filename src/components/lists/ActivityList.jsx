import React, { useEffect, useState } from "react";
import ActivityItem from "../items/ActivityItem";
import LoaderRecentActivityItem from "loaders/LoaderRecentActivityItem";

const ActivityList = (props) => {
  const { classNameList = "", loading, activitiesList } = props;
  const [activitiesDateBind, setActivitiesDateBind] = useState({});

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
        Object.keys(activitiesDateBind)?.map((key) => (
          <div className="tab-content-block-part" key={key}>
            <p>{key}</p>
            <ul className={`activity-lw-main ${classNameList}`}>
              {activitiesDateBind[key]?.map((activity, index) => {
                return (
                  <ActivityItem
                    key={activity?.id || index}
                    activityDetails={activity}
                    handleClick={() => {}}
                  />
                );
              })}
            </ul>
          </div>
        ))
      )}
    </div>
  );
};

export default ActivityList;
