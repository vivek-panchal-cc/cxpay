import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "components/modals/Modal";
import FundYourAccountPopup from "components/popups/FundYourAccountPopup";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";
import CardList from "components/card-list/CardList";
import ContactsSelection from "components/contacts-selection/ContactsSelection";
import ContactCard from "components/cards/ContactCard";
import RecentActivities from "../../components/activity/RecentActivities";
import useBalance from "hooks/useBalance";
import useChartData from "hooks/useChartData";
import useTopUpBalance from "hooks/useTopUpBalance";
import ModalAddContact from "components/modals/ModalAddContact";
import { SendPaymentContext } from "context/sendPaymentContext";
import useActivities from "hooks/useActivities";
import useTopUpActivities from "hooks/useTopUpActivities";
import {
  IconAdd,
  IconMessage,
  IconRightArrowBig,
  IconSend,
  IconWallet,
} from "styles/svgs";
import { LoginContext } from "context/loginContext";
import { isAdminApprovedWithRenewCheck } from "constants/all";
import SavingJarProgress from "components/graph/SavingJarProgress";
import { SavingJarOwnContext } from "context/savingJarOwnProvider";
import JarMembersSelection from "components/jar-members-selection/JarMembersSelection";
import JarMemberCard from "components/cards/JarMemberCard";
import useJarActivityList from "hooks/useJarActivityList";
import RecentJarActivities from "components/jar-activity/RecentJarActivities";
import useJarSchedulePayList from "hooks/useJarSchedulePayList";
import RecentJarSchedulePay from "components/jar-activity/RecentJarSchedulePay";
import useJarRecurringPayList from "hooks/useJarRecurringPayList";
import RecentJarRecurringPay from "components/jar-activity/RecentJarRecurringPay";

const graphBackgroundImage = "/assets/images/chart-duumy.png";

