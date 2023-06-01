import React, { useContext, useEffect, useState } from "react";
import CardList from "components/card-list/CardList";
import Modal from "components/modals/Modal";
import FundYourAccountPopup from "components/popups/FundYourAccountPopup";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { Link } from "react-router-dom";
import CardDetails from "components/card-list/CardDetails";
import useBalance from "hooks/useBalance";
import useChartData from "hooks/useChartData";
import BalanceGraph from "components/graph/BalanceGraph";
import RecentActivities from "components/activity/RecentActivities";

function Wallet() {
  const { setIsLoading } = useContext(LoaderContext);
  const [cardsList, setCardsList] = useState([]);
  const [showPopupFundAccount, setShowFundAccountPopup] = useState(false);
  const [slideCard, setSlideCard] = useState({});
  const [activitiesList, setActivitiesList] = useState([]);
  const [loadingBalance, balance] = useBalance();
  const [loadingChart, chartData] = useChartData();

  const getActivitiesList = async (page = 1, filters = {}) => {
    try {
      const { data } = await apiRequest.activityList({ page, ...filters });
      if (!data.success) throw data.message;
      const { transactions } = data.data || {};
      const topFineTransact = transactions ? transactions.splice(0, 5) : [];
      setActivitiesList(topFineTransact);
    } catch (error) {
      console.log(error);
    }
  };

  const getCardsList = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.cardsList();
      if (!data.success) throw data.message;
      setCardsList(data.data.cards);
      setSlideCard(data.data.cards?.[0]);
    } catch (error) {
      setCardsList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFundAccountPopup = () => {
    setShowFundAccountPopup(true);
  };

  const handleGetCurrentSlideCard = (card, slide) => {
    if (!card) return;
    setSlideCard(card);
  };

  useEffect(() => {
    getActivitiesList();
    getCardsList();
  }, []);

  return (
    <>
      {/* Fund your Account Popup */}
      <Modal
        id="fund_acc_modal"
        show={showPopupFundAccount}
        setShow={setShowFundAccountPopup}
        className="fund-acc-modal"
        classNameChild="modal-dialog w-100"
      >
        <FundYourAccountPopup />
      </Modal>
      {/* <!-- dahsboard top sec close -->   */}
      <div className="dashboard-bottom-sec">
        <div className="wallet-main-left">
          {/* <!-- dahsboard top sec starts -->	 */}
          <div className="wallet-top-wrap wallet-top-nwrap">
            <div className="wallet-title-wrap w-100">
              <div className="wallet-title-container">
                <h2>Wallet</h2>
                <p> </p>
              </div>
              <div className="wallet-title-btns">
                <Link
                  className="wallet-top-1-btn"
                  onClick={handleFundAccountPopup}
                >
                  <img src="/assets/images/fund_svg_wallet.svg" alt="" />
                  <span>Fund your account</span>
                </Link>
                <Link to="/wallet/link-bank" className="wallet-top-2-btn">
                  <img src="/assets/images/Bank_ic_wallet.svg" alt="" />
                  <span>Link a bank</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="wallet-chart-container chart-container-common">
            <BalanceGraph
              graphBackgroundImage={"/assets/images/chart-duumy.png"}
              balanceDataArr={chartData.balanceArr}
              balance={balance}
              monthDataArr={chartData.monthArr}
            />
          </div>
          <RecentActivities activitiesList={activitiesList} />
        </div>
        {/* <!-- Dashboard card section starts --> */}
        <div className="wallet-main-right">
          <div className="">
            {cardsList && cardsList.length > 0 ? (
              <>
                <div className="wallet-right-title">
                  <h3>My Cards</h3>
                </div>
                <CardList
                  cardsList={cardsList}
                  getCurrentSlideCard={handleGetCurrentSlideCard}
                  walletSlider={true}
                />
                <CardDetails card={slideCard} />
              </>
            ) : null}
            <div className="wallet-card-add-btns mb-4">
              <Link
                to="/wallet/bank-list"
                className="w-100 d-flex align-items-center"
              >
                <img src="/assets/images/Bank_ic_wallet.svg" alt="" />
                <span className="w-100 mw-100">My Bank Accounts</span>
              </Link>
            </div>
            <div className="wallet-card-add-btns">
              <Link to="/wallet/add-card">
                <img src="/assets/images/Add_card_btn.svg" alt="" />
                <span>Add a Card</span>
              </Link>
              <Link to="/wallet/view-card">
                <img src="/assets/images/View_cards_btn.svg" alt="" />
                <span>View Cards</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Wallet;
