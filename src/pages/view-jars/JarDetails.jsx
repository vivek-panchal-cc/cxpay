import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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

const graphBackgroundImage = "/assets/images/chart-duumy.png";

const JarDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params || {};
  const { setIsLoading } = useContext(LoaderContext);
  const { handleSendContacts } = useContext(SendPaymentContext);
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
  const [inviteContactList, setInviteContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  const [searchContactText, setSearchContactText] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
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
          jar_id: id,
        });
        if (!data.success) throw data.message;
        setSavingJarDetails(data?.data);
      } catch (error) {
        navigate(-1);
        console.error("Error fetching recurring payment details:", error);
      } finally {
        setGraphLoading(false);
      }
    };
    fetchSavingJarDetails();
  }, [id]);

  // handle selected contacts
  const handleSelectContact = (e) => {
    const value = e?.currentTarget?.value;
    if (!value) return;
    const contact = inviteContactList.find(
      (con) => con.account_number === value
    );
    if (contact) handleSendContacts([contact]);
  };

  // Debouncing for contacts
  useEffect(() => {
    if (searchContactText === "") {
      getInviteContactList(1, searchContactText);
      return;
    }
    const timeOut = setTimeout(() => {
      setCurrentPage(1);
      getInviteContactList(1, searchContactText);
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
      await getInviteContactList(currentPage + 1, searchContactText);
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
  const getInviteContactList = async (page = 1, search = "") => {
    setIsLoadingContacts(true);
    try {
      let param = { page: page, search: search };
      const { data } = await apiRequest.getInviteContactList(param);
      if (!data.success) throw data.message;
      setTotalInvitedData(data.data.pagination.total);
      if (page === 1) {
        setInviteContactList(data.data.app_contacts);
      } else {
        const allData = inviteContactList.concat(data.data.app_contacts);
        setInviteContactList(allData);
      }
      setIsLoadingContacts(false);
    } catch (error) {
      setTotalInvitedData(0);
      setInviteContactList([]);
      setIsLoadingContacts(false);
    }
  };

  useEffect(() => {
    getInviteContactList(currentPage, "");
    getCardsList();
  }, []);

  const handleFundAccountPopup = () => {
    setShowFundAccountPopup(true);
  };

  return (
    <>
      {/* Close Fund Account Popup */}
      <div
        className={`dashboard-home-container ${
          user_type === "agent" ? "agent" : ""
        }`}
      >
        <div className="dashboard-bottom-sec">
          <div className="dashboard-graph-sec">
            <div className="graph-title-content-wrap">
              <SavingJarProgress
                graphBackgroundImage={graphBackgroundImage}
                balance={balance}
                balanceDataArr={chartData.balanceArr}
                monthDataArr={chartData.monthArr}
                getBalance={getBalance}
                savingJarDetails={savingJarDetails}
                graphLoading={graphLoading}
              />
            </div>
            {/* <RecentActivities
              loading={loadingAct}
              activitiesList={activitiesList ? activitiesList.slice(0, 5) : []}
            /> */}
          </div>
          {/*   <!-- JarDetails card section starts --> */}
          {/* {user_type !== "agent" && (
            <div className="dashboard-card-links-sec">
              <div className="dashboard-card-sec mb-0">
                <div className="title-content-wrap">
                  <h3>My Cards</h3>
                  <p>
                    {cardsList.length} Cards
                    <Link to="/wallet/add-card">
                      <span>+ Add Card</span>
                    </Link>
                  </p>
                </div>
                <CardList
                  cardsList={cardsList}
                  getCurrentSlideCard={handleGetCurrentSlideCard}
                  walletSlider={false}
                  svgWidth="300"
                  svgHeight="130"
                />
              </div>
              <div className="dashboard-recent-contact-sec">
                <div className="recent-contact-sec">
                  <ContactsSelection className="col-12">
                    <ContactsSelection.Header
                      className=""
                      heading="Recent Contact"
                      subHeading=""
                      searchValue={searchContactText}
                      handleSearch={handleSearchContact}
                      clearSearch={handleResetContactData}
                    />
                    <ContactsSelection.Body
                      isLoading={isLoadingContacts}
                      classNameContainer="send-group-slider"
                      contacts={inviteContactList}
                      selectedContacts={[]}
                      handleSelectedItems={handleSelectContact}
                      handleReachEnd={handleReachEndContacts}
                      fullWidth={false}
                      emptyListMsg="Contacts not found"
                      ListItemComponent={ContactCard}
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
                      }}
                    />
                  </ContactsSelection>
                </div>
              </div>
              <div className="extra-links-wrap">
                <ul>
                  <li>
                    {adminApprovedWithRenewCheck ? (
                      <Link
                        className="wallet-top-1-btn"
                        onClick={handleFundAccountPopup}
                      >
                        <span className="icon-link-text">
                          <IconAdd />
                          Fund Your Account
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </Link>
                    ) : (
                      <Link className="wallet-top-1-btn">
                        <span className="icon-link-text admin-approved-disabled">
                          <IconAdd />
                          Fund Your Account
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </Link>
                    )}
                  </li>
                  <li>
                    {adminApprovedWithRenewCheck ? (
                      <Link to="/view-schedule-payment">
                        <span className="icon-link-text">
                          <IconWallet stroke="#363853" />
                          Payments
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </Link>
                    ) : (
                      <Link>
                        <span className="icon-link-text admin-approved-disabled">
                          <IconWallet stroke="#363853" />
                          Payments
                        </span>
                        <span className="arrow-wrap">
                          <IconRightArrowBig />
                        </span>
                      </Link>
                    )}
                  </li>
                  <li>
                    <Link to="/send">
                      <span className="icon-link-text">
                        <IconSend style={{ stroke: "#363853" }} />
                        Send
                      </span>
                      <span className="arrow-wrap">
                        <IconRightArrowBig />
                      </span>
                    </Link>
                  </li>
                  <li>
                    <a
                      className="cursor-pointer"
                      onClick={() => setShowNewContPop(true)}
                    >
                      <span className="icon-link-text">
                        <IconAdd />
                        Add a Contact
                      </span>
                      <span className="arrow-wrap">
                        <IconRightArrowBig />
                      </span>
                    </a>
                  </li>
                  <li>
                    <Link to="/send">
                      <span className="icon-link-text">
                        <IconMessage />
                        Group Payment
                      </span>
                      <span className="arrow-wrap">
                        <IconRightArrowBig />
                      </span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )} */}
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
