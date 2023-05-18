import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  IconAdd,
  IconMessage,
  IconRightArrowBig,
  IconSend,
  IconWallet,
} from "styles/svgs";
// import ActivityList from "components/list/ActivityList";
import Modal from "components/modals/Modal";
import FundYourAccountPopup from "components/popups/FundYourAccountPopup";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";
import moment from "moment";
import BalanceGraph from "components/graph/BalanceGraph";
import CardList from "components/card-list/CardList";
import ContactsSelection from "components/contacts-selection/ContactsSelection";
import ContactCard from "components/cards/ContactCard";
import RecentActivities from "../../components/activity/RecentActivities";
import useBalance from "hooks/useBalance";
import useChartData from "hooks/useChartData";

// const balanceDataArr = [31, 50, 91, 80, 102, 79, 150];

const selectionRangeDate = {
  Today: [moment(), moment()],
  Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
  "Last 7 Days": [moment().subtract(6, "days"), moment()],
  "Last 30 Days": [moment().subtract(29, "days"), moment()],
  "This Month": [moment().startOf("month"), moment().endOf("month")],
  "Last Month": [
    moment().subtract(1, "month").startOf("month"),
    moment().subtract(1, "month").endOf("month"),
  ],
  "Last Year": [
    moment().subtract(1, "year").startOf("year"),
    moment().subtract(1, "year").endOf("year"),
  ],
};

const options = [
  { value: "", text: "Month" },
  { value: "1", text: "Year" },
];

const graphBackgroundImage = "/assets/images/chart-duumy.png";

const Dashboard = () => {
  // const [selected, setSelected] = useState(options[0].value);
  // const [selectionRange, setSelectionRange] = useState(selectionRangeDate);
  // const [fromDate, setFromDate] = useState(new Date());
  // const [toDate, setToDate] = useState(new Date());
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { first_name, company_name } = useSelector(
    (state) => state.userProfile.profile
  );
  const [showPopupFundAccount, setShowFundAccountPopup] = useState(false);
  const [inviteContactList, setInviteContactList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvitedData, setTotalInvitedData] = useState(0);
  const [searchContactText, setSearchContactText] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [selectedContactsIds, setSelectedContactsIds] = useState([]);

  const [cardsList, setCardsList] = useState([]);
  const [slideCard, setSlideCard] = useState({});

  const [loadingAct, setLoadingAct] = useState(false);
  const [activitiesList, setActivitiesList] = useState([]);
  const [loadingBalance, balance] = useBalance();
  const [loadingChart, chartData] = useChartData();

  const getActivitiesList = async (page = 1, filters = {}) => {
    setLoadingAct(true);
    try {
      const { data } = await apiRequest.activityList({ page, ...filters });
      if (!data.success) throw data.message;
      const { transactions } = data.data || {};
      const topFineTransact = transactions ? transactions.splice(0, 5) : [];
      setActivitiesList(topFineTransact);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAct(false);
    }
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

  const handleGetCurrentSlideCard = (card, slide) => {
    if (!card) return;
    setSlideCard(card);
  };

  // get invite contact list
  const getInviteContactList = async (page, search) => {
    setIsLoadingContacts(true);
    try {
      let param = { page: page, search: search };
      const { data } = await apiRequest.getInviteContactList(param);
      if (!data.success) throw data.message;
      setTotalInvitedData(data.data.pagination.total);
      if (page === 1) {
        setInviteContactList(data.data.app_contacts);
      } else {
        var allData = inviteContactList.concat(data.data.app_contacts);
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
    getActivitiesList();
  }, []);

  const handleFundAccountPopup = () => {
    setShowFundAccountPopup(true);
  };

  return (
    <>
      {/* Start Fund Account Popup */}
      <Modal
        id="fund_acc_modal"
        show={showPopupFundAccount}
        setShow={setShowFundAccountPopup}
        className="fund-acc-modal"
        classNameChild="modal-dialog w-100"
      >
        <FundYourAccountPopup />
      </Modal>
      {/* Close Fund Account Popup */}
      <div className="dashboard-home-container">
        <div className="dashboard-bottom-sec">
          <div className="dashboard-graph-sec">
            {/* Start Graph Section */}
            <div className="graph-title-content-wrap">
              <div className="title-content-wrap">
                <h2>Hello {first_name || company_name},</h2>
                <p>
                  Welcome to CXpay
                  <Link
                    className="wallet-top-1-btn"
                    onClick={handleFundAccountPopup}
                  >
                    <span>+ Add Funds</span>
                  </Link>
                </p>
              </div>
              <BalanceGraph
                graphBackgroundImage={graphBackgroundImage}
                balance={balance}
                balanceDataArr={chartData.balanceArr}
                monthDataArr={chartData.monthArr}
              />
            </div>
            {/* End Graph Section */}

            {/* Recent Activity */}
            <RecentActivities
              loading={loadingAct}
              activitiesList={activitiesList}
            />
          </div>
          {/*   <!-- Dashboard card section starts --> */}
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
            {/* <!-- Dashboard recent contacts section starts --> */}
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
                    selectedContacts={selectedContactsIds}
                    handleSelectedItems={() => {}}
                    handleReachEnd={handleReachEndContacts}
                    fullWidth={false}
                    emptyListMsg="Contact not found"
                    ListItemComponent={ContactCard}
                    ListItemComponentProps={{
                      fullWidth: false,
                      isSelectable: false,
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
            {/* <!-- Dashboard recent contacts section close --> */}
            {/* <!-- Dashboard extra links section starts -->	  */}
            <div className="extra-links-wrap">
              <ul>
                <li>
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
                </li>
                <li>
                  <Link to="/view-schedule-payment">
                    <span className="icon-link-text">
                      <IconWallet stroke="#363853" />
                      Scheduled Payments
                    </span>
                    <span className="arrow-wrap">
                      <IconRightArrowBig />
                    </span>
                  </Link>
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
                  <Link to="/contacts">
                    <span className="icon-link-text">
                      <IconAdd />
                      Add a Contact
                    </span>
                    <span className="arrow-wrap">
                      <IconRightArrowBig />
                    </span>
                  </Link>
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
            {/* <!-- Dashboard extra links section close -->  */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
