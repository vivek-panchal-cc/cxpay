import React, { useContext, useState } from "react";
import Input from "components/ui/Input";
import { IconCross, IconSearch } from "styles/svgs";
import LoaderMerchant from "loaders/LoaderMerchant";
import Modal from "components/modals/Modal";
import MerchantQRPopup from "components/popups/MerchantQRPopup";
import { Navigate } from "react-router-dom";
import JarMemberListingModal from "components/modals/JarMemberListingModal";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import JarMembersItem from "components/items/JarMembersItem";
import ModalConfirmation from "components/modals/ModalConfirmation";
import useJarMemberList from "hooks/useJarMemberList";

const JarMembers = () => {
  const { addJarMembers, handleDeleteMember, jarId, tabName } =
    useContext(SavingJarOwnContext);
  const [showAddMemberPopup, setShowAddMemberPopup] = useState(false);
  const [jarMembers, setJarMembers] = useState([]);
  const [userData, setUserData] = useState({});
  const [showQR, setShowQR] = useState(false);
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

  const handleQRShow = (data) => {
    setUserData(data);
    setShowQR(true);
  };

  const showAddMemberPopupData = () => {
    setShowAddMemberPopup(true);
  };

  const handleSelectMembers = async (item) => {
    setJarMembers([...item]);
    if (addJarMembers) await addJarMembers(jarId, item);
    reloadMembers();
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
                <h3>Jar Members</h3>
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

              {tabName === "own" && (
                <span
                  className="button shedule-date-filter rounded-4"
                  onClick={showAddMemberPopupData}
                  style={{ cursor: "pointer" }}
                >
                  <img src="/assets/images/Add_jar_members.svg" alt="" />
                </span>
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
                  memberList?.map((member, index) => (
                    <JarMembersItem
                      key={index}
                      member={member}
                      handleCallback={handleQRShow}
                      handleDeleteMember={handleDeleteMemberPopup}
                      tabName={tabName}
                      // selectedMerchants={selectedContacts}
                    />
                  ))
                )}
                {!isLoadingMembers && memberList.length <= 0 ? (
                  <p className="text-center">Member not found.</p>
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
      <Modal
        id="merchant_qr_modal"
        show={showQR}
        className=""
        // classNameChild="modal-dialog w-100"
      >
        <MerchantQRPopup setShow={setShowQR} details={userData} />
      </Modal>
    </>
  );
};

export default JarMembers;
