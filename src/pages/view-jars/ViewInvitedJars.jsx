import TabsPaymentOptions from "components/tabs/TabsPaymentOptions";
import Input from "components/ui/Input";
import { JAR_OPTIONS_TABS_LIST } from "constants/all";
import OwnJarListItem from "components/items/OwnJarListItem";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import LoaderActivityItem from "loaders/LoaderActivityItem";
import React, { useContext, useEffect, useState } from "react";
import { IconCross, IconSearch } from "styles/svgs";

const ViewInvitedJar = () => {
  const {
    loadingInvitedJar,
    activeInvitedJarList,
    inactiveInvitedJarList,
    reloadInvitedJar,
    searchInvitedName,
    resetSearchInvitedName,
    handleSearchInvitedName,
  } = useContext(SavingJarOwnContext);

  const [activeJars, setActiveJars] = useState([]);
  const [inactiveJars, setInactiveJars] = useState([]);

  useEffect(() => {
    (async () => {
      await reloadInvitedJar(); // Fetch data when the component mounts
    })();
  }, []);

  useEffect(() => {
    setActiveJars(activeInvitedJarList);
    setInactiveJars(inactiveInvitedJarList);
  }, [activeInvitedJarList, inactiveInvitedJarList]);

  return (
    <>
      <div className="activities-sec">
        <div className="wr-title-wrap">
          <h3>My Jars</h3>
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
              style={{ opacity: searchInvitedName ? 1 : 0 }}
              onClick={() => resetSearchInvitedName()}
            >
              <IconCross />
            </div>
            <Input
              type="search"
              className="form-control js-searchBox-input"
              name="search_field"
              placeholder="Search..."
              value={searchInvitedName}
              onChange={(e) => handleSearchInvitedName(e.target.value)}
            />
            <div className="search-btn">
              <IconSearch style={{ stroke: "#0081c5" }} />
            </div>
          </div>
        </div>

        <div className="activity-user-list-wrap">
          {loadingInvitedJar ? (
            <div className="pt-4">
              {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                <LoaderActivityItem key={item} />
              ))}
            </div>
          ) : (
            <>
              {/* Active Jars */}
              {activeJars?.length > 0 && (
                <div>
                  <div className="activity-month fs-5 p-0">Active</div>
                  <ul className="act-user-content-wrap">
                    {activeJars.map((item, index) => (
                      <OwnJarListItem
                        key={item.jar_id || index}
                        details={item}
                        tabList={"invited"}
                        active={true}
                      />
                    ))}
                  </ul>
                </div>
              )}

              {/* Inactive Jars */}
              {inactiveJars?.length > 0 && (
                <div>
                  <div className="activity-month fs-5 p-0">In Active</div>
                  <ul className="act-user-content-wrap">
                    {inactiveJars.map((item, index) => (
                      <OwnJarListItem
                        key={item.jar_id || index}
                        details={item}
                        tabList={"invited"}
                        active={false}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
        {!loadingInvitedJar &&
        Object.keys(activeJars || {}).length <= 0 &&
        Object.keys(inactiveJars || {}).length <= 0 ? (
          <div className="text-center py-4">
            <p className="fs-5">Invited saving jar not found.</p>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default ViewInvitedJar;
