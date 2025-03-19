import React, { useEffect, useState } from "react";
import LoaderRecentActivityItem from "loaders/LoaderRecentActivityItem";
import JarSchedulePayItem from "components/items/JarSchedulePayItem";
import JarRecurringPayItem from "components/items/JarRecurringPayItem";

const JarRecurringPayList = (props) => {
  const { classNameList = "", loading, jarRecurringPayList } = props;
  const [activitiesDateBind, setActivitiesDateBind] = useState({});

  useEffect(() => {
    if (!jarRecurringPayList || jarRecurringPayList.length <= 0) return;
    const activityDateList = {};
    jarRecurringPayList?.map((item) => {
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
  }, [jarRecurringPayList]);

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
        jarRecurringPayList?.length > 0 && (
          <div className="tab-content-block-part">
            {/* <p>{key}</p> */}
            <ul className={`activity-lw-main ${classNameList}`}>
              {jarRecurringPayList.map((activity, index) => {
                return (
                  <JarRecurringPayItem
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
        ? Object.keys(jarRecurringPayList || {}).length <= 0 && (
            <div className="text-center">
              <p className="loading-data">Jar recurring payment not found</p>
            </div>
          )
        : null}
    </div>
  );
};

export default JarRecurringPayList;