const JarDetails = () => {
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { handleSendContacts } = useContext(SendPaymentContext);
  const { jarId, tabName, handleShowAllMemberList } =
    useContext(SavingJarOwnContext);
  const { first_name, company_name } = useSelector(
    (state) => state.userProfile.profile
  );
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type, admin_approved } = profile || "";
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const [showPopupFundAccount, setShowFundAccountPopup] = useState(false);
  const [jarMemberList, setJarMemberList] = useState([]);
  const [searchContactText, setSearchContactText] = useState("");
  const [isLoadingMember, setIsLoadingMembers] = useState(true);
  const [graphLoading, setGraphLoading] = useState(false);

  const [loadingJarAct, paginationActJar, jarActivityList, reloadJarAct] =
    useJarActivityList({ jar_id: jarId });

  const [
    loadingSchedulePay,
    paginationSchedulePay,
    jarSchedulePayList,
    reloadSchedulePay,
  ] = useJarSchedulePayList({ jar_id: jarId });

  const [
    loadingRecurringPay,
    paginationRecurringPay,
    jarRecurringPayList,
    reloadRecurringPay,
  ] = useJarRecurringPayList({ jar_id: jarId });

  // For adding new Contact
  const [showNewContPop, setShowNewContPop] = useState(false);
  const [savingJarDetails, setSavingJarDetails] = useState([null]);

  useEffect(() => {
    setGraphLoading(true);
    const fetchSavingJarDetails = async () => {
      try {
        const { data } = await apiRequest.getSavingJarDetails({
          jar_id: jarId,
        });
        if (!data.success) throw data.message;
        setSavingJarDetails(data?.data);
      } catch (error) {
        navigate(`/jars/${tabName || "own"}`, {
          replace: true,
        });
      } finally {
        setGraphLoading(false);
      }
    };
    fetchSavingJarDetails();
  }, [jarId]);

  // Debouncing for contacts
  useEffect(() => {
    if (searchContactText === "") {
      getJarMemberList(jarId, searchContactText);
      return;
    }
    const timeOut = setTimeout(() => {
      getJarMemberList(jarId, searchContactText);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [searchContactText.toString().trim()]);

  const handleResetContactData = () => {
    setSearchContactText("");
  };

  // For searching the contacts with name given in search bar
  const handleSearchContact = (e) => {
    setSearchContactText(e.target.value);
  };

  // get invite contact list
  const getJarMemberList = async (jarId, search = "") => {
    setIsLoadingMembers(true);
    try {
      let param = { jar_id: jarId, search_name: search };
      const { data } = await apiRequest.getSavingJarMemberList(param);
      if (!data.success) throw data.message;
      setJarMemberList(data.data.members);
      setIsLoadingMembers(false);
    } catch (error) {
      setJarMemberList([]);
      setIsLoadingMembers(false);
    }
  };

  const handleReload = (value) => {
    switch (value) {
      case 2:
        reloadJarAct();
        break;
      case 3:
        reloadSchedulePay();
        break;
      case 4:
        reloadRecurringPay();
        break;
      default:
        return;
    }
  };

  // useEffect(() => {
  //   getJarMemberList(jarId, "");
  // }, []);

  const handleFundAccountPopup = () => {
    setShowFundAccountPopup(true);
  };

  const handleShowAll = async (e) => {
    e.preventDefault();
    await handleShowAllMemberList(jarId);
    navigate(`/jars/own/members-list`);
  };

  const handleShowAllActivities = async (e) => {
    e.preventDefault();
    await handleShowAllMemberList(jarId);
    navigate(`/jars/own/jar-activities-list`);
  };

  const handleShowAllSchedulePayments = async (e) => {
    e.preventDefault();
    await handleShowAllMemberList(jarId);
    navigate(`/jars/own/jar-schedule-pay-list`);
  };

  const handleShowAllRecurringPayments = async (e) => {
    e.preventDefault();
    await handleShowAllMemberList(jarId);
    navigate(`/jars/own/jar-recurring-pay-list`);
  };

  if (!jarId) return <Navigate to="/jars/own" replace />;

  return (
    <>
      {/* Close Fund Account Popup */}
      <div className={`jar-dashboard-home-container`}>
        <div className="jar-dashboard-bottom-sec">
          <div className="jar-dashboard-graph-sec">
            <div className="graph-title-content-wrap">
              <div className="title-content-wrap">
                <h2>Sub-account Dashboard</h2>
                <ul className="breadcrumb">
                  <li>
                    <Link to={`/jars/${tabName === "own" ? "own" : "shared"}`}>
                      Sub-accounts
                    </Link>
                  </li>
                  <li>Dashboard</li>
                </ul>
              </div>
              <SavingJarProgress
                savingJarDetails={savingJarDetails}
                tabName={tabName}
                graphLoading={graphLoading}
                getJarMemberList={getJarMemberList}
                reloadJarAct={handleReload}
              />
            </div>
            <div className="jar-dashboard-recent-contact-sec">
              <div className="recent-contact-sec">
                <JarMembersSelection className="col-12">
                  <JarMembersSelection.Header
                    members={jarMemberList?.slice(0, 5)}
                    className=""
                    heading={`${
                      jarMemberList?.length > 1 ? "Members" : "Member"
                    }`}
                    subHeading=""
                    searchValue={searchContactText}
                    handleSearch={handleSearchContact}
                    clearSearch={handleResetContactData}
                    handleShowAll={handleShowAll}
                  />
                  <JarMembersSelection.Body
                    isLoading={isLoadingMember}
                    classNameContainer="send-group-slider"
                    members={jarMemberList ? jarMemberList?.slice(0, 5) : []}
                    selectedContacts={[]}
                    handleSelectedItems={() => {}}
                    handleReachEnd={() => {}}
                    fullWidth={false}
                    emptyListMsg="Member not found"
                    ListItemComponent={JarMemberCard}
                    ListItemComponentProps={{
                      fullWidth: false,
                      isSelectable: true,
                      fallbackImgUrl:
                        "assets/images/single_contact_profile.png",
                    }}
                    ListItemComponentAlias={{
                      account_number: "id",
                      name: "title",
                      profile_image: "imgUrl",
                      member_name: "name",
                    }}
                  />
                </JarMembersSelection>
              </div>
            </div>
            <RecentJarActivities
              loading={loadingJarAct}
              jarActivityList={
                jarActivityList ? jarActivityList?.slice(0, 5) : []
              }
              handleShowAll={handleShowAllActivities}
            />
          </div>
          <div className="jar-dashboard-card-links-sec">
            <RecentJarSchedulePay
              loading={loadingSchedulePay}
              jarSchedulePayList={
                jarSchedulePayList ? jarSchedulePayList?.slice(0, 5) : []
              }
              handleShowAll={handleShowAllSchedulePayments}
            />
            {tabName === "own" && (
              <RecentJarRecurringPay
                loading={loadingSchedulePay}
                jarRecurringPayList={
                  jarRecurringPayList ? jarRecurringPayList?.slice(0, 5) : []
                }
                handleShowAll={handleShowAllRecurringPayments}
              />
            )}
          </div>
        </div>
        {/* Fund Account Popup */}
        <Modal
          id="fund_acc_modal"
          show={showPopupFundAccount}
          setShow={setShowFundAccountPopup}
          className="fund-acc-modal"
          classNameChild="modal-dialog w-100"
        >
          <FundYourAccountPopup />
        </Modal>
        {/* Add Contact Popup */}
        <ModalAddContact
          id="add_contact"
          invitetitle="Add Contact"
          show={showNewContPop}
          setShow={setShowNewContPop}
          getConatcts={() => navigate("/contacts")}
          getInvitedConatcts={() => navigate("/contacts-invited")}
          setConatctData={() => {}}
          setInvitationSentPopup={() => {}}
          setConatctDetailPopup={() => {}}
          isNavigate={true}
        />
      </div>
    </>
  );
};

export default JarDetails;
