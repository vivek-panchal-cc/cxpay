import TabsPaymentOptions from "components/tabs/TabsPaymentOptions";
import Input from "components/ui/Input";
import { JAR_OPTIONS_TABS_LIST } from "constants/all";
import OwnJarListItem from "components/items/OwnJarListItem";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import React, { useContext, useEffect, useState } from "react";
import { IconCross, IconSearch } from "styles/svgs";

const ViewSharedJar = () => {
  const {
    reloadSharedJar,
    activeSharedJarList,
    inactiveSharedJarList,
    loadingSharedJar,
    searchSharedName,
    handleSearchSharedName,
    resetSearchSharedName,
  } = useContext(SavingJarOwnContext);

  const [activeJars, setActiveJars] = useState([]);
  const [inactiveJars, setInactiveJars] = useState([]);

  useEffect(() => {
    (async () => {
      await reloadSharedJar(); // Fetch data when the component mounts
    })();
  }, []);

  useEffect(() => {
    setActiveJars(activeSharedJarList);
    setInactiveJars(inactiveSharedJarList);
  }, [activeSharedJarList, inactiveSharedJarList]);

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
              style={{ opacity: searchSharedName ? 1 : 0 }}
              onClick={() => resetSearchSharedName()}
            >
              <IconCross />
            </div>
            <Input
              type="search"
              className="form-control js-searchBox-input"
              name="search_field"
              placeholder="Search..."
              value={searchSharedName}
              onChange={(e) => handleSearchSharedName(e.target.value)}
            />
            <div className="search-btn">
              <IconSearch style={{ stroke: "#0081c5" }} />
            </div>
          </div>
        </div>

        <div className="activity-user-list-wrap">
          {loadingSharedJar ? (
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
                    Active
                  </div>
                  <div className="jar-scroll-bar">
                    <ul className="act-user-content-wrap">
                      {activeJars.map((item, index) => (
                        <OwnJarListItem
                          key={item.jar_id || index}
                          details={item}
                          tabList={"shared"}
                          active={true}
                        />
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Inactive Sub-accounts */}
              {inactiveJars?.length > 0 && (
                <div className="active-jar-list-container">
                  <div className="activity-month fs-5 p-0 active-jar-header">
                    In Active
                  </div>
                  <div className="jar-scroll-bar">
                    <ul className="act-user-content-wrap">
                      {inactiveJars.map((item, index) => (
                        <OwnJarListItem
                          key={item.jar_id || index}
                          details={item}
                          tabList={"shared"}
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
        {!loadingSharedJar &&
        Object.keys(activeJars || {}).length <= 0 &&
        Object.keys(inactiveJars || {}).length <= 0 ? (
          <div className="text-center py-4">
            <p className="fs-5">Shared sub-account not found.</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ViewSharedJar;
