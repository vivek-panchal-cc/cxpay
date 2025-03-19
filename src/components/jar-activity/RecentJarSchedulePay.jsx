import React from "react";
import { useNavigate } from "react-router-dom";
import JarSchedulePayList from "components/lists/JarSchedulePayList";

const RecentJarSchedulePay = (props) => {
  const { loading, jarSchedulePayList = [], handleShowAll } = props;
  const navigate = useNavigate();

  return (
    <div className="dashboard-recent-activity-sec jar-rec-sch-pay-list">
      <div className="recent-activity-sec d-flex justify-content-between">
        <div className="title-content-wrap">
          <h3>Scheduled Payment</h3>
        </div>
        {jarSchedulePayList?.length > 0 && (
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
              <JarSchedulePayList
                classNameList="recent-act-lw-main"
                loading={loading}
                jarSchedulePayList={jarSchedulePayList}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentJarSchedulePay;
