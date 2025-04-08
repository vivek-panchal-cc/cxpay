import ModalConfirmation from "components/modals/ModalConfirmation";
import TabsPaymentOptions from "components/tabs/TabsPaymentOptions";
import Input from "components/ui/Input";
import {
  isAdminApprovedWithRenewCheck,
  JAR_OPTIONS_TABS_LIST,
} from "constants/all";
import OwnJarListItem from "components/items/OwnJarListItem";
import { LoginContext } from "context/loginContext";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import React, { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { IconCross, IconSearch } from "styles/svgs";

const ViewOwnJars = () => {
  const {
    reloadOwnJar,
    activeJarList,
    inactiveJarList,
    loadingOwnJar,
    searchName,
    handleSearchName,
    resetSearchName,
    deleteRecurringPayment,
  } = useContext(SavingJarOwnContext);

  const [activeJars, setActiveJars] = useState([]);
  const [inactiveJars, setInactiveJars] = useState([]);

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

  useEffect(() => {
    (async () => {
      await reloadOwnJar(); // Fetch data when the component mounts
    })();
  }, []);

  useEffect(() => {
    setActiveJars(activeJarList);
    setInactiveJars(inactiveJarList);
  }, [activeJarList, inactiveJarList]);

  return (
    <>
      <div className="activities-sec">
        <div className="wr-title-wrap">
          <h3>My Sub-accounts</h3>
          {/* <p>Please select payment date</p> */}
        </div>
        <TabsPaymentOptions
          className="wr-page-link-wrap d-flex"
          tabsList={JAR_OPTIONS_TABS_LIST}
        />
        <div className="schedule-pay-sd-wrap gap-4 w-auto saving-jar">
          <div className="form-field search-field">
            <div
              className="clearsearchbox"
              style={{ opacity: searchName ? 1 : 0 }}
              onClick={() => resetSearchName()}
            >
              <IconCross />
            </div>
            <Input
              type="search"
              className="form-control js-searchBox-input"
              name="search_field"
              placeholder="Search..."
              value={searchName}
              onChange={(e) => handleSearchName(e.target.value)}
            />
            <div className="search-btn">
              <IconSearch style={{ stroke: "#0081c5" }} />
            </div>
          </div>
          {/* <button className="shedule-date-filter" onClick={handleResetFilter}>
            <IconRefresh />
          </button> */}
          {adminApprovedWithRenewCheck && (
            <Link to="/jars/own/create-jar" replace>
              <span className="button shedule-date-filter rounded-4">
                <img src="/assets/images/Add_card_btn.svg" alt="" />
              </span>
            </Link>
          )}
        </div>

        <div className="activity-user-list-wrap">
          {loadingOwnJar ? (
            <div className="pt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <LoaderActivityItem key={item} />
              ))}
            </div>
          ) : (
            <>
              {/* Active Sub-accounts */}
              {activeJars?.length > 0 && (
                <div className="active-jar-list-container">
                  <div className="activity-month fs-5 p-0 active-jar-header">
                    <span>Active</span>
                    <span>Total : 1000 / 1000</span>
                  </div>
                  <div className="jar-scroll-bar">
                    <ul className="act-user-content-wrap">
                      {activeJars.map((item, index) => (
                        <OwnJarListItem
                          key={item.jar_id || index}
                          details={item}
                          tabList={"own"}
                          active={true}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Inactive Sub-accounts */}
              {inactiveJars?.length > 0 && (
                <div className="in-active-jar-list-container">
                  <div className="activity-month fs-5 p-0 in-active-jar-header">
                    In Active
                  </div>
                  <div className="jar-scroll-bar">
                    <ul className="act-user-content-wrap">
                      {inactiveJars.map((item, index) => (
                        <OwnJarListItem
                          key={item.jar_id || index}
                          details={item}
                          tabList={"own"}
                          active={false}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        {!loadingOwnJar &&
        Object.keys(activeJars || {}).length <= 0 &&
        Object.keys(inactiveJars || {}).length <= 0 ? (
          <div className="text-center py-4">
            <p className="fs-5">Own sub-account not found.</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ViewOwnJars;
