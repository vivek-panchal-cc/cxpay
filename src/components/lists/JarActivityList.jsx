import React, { useEffect, useState } from "react";
import LoaderRecentActivityItem from "loaders/LoaderRecentActivityItem";
import JarActivityItem from "components/items/JarActivityItem";

const JarActivityList = (props) => {
  const { classNameList = "", loading, jarActivityList } = props;
  const [activitiesDateBind, setActivitiesDateBind] = useState({});

  useEffect(() => {
    if (!jarActivityList || jarActivityList.length <= 0) return;
    const activityDateList = {};
    jarActivityList?.map((item) => {
      const { created_at } = item || {};
      // const [dd, mm, yr] = date?.split("/") || [];
      const [yr, mm, dd] = created_at?.split(" ")[0].split("-") || [];
      if (!dd || !mm || !yr) return;
      const dt = new Date(`${yr}-${mm}-${dd}`);
      const month = dt.toLocaleDateString("default", { month: "long" });
      const dtList = activityDateList[`${month} ${yr}`] || [];
      activityDateList[`${month} ${yr}`] = [...dtList, item];
      return item;
    });
    setActivitiesDateBind(activityDateList);
  }, [jarActivityList]);

  return (
    <div className="tab-inner-wrap">
      {/*    <!-- tab-content-block-part starts -->*/}
      {loading ? (
        <div className="pt-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <LoaderRecentActivityItem key={item} />
          ))}
        </div>
      ) : (
        jarActivityList?.length > 0 && (
          <div className="tab-content-block-part">
            {/* <p>{key}</p> */}
            <ul className={`activity-lw-main overflow-auto ${classNameList}`}>
              {jarActivityList.map((activity, index) => {
                return (
                  <JarActivityItem
                    key={activity?.id || index}
                    activityDetails={activity}
                    handleClick={() => {}}
                  />
                );
              })}
            </ul>
          </div>
        )
      )}
      {!loading
        ? Object.keys(jarActivityList || {}).length <= 0 && (
            <div className="text-center">
              <p className="loading-data">Jar activities not found</p>
            </div>
          )
        : null}
    </div>
  );
};

export default JarActivityList;
