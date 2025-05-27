import JarActivityList from "components/lists/JarActivityList";
import React from "react";
import { useNavigate } from "react-router-dom";

const RecentJarActivities = (props) => {
  const { loading, jarActivityList = [], handleShowAll } = props;
  const navigate = useNavigate();

  const handleViewAllActivity = () => {
    navigate("/activities");
  };

  return (
    <div className="dashboard-recent-activity-sec">
      <div className="recent-activity-sec d-flex justify-content-between">
        <div className="title-content-wrap">
          <h3>{`${
            jarActivityList?.length > 1
              ? "Sub-account Activities"
              : "Sub-account Activity"
          }`}</h3>
        </div>
        {jarActivityList?.length > 0 && (
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
              <JarActivityList
                classNameList="recent-act-lw-main"
                loading={loading}
                jarActivityList={jarActivityList}
              />
              {/* {jarActivityList && jarActivityList.length > 0 ? (
                <div className="view-history-btn">
                  <button
                    className="btn"
                    type="button"
                    onClick={handleViewAllActivity}
                  >
                    View all history
                  </button>
                </div>
              ) : null} */}
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* <!-- recent activity section close-->*/}
    </div>
  );
};

export default RecentJarActivities;
