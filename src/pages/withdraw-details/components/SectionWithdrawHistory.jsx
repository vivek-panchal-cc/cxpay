import React from "react";

const SectionWithdrawHistory = () => {
  return (
    <div class="wcr-innner-wrap wr-withdraw-his-wrap">
      <div class="font-16-quick wr-wh-title w-100 pb-4">Withdrawal History</div>
      <div class="wr-withdraw-his-data">
        <ul class="d-flex flex-wrap w-100 align-items-center">
          {[1, 2, 3, 4].map((widro) => (
            <li class="d-flex flex-wrap w-100" key={widro}>
              <div class="wh-status-icon">
                <span></span>
              </div>
              <div class="wh-status-info">
                <div class="dark_black div-font-18 wh-card-num">
                  xxxx xxxx xxxx 1234
                </div>
                <div class="wh-id-date-wrap">
                  <div class="div-font-14 wh-id">ID: 123456456</div>
                  <div class="div-font-14 wh-date">24/05/2023 | 03:20 PM</div>
                </div>
                <div class="wh-status-amt-wrap">
                  <div class="div-font-14 wh-status-div green">SUCCESS</div>
                  <div class="div-font-18 wh-amt dark_black">-100 NAFl</div>
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
