import { CURRENCY_SYMBOL } from "constants/all";
import React from "react";

const SectionTransactionDetails = (props) => {
  const {
    transaction_id = "",
    date = "",
    time = "",
    total_amount = "",
    fees = "",
    status = "",
  } = props || {};

  return (
    <div className="wcr-innner-wrap wcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div className="w-50-md wcr-transition-info wcr-transition-info-1">
        <table>
          <tbody>
            <tr>
              <td>Transection ID</td>
              <td>{transaction_id}</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>{date}</td>
            </tr>
            <tr>
              <td>Time</td>
              <td>{time}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-50-md wcr-transition-info wcr-transition-info-2">
        <table>
          <tbody>
            <tr>
              <td>Amount</td>
              <td>
                {total_amount} {CURRENCY_SYMBOL}
              </td>
            </tr>
            <tr>
              <td>Fees</td>
              <td>
                {fees} {CURRENCY_SYMBOL}
              </td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <span className="green">{status}</span>
                {/* <span className="green">Success</span> /{" "} */}
                {/* <span className="red">Failed</span> */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionTransactionDetails;
