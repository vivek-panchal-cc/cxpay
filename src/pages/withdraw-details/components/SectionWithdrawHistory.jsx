import WrapAmount from "components/wrapper/WrapAmount";
import React from "react";

const SectionWithdrawHistory = (props) => {
  const { withdraw_details } = props || {};

  return (
    <div className="wcr-innner-wrap wr-withdraw-his-wrap">
      <div className="font-16-quick wr-wh-title w-100 pb-4">
        Withdrawal History
      </div>
      <div className="wr-withdraw-his-data">
        <ul className="d-flex flex-wrap w-100 align-items-center">
          {withdraw_details.map((widro) => {
            const {
              card_number = "",
              refund_ref_id = "",
              date = "",
              status = "",
              total_amount = "",
            } = widro || {};
            return (
              <li className="d-flex flex-wrap w-100" key={widro}>
                <div className="wh-status-icon">
                  <span></span>
                </div>
                <div className="wh-status-info">
                  <div className="dark_black div-font-18 wh-card-num">
                    xxxx xxxx xxxx {card_number}
                  </div>
                  <div className="wh-id-date-wrap">
                    <div className="div-font-14 wh-id">ID: {refund_ref_id}</div>
                    <div className="div-font-14 wh-date">{date}</div>
                  </div>
                  <div className="wh-status-amt-wrap">
                    <div className="div-font-14 wh-status-div green">
                      {status}
                    </div>
                    <div className="div-font-18 wh-amt dark_black">
                      <WrapAmount value={total_amount} />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SectionWithdrawHistory;
