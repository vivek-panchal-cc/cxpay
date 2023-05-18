import ActivityList from "components/lists/ActivityList";
import React from "react";
import { useNavigate } from "react-router-dom";

const RecentActivities = (props) => {
  const { loading, activitiesList = [] } = props;
  const navigate = useNavigate();

  const handleViewAllActivity = () => {
    navigate("/activities");
  };

  return (
    <div className="dashboard-recent-activity-sec">
      <div className="recent-activity-sec d-flex justify-content-between">
        <div className="title-content-wrap">
          <h3>Recent Activity</h3>
        </div>
        <div className=""></div>
      </div>
      {/*  <!-- recent activity section starts -->*/}
      {/* <div className="activity-tab-sec"> */}
      <div className="activity-tab-inner">
        <div className="activity-tab-wrap">
          <div className="tab-content" id="nav-tabContent">
            {/* <!-- History tab content starts --> */}
            <div className="tab-pane fade show active" id="nav-home">
              <ActivityList
                classNameList="recent-act-lw-main"
                loading={loading}
                activitiesList={activitiesList}
              />
              {activitiesList && activitiesList.length > 0 && (
                <div className="view-history-btn">
                  <button
                    className="btn"
                    type="button"
                    onClick={handleViewAllActivity}
                  >
                    View all history
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* <!-- recent activity section close-->*/}
    </div>
  );
};

export default RecentActivities;
