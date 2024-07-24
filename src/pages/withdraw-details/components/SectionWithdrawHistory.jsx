import React, { useContext } from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import LoaderWdrawHistory from "loaders/LoaderWdrawHistory";
import { withdrawConsts } from "constants/all";

const SectionWithdrawHistory = (props) => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const { withdraw_details = [] } = details || {};

  if (
    withdrawType === "bank" ||
    !withdraw_details ||
    withdraw_details.length <= 0
  )
    return null;
  return (
    <div className="wcr-innner-wrap wr-withdraw-his-wrap">
      <div className="font-16-quick wr-wh-title w-100 pb-4">
        Withdrawal History
      </div>
      <div className="wr-withdraw-his-data">
        <ul className="d-flex flex-wrap w-100 align-items-center">
          {isLoading
            ? [1, 2, 3].map((item) => (
                <li className="d-flex flex-wrap w-100" key={item}>
                  <div className="wh-status-icon">
                    <span></span>
                  </div>
                  <LoaderWdrawHistory className="wh-status-info" />
                </li>
              ))
            : withdraw_details.map((widro) => {
                const {
                  card_number = "",
                  refund_ref_id = "",
                  date = "",
                  status = "",
                  total_amount = "",
                } = widro || {};
                return (
                  <li className="d-flex flex-wrap w-100" key={card_number}>
                    <div className="wh-status-icon">
                      <span></span>
                    </div>
                    <div className="wh-status-info">
                      <div className="dark_black div-font-18 wh-card-num">
                        xxxx xxxx xxxx {card_number}
                      </div>
                      <div className="wh-id-date-wrap">
                        <div
                          className="div-font-14 wh-id"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          ID: {refund_ref_id}
                        </div>
                        <div className="div-font-14 wh-date">{date}</div>
                      </div>
                      <div className="wh-status-amt-wrap">
                        <div
                          className={`div-font-14 wh-status-div ${withdrawConsts?.[status]?.classText}`}
                        >
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
