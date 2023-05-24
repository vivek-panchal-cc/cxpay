import React, { useEffect, useState } from "react";
import ActivityItem from "../items/ActivityItem";
import LoaderRecentActivityItem from "loaders/LoaderRecentActivityItem";
import { uniqueId } from "helpers/commonHelpers";

const ActivityList = (props) => {
  const { classNameList = "", loading, activitiesList } = props;
  const [activitiesDateBind, setActivitiesDateBind] = useState({});

  useEffect(() => {
    if (!activitiesList || activitiesList.length <= 0) return;
    const activityDateList = {};
    activitiesList?.map((item) => {
      const [dd, mm, yr] = item?.date?.split("/");
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
              {activitiesDateBind[key]?.map((activity) => {
                const uid = uniqueId();
                return (
                  <ActivityItem
                    key={uid}
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
