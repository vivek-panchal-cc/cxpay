import Modal from "components/modals/Modal";
import FundYourAccountPopup from "components/popups/FundYourAccountPopup";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Wallet() {
  const [showPopupFundAccount, setShowFundAccountPopup] = useState(false);

  const handleFundAccountPopup = () => {
    setShowFundAccountPopup(true);
  };

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
      {/* <!-- dahsboard top sec starts -->	 */}
      <div className="dashboard-top-sec wallet-top-wrap">
        <div className="col-lg-7 col-12 wallet-title-wrap">
          <div className="wallet-title-container">
            <h2>Wallet</h2>
            <p>Lorem Ipsum Dolor Sit Amet</p>
          </div>
          <div className="wallet-title-btns">
            <Link className="wallet-top-1-btn" onClick={handleFundAccountPopup}>
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
      {/* <!-- dahsboard top sec close -->   */}
      <div className="dashboard-bottom-sec">
        <div className="wallet-main-left">
          <div className="wallet-chart-container chart-container-common">
            {/* <!--<div id="chartContainer" style="height: 370px; width: 100%;"></div> --> */}
            <div className="wallet-chart-wrap common-chart-wrap">
              <img
                className="img-size"
                src="/assets/images/chart-duumy.png"
                alt=""
              />
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
                          alt="user image"
                        />
                      </div>
                      <h4>Contact Name</h4>
                    </div>
                    <div className="date-info">01 Sep 2022, at 18:00 PM</div>
                    <div className="price-info">+123.45 Nafl</div>
                    <div className="act-edit-btn">
                      <a
                        href=""
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
                          alt="user image"
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
                        href=""
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
                          alt="user image"
                        />
                      </div>
                      <h4>Contact Name</h4>
                    </div>
                    <div className="date-info">01 Sep 2022, at 18:00 PM</div>
                    <div className="price-info">+123.45 Nafl</div>
                    <div className="act-edit-btn">
                      <a
                        href=""
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
                          alt="user image"
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
                        href=""
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
                <a href="#">View all history</a>
              </div>
            </div>
            {/* <!-- recent activity section close--> */}
          </div>
        </div>
        {/* <!-- Dashboard card section starts --> */}
        <div className="wallet-main-right">
          <div className="">
            <div className="wallet-right-title">
              <h3>My Cards</h3>
            </div>
            <div className="wallet-slider">
              <div className="swiper">
                {/* <!-- Additional required wrapper --> */}
                <div className="swiper-wrapper">
                  {/* <!-- Slides --> */}
                  <div className="swiper-slide">
                    <div
                      className="wallet-ac-inner"
                      // style="background-color: #936EE3;"
                    >
                      <img
                        src="/assets/images/card_top_left.png"
                        className="w-card-top-img"
                        alt=""
                      />
                      <img
                        src="/assets/images/card_bottom_right.png"
                        className="w-card-bottom-img"
                        alt=""
                      />
                      <p className="card-holder-nm">XXXXXX</p>
                      <div className="card-num-date">
                        <p className="">.... .... .... XXXX</p>
                        <p className="">XX XXX XXXX</p>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div
                      className="wallet-ac-inner"
                      // style="background-color: #0081C5;"
                    >
                      <img
                        src="/assets/images/card_top_left.png"
                        className="w-card-top-img"
                        alt=""
                      />
                      <img
                        src="/assets/images/card_bottom_right.png"
                        className="w-card-bottom-img"
                        alt=""
                      />
                      <p className="card-holder-nm">XXXXXX</p>
                      <div className="card-num-date">
                        <p className="">.... .... .... XXXX</p>
                        <p className="">XX XXX XXXX</p>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div
                      className="wallet-ac-inner"
                      // style="background-color:#93E06F;"
                    >
                      <img
                        src="/assets/images/card_top_left.png"
                        className="w-card-top-img"
                        alt=""
                      />
                      <img
                        src="/assets/images/card_bottom_right.png"
                        className="w-card-bottom-img"
                        alt=""
                      />
                      <p className="card-holder-nm">XXXXXX</p>
                      <div className="card-num-date">
                        <p className="">.... .... .... XXXX</p>
                        <p className="">XX XXX XXXX</p>
                      </div>
                    </div>
                  </div>
                  <div className="swiper-slide">
                    <div
                      className="wallet-ac-inner"
                      // style="background-color:#24BEEF;"
                    >
                      <img
                        src="/assets/images/card_top_left.png"
                        className="w-card-top-img"
                        alt=""
                      />
                      <img
                        src="/assets/images/card_bottom_right.png"
                        className="w-card-bottom-img"
                        alt=""
                      />
                      <p className="card-holder-nm">XXXXXX</p>
                      <div className="card-num-date">
                        <p className="">.... .... .... XXXX</p>
                        <p className="">XX XXX XXXX</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <!-- If we need pagination --> */}
                <div className="swiper-pagination"></div>

                {/* <!-- If we need navigation buttons --> */}
                <div className="swiper-button-prev"></div>
                <div className="swiper-button-next"></div>

                {/* <!-- If we need scrollbar --> */}
                <div className="swiper-scrollbar"></div>
              </div>
            </div>

            <div className="wc-details-wrap">
              <div className="card-detail js-card-section" id="cardId_0">
                <table>
                  <tr>
                    <td>Bank</td>
                    <td>MCB Bank</td>
                  </tr>
                  <tr>
                    <td>Card Number</td>
                    <td>
                      <span>•••• •••• •••• 7430</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Expiry Date</td>
                    <td>MM/YY</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                </table>
              </div>
              <div className="card-detail js-card-section" id="cardId_1">
                <table>
                  <tr>
                    <td>Bank</td>
                    <td>HDFC Bank</td>
                  </tr>
                  <tr>
                    <td>Card Number</td>
                    <td>
                      <span>•••• •••• •••• 1111</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Expiry Date</td>
                    <td>MM/YY</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                </table>
              </div>
              <div className="card-detail js-card-section" id="cardId_2">
                <table>
                  <tr>
                    <td>Bank</td>
                    <td>ICICI Bank</td>
                  </tr>
                  <tr>
                    <td>Card Number</td>
                    <td>
                      <span>•••• •••• •••• 2222</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Expiry Date</td>
                    <td>MM/YY</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                </table>
              </div>
              <div className="card-detail js-card-section" id="cardId_3">
                <table>
                  <tr>
                    <td>Bank</td>
                    <td>SBI Bank</td>
                  </tr>
                  <tr>
                    <td>Card Number</td>
                    <td>
                      <span>•••• •••• •••• 3333</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Expiry Date</td>
                    <td>MM/YY</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Lorem Ipsum</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                </table>
              </div>
            </div>
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
