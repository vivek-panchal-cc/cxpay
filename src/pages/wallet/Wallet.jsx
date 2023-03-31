import React, { useContext, useEffect, useState } from "react";
import CardList from "components/card-list/CardList";
import Modal from "components/modals/Modal";
import FundYourAccountPopup from "components/popups/FundYourAccountPopup";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { Link } from "react-router-dom";
import CardDetails from "components/card-list/CardDetails";

function Wallet() {
  const { setIsLoading } = useContext(LoaderContext);
  const [cardsList, setCardsList] = useState([]);
  const [showPopupFundAccount, setShowFundAccountPopup] = useState(false);
  const [slideCard, setSlideCard] = useState({});
  const [balance, setBalance] = useState(null);

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

  const getBalance = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getBalance();
      if (!data.success) throw data.message;
      setBalance(data.data?.available_balance);
    } catch (error) {
      setBalance(null);
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
    getCardsList();
    getBalance();
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
                <p>Lorem Ipsum Dolor Sit Amet</p>
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
            {/* <!--<div id="chartContainer" style="height: 370px; width: 100%;"></div> --> */}
            <div className="wallet-chart-wrap common-chart-wrap position-relative">
              <img
                className="img-size"
                src="/assets/images/chart-duumy.png"
                alt=""
              />
              {balance && (
                <div className="position-absolute top-0 p-4">
                  <h6 className="h6" style={{ color: "#0081c5" }}>
                    Available Balance
                  </h6>
                  <h2 className="h3 text-black fw-bolder"> NAFl {balance} </h2>
                </div>
              )}
            </div>
          </div>
          <div className="wallet-recent-activity-sec-wrap">
            <div className="recent-activity-title">
              <div className="title-content-wrap">
                <h3>Recent Activity</h3>
              </div>
            </div>
            {/* <!-- recent activity section starts --> */}
            <div className="wallet-recent-activity-sec">
              <div className="activity-month">September 2022</div>
              <ul>
                <li>
                  <div className="user-info">
                    <div className="user-img-title-wrap">
                      <div className="activity-use-img">
                        <img
                          src="/assets/images/activity-use-image01.jpg"
                          alt="user img"
                        />
                      </div>
                      <h4>Contact Name</h4>
                    </div>
                    <div className="date-info">01 Sep 2022, at 18:00 PM</div>
                    <div className="price-info">+123.45 Nafl</div>
                    <div className="act-edit-btn">
                      <a
                        href="/"
                        data-bs-toggle="modal"
                        data-bs-target="#user-details-popup"
                      >
                        <img
                          className="img-default"
                          src="/assets/images/double-round-ic.svg"
                          alt=""
                        />
                        <img
                          className="img-hover"
                          src="/assets/images/double-round-ic-hover.svg"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="activity-month">September 2022</div>
              <ul>
                <li>
                  <div className="user-info">
                    <div className="user-img-title-wrap">
                      <div className="activity-use-img">
                        <img
                          src="/assets/images/activity-use-image01.jpg"
                          alt="user img"
                        />
                      </div>
                      <h4>Contact Name</h4>
                    </div>
                    <div className="date-info">01 Sep 2022, at 18:00 PM</div>
                    <div className="price-info">
                      <span className="negative-price">-12.34 Nafl</span>
                    </div>
                    <div className="act-edit-btn">
                      <a
                        href="/"
                        data-bs-toggle="modal"
                        data-bs-target="#user-details-popup"
                      >
                        <img
                          className="img-default"
                          src="/assets/images/double-round-ic.svg"
                          alt=""
                        />
                        <img
                          className="img-hover"
                          src="/assets/images/double-round-ic-hover.svg"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="user-info">
                    <div className="user-img-title-wrap">
                      <div className="activity-use-img">
                        <img
                          src="/assets/images/activity-use-image01.jpg"
                          alt="user img"
                        />
                      </div>
                      <h4>Contact Name</h4>
                    </div>
                    <div className="date-info">01 Sep 2022, at 18:00 PM</div>
                    <div className="price-info">+123.45 Nafl</div>
                    <div className="act-edit-btn">
                      <a
                        href="/"
                        data-bs-toggle="modal"
                        data-bs-target="#user-details-popup"
                      >
                        <img
                          className="img-default"
                          src="/assets/images/double-round-ic.svg"
                          alt=""
                        />
                        <img
                          className="img-hover"
                          src="/assets/images/double-round-ic-hover.svg"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="user-info">
                    <div className="user-img-title-wrap">
                      <div className="activity-use-img">
                        <img
                          src="/assets/images/activity-use-image01.jpg"
                          alt="user img"
                        />
                      </div>
                      <h4>Contact Name</h4>
                    </div>
                    <div className="date-info">01 Sep 2022, at 18:00 PM</div>
                    <div className="price-info">
                      <span className="negative-price">-12.34 Nafl</span>
                    </div>
                    <div className="act-edit-btn">
                      <a
                        href="/"
                        data-bs-toggle="modal"
                        data-bs-target="#user-details-popup"
                      >
                        <img
                          className="img-default"
                          src="/assets/images/double-round-ic.svg"
                          alt=""
                        />
                        <img
                          className="img-hover"
                          src="/assets/images/double-round-ic-hover.svg"
                          alt=""
                        />
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
              <div className="view-history-btn">
                <a href="/">View all history</a>
              </div>
            </div>
            {/* <!-- recent activity section close--> */}
          </div>
        </div>
        {/* <!-- Dashboard card section starts --> */}
        <div className="wallet-main-right">
          <div className="">
            {cardsList && cardsList.length > 0 && (
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
            )}
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
