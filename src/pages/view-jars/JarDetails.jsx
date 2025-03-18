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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  const [searchContactText, setSearchContactText] = useState("");
  const [isLoadingMember, setIsLoadingMembers] = useState(true);
  const [graphLoading, setGraphLoading] = useState(false);

  const [cardsList, setCardsList] = useState([]);
  const [slideCard, setSlideCard] = useState({});

  const [loadingBalance, balance, getBalance] = useBalance();
  const [loadingTopUpBalance, topUpBalance, getRecharge] = useTopUpBalance();
  const [loadingChart, chartData] = useChartData();
  const [loadingAct, actPagination, activitiesList, reload] = useActivities({});
  const [loadingTopUp, actTopUpPagination, topUpActivitiesList, topUpReload] =
    useTopUpActivities({});

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
        navigate(-1);
      } finally {
        setGraphLoading(false);
      }
    };
    fetchSavingJarDetails();
  }, [jarId]);

  // handle selected contacts
  const handleSelectContact = (e) => {
    const value = e?.currentTarget?.value;
    if (!value) return;
    const contact = jarMemberList.find((con) => con.account_number === value);
    if (contact) handleSendContacts([contact]);
  };

  // Debouncing for contacts
  useEffect(() => {
    if (searchContactText === "") {
      getJarMemberList(jarId, searchContactText);
      return;
    }
    const timeOut = setTimeout(() => {
      setCurrentPage(1);
      getJarMemberList(jarId, searchContactText);
    }, 1000);
    return () => clearTimeout(timeOut);
  }, [searchContactText.toString().trim()]);

  const handleResetContactData = () => {
    setSearchContactText("");
    setCurrentPage(1);
  };

  // For searching the contacts with name given in search bar
  const handleSearchContact = (e) => {
    setSearchContactText(e.target.value);
  };

  const handleReachEndContacts = async () => {
    if (currentPage * 10 < totalInvitedData) {
      setCurrentPage((cp) => cp + 1);
      await getJarMemberList(jarId, searchContactText);
    }
  };

  const getCardsList = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      setCardsList(data.data.cards);
    } catch (error) {
      setCardsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetCurrentSlideCard = (card) => {
    if (!card) return;
    setSlideCard(card);
  };

  // get invite contact list
  const getJarMemberList = async (jarId, search = "") => {
    setIsLoadingMembers(true);
    try {
      let param = { jar_id: jarId, search_name: search };
      const { data } = await apiRequest.getSavingJarMemberList(param);
      if (!data.success) throw data.message;
      setJarMemberList(data.data);
      setIsLoadingMembers(false);
    } catch (error) {
      setJarMemberList([]);
      setIsLoadingMembers(false);
    }
  };

  useEffect(() => {
    getJarMemberList(jarId, "");
    getCardsList();
  }, []);

  const handleFundAccountPopup = () => {
    setShowFundAccountPopup(true);
  };

  const handleShowAll = async (e) => {
    e.preventDefault();
    await handleShowAllMemberList(jarId);
    navigate(`/jars/own/members-list`);
  };

  if (!jarId) return <Navigate to="/jars/own" replace />;

  return (
    <>
      {/* Close Fund Account Popup */}
      <div className={`jar-dashboard-home-container`}>
        <div className="jar-dashboard-bottom-sec">
          <div className="jar-dashboard-graph-sec">
            <div className="graph-title-content-wrap">
              <SavingJarProgress
                savingJarDetails={savingJarDetails}
                tabName={tabName}
                graphLoading={graphLoading}
                getJarMemberList={getJarMemberList}
              />
            </div>
            <div className="jar-dashboard-recent-contact-sec">
              <div className="recent-contact-sec">
                <JarMembersSelection className="col-12">
                  <JarMembersSelection.Header
                    members={jarMemberList.slice(0, 5)}
                    className=""
                    heading="Recent Member"
                    subHeading=""
                    searchValue={searchContactText}
                    handleSearch={handleSearchContact}
                    clearSearch={handleResetContactData}
                    handleShowAll={handleShowAll}
                  />
                  <JarMembersSelection.Body
                    isLoading={isLoadingMember}
                    classNameContainer="send-group-slider"
                    members={jarMemberList.slice(0, 5)}
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
            {/* <RecentActivities
              loading={loadingAct}
              activitiesList={activitiesList ? activitiesList.slice(0, 5) : []}
            /> */}
          </div>
          <div className="jar-dashboard-card-links-sec">
            {/* <RecentActivities
              loading={loadingAct}
              activitiesList={activitiesList ? activitiesList.slice(0, 5) : []}
            />
            <RecentActivities
              loading={loadingAct}
              activitiesList={activitiesList ? activitiesList.slice(0, 5) : []}
            /> */}
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
