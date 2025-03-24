import React from "react";
import { useNavigate } from "react-router-dom";
import JarSchedulePayList from "components/lists/JarSchedulePayList";
import JarRecurringPayList from "components/lists/JarRecurringPayList";

const RecentJarRecurringPay = (props) => {
  const { loading, jarRecurringPayList = [], handleShowAll } = props;
  const navigate = useNavigate();

  return (
    <div className="dashboard-recent-activity-sec">
      <div className="recent-activity-sec d-flex justify-content-between">
        <div className="title-content-wrap">
          <h3>
            {jarRecurringPayList?.length > 1
              ? "Recurring Payments"
              : "Recurring Payment"}
          </h3>
        </div>
        {jarRecurringPayList?.length > 0 && (
          <a className="action-button" onClick={handleShowAll}>
            Show All
          </a>
        )}
      </div>
      {/*  <!-- recent activity section starts -->*/}
      {/* <div className="activity-tab-sec"> */}
      <div className="activity-tab-inner">
        <div className="activity-tab-wrap">
          <div className="tab-content" id="nav-tabContent">
            {/* <!-- History tab content starts --> */}
            <div className="tab-pane fade show active" id="nav-home">
              <JarRecurringPayList
                classNameList="recent-act-lw-main"
                loading={loading}
                jarRecurringPayList={jarRecurringPayList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentJarRecurringPay;
