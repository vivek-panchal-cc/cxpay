import React from "react";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { IconAddBackground, IconBank, IconRightArrowBig } from "styles/svgs";

const WithdrawBank = () => {
  return (
    <div className="settings-inner-sec wallet-ac-is wr-form-wrap">
      <div className="profile-info">
        <h3>Bank Withdraw</h3>
      </div>
      <Breadcrumb />
      <div className="wallet-fund-form-wrap">
        <form>
          <div className="row">
            <div className="col-12 col p-0">
              <div className="d-flex flex-column form-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bank name"
                  name="bank_name"
                  value=""
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-12 col-left p-0">
              <div className="d-flex flex-column form-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bank account number"
                  name="bank_acc_number"
                  value=""
                />
              </div>
            </div>
            <div className="col-lg-6 col-12 col-right p-0">
              <div className="d-flex flex-column form-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Swift Code"
                  name="swift-code"
                  value=""
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-0">
              <div className="form-field">
                <a className="form-add-cwrap cursor-pointer">
                  <IconAddBackground style={{ fill: "#24BEEF" }} />
                  <span>Link New Bank Account</span>
                </a>
              </div>
            </div>
          </div>
          <div className="row wr-form-choose-act">
            <div className="col-12 p-0">
              <div className="form-field cursor-pointer">
                <a className="form-choose-act-wrap">
                  <IconBank stroke="#363853" />
                  <span>Choose from Linked Banks</span>
                  <IconRightArrowBig stroke="#0081C5" />
                </a>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col p-0">
              <div className="d-flex flex-column form-field">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Payment specifications"
                  name="payment_specifications"
                  value=""
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-0 amt-with-currency">
              <span>ANG</span>
              <div className="d-flex flex-column form-field">
                <input
                  type="text"
                  inputmode="decimal"
                  id="transactionAmount"
                  className="form-control"
                  placeholder="Amount"
                  name="transactionAmount"
                  maxlength="10"
                  value=""
                />
              </div>
            </div>
          </div>
          <div className="row wbr-final-amt-wrap">
            <div className="col-12 p-0">
              <table>
                <tbody>
                  <tr>
                    <td>Fees</td>
                    <td className="amount">10.00</td>
                  </tr>
                  <tr>
                    <td>Total Amount</td>
                    <td className="amount">90.00</td>
                  </tr>
                  <tr>
                    <td>NAFl</td>
                    <td>90.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
              <div className="btn-wrap">
                <a className="btn outline-btn" href="/wallet">
                  Cancel
                </a>
              </div>
              <div className="btn-wrap">
                <input
                  type="submit"
                  className="btn btn-primary cursor-pointer opacity-75"
                  value="Submit Request"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WithdrawBank;
