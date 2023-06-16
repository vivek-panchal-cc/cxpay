import React from "react";

const SectionWithdrawHistory = () => {
  return (
    <div className="wcr-innner-wrap wr-withdraw-his-wrap">
      <div className="font-16-quick wr-wh-title w-100 pb-4">
        Withdrawal History
      </div>
      <div className="wr-withdraw-his-data">
        <ul className="d-flex flex-wrap w-100 align-items-center">
          {[1, 2, 3, 4].map((widro) => (
            <li className="d-flex flex-wrap w-100" key={widro}>
              <div className="wh-status-icon">
                <span></span>
              </div>
              <div className="wh-status-info">
                <div className="dark_black div-font-18 wh-card-num">
                  xxxx xxxx xxxx 1234
                </div>
                <div className="wh-id-date-wrap">
                  <div className="div-font-14 wh-id">ID: 123456456</div>
                  <div className="div-font-14 wh-date">
                    24/05/2023 | 03:20 PM
                  </div>
                </div>
                <div className="wh-status-amt-wrap">
                  <div className="div-font-14 wh-status-div green">SUCCESS</div>
                  <div className="div-font-18 wh-amt dark_black">-100 NAFl</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SectionWithdrawHistory;
