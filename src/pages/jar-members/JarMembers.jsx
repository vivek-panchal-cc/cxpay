import React, { useContext, useState } from "react";
import Input from "components/ui/Input";
import { IconAddJarMember, IconCross, IconSearch } from "styles/svgs";
import LoaderMerchant from "loaders/LoaderMerchant";
import { Link, Navigate } from "react-router-dom";
import JarMemberListingModal from "components/modals/JarMemberListingModal";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import JarMembersItem from "components/items/JarMembersItem";
import ModalConfirmation from "components/modals/ModalConfirmation";
import useJarMemberList from "hooks/useJarMemberList";

const JarMembers = () => {
  const {
    handleRecurringPaymentForSharedUser,
    addJarMembers,
    handleDeleteMember,
    jarId,
    jarData,
    tabName,
    handleCreatedJarData,
  } = useContext(SavingJarOwnContext);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [jarMembers, setJarMembers] = useState([]);
  const [popup, setPopup] = useState(false);
  const [memberId, setMemberId] = useState(null);

  const [search, setSearch] = useState("");
  const [isLoadingMembers, memberList, reloadMembers] = useJarMemberList({
    jar_id: jarId,
    search_name: search,
  });

  const handleSearchMember = (elm) => {
    setSearch(elm.target.value);
  };

  const showAddMemberPopupData = () => {
    setShowAddMemberPopup(true);
  };

  // const handleSelectMembers = async (item) => {
  //   setJarMembers([...item]);
  //   if (addJarMembers) await addJarMembers(jarId, item);
  //   reloadMembers();
  // };

  const handleSelectMembers = async (item) => {
    setJarMembers([...item]);
    if (handleCreatedJarData)
      handleCreatedJarData({
        ...jarData,
        target_date: jarData.target_date.split("-").reverse().join("-"),
      });
    if (handleRecurringPaymentForSharedUser)
      await handleRecurringPaymentForSharedUser({
        ...jarData,
        target_date: jarData.target_date.split("-").reverse().join("-"),
        members: item,
        isMember: true,
      });
  };

  const handleDeleteMemberPopup = (acc_num) => {
    if (!acc_num) return;
    setMemberId(acc_num);
    setPopup(true);
  };

  const handleCallbackDelete = async () => {
    setPopup(false);
    await handleDeleteMember(jarId, memberId);
    setMemberId(null);
    reloadMembers();
  };

  if (!jarId) return <Navigate to="/jars/own" replace />;

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="merchant-sec">
            <div className="merchant-top-sec">
              <div className="title-content-wrap">
                <h3>
                  {memberList?.members?.length > 1
                    ? "Sub-account Members"
                    : "Sub-account Member"}
                </h3>
                <ul className="breadcrumb">
                  <li>
                    <Link to={`/jars/own/jar-details`}>Sub-accounts</Link>
                  </li>
                  <li>
                    {memberList?.members?.length > 1 ? "Members" : "Member"}
                  </li>
                </ul>
              </div>
            </div>
            <div className="schedule-pay-sd-wrap gap-4 w-auto saving-jar">
              <div className="form-field search-field">
                <div
                  className="clearsearchbox"
                  style={{ opacity: search ? 1 : 0 }}
                  onClick={() => setSearch("")}
                >
                  <IconCross />
                </div>
                <Input
                  type="search"
                  className="form-control js-searchBox-input"
                  name="search-field"
                  value={search}
                  onChange={handleSearchMember}
                  placeholder="Search..."
                />
                <div className="search-btn">
                  <IconSearch />
                </div>
              </div>

              {memberList.is_owner && (
                <button
                  className={`button shedule-date-filter rounded-4 p-0 ${
                    memberList.is_owner && memberList.jar_status
                      ? ""
                      : "contacts-admin-approved-disabled"
                  }`}
                  onClick={
                    memberList.is_owner && memberList.jar_status
                      ? showAddMemberPopupData
                      : null
                  }
                  style={{ cursor: "pointer" }}
                >
                  <IconAddJarMember
                    fill={`${
                      memberList.is_owner && memberList.jar_status
                        ? "#363853"
                        : "#d5dbe0"
                    }`}
                  />
                </button>
              )}
            </div>
            <div className="merchant-listing-container mt-0">
              <ul className="merchant-listing-wrap">
                {isLoadingMembers ? (
                  <div className="d-flex flex-column gap-3 mt-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((item) => (
                      <LoaderMerchant
                        key={item}
                        style={{
                          background:
                            item % 2 === 0 ? "#f6f6f670" : "#fafafa70",
                          fill: "#000000",
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  memberList.members?.map((member, index) => (
                    <JarMembersItem
                      key={index}
                      member={member}
                      flags={memberList}
                      handleDeleteMember={handleDeleteMemberPopup}
                      tabName={tabName}
                      // selectedMerchants={selectedContacts}
                    />
                  ))
                )}
                {!isLoadingMembers && !memberList.members ? (
                  <div className="text-center py-5">
                    <p className="fs-5">Member not found</p>
                  </div>
                ) : null}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <JarMemberListingModal
        id="delete-group-popup"
        show={showAddMemberPopup}
        setShow={setShowAddMemberPopup}
        handleCallback={() => setShowAddMemberPopup(false)}
        className={`con-list-pop`}
        jarId={jarId}
        selectedItem={() => {}}
        selectedFullItem={handleSelectMembers}
        selectedMembers={jarMembers}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={popup}
        setShow={setPopup}
        heading={"Member Delete"}
        subHeading={`Are you sure you want to delete this member?`}
        handleCallback={handleCallbackDelete}
      />
    </>
  );
};

export default JarMembers;
