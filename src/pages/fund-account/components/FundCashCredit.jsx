import React from "react";
import {
  IconBank,
  IconCaretDown,
  IconDownArrow,
  IconDownload,
  IconPlusBorder,
  IconUpload,
} from "styles/svgs";

function FundCashCredit() {
  return (
    <>
      <div class="settings-inner-sec wallet-ac-is">
        <div class="profile-info">
          <h3>Fund your account</h3>
          <ul class="breadcrumb">
            <li>
              <a href="#">Wallet</a>
            </li>
            <li>Fund Account</li>
          </ul>
        </div>
        <div class="wallet-fund-form-wrap">
          <form>
            <div class="row">
              <div class="col-12 p-0">
                <div class="form-field">
                  <div class="fc-bdetails-dd-wrap active">
                    <div class="fc-bdetails-dd-title ">
                      <IconBank stroke={"#363853"} />
                      <span>Bank Details</span>
                      <IconDownArrow storke={"#0081C5"} />
                    </div>
                    <div class="fc-bdetails-dd-content">
                      <table>
                        <tr>
                          <td>Bank Name : </td>
                          <td>Bank Name Here</td>
                        </tr>
                        <tr>
                          <td>Account Number : </td>
                          <td>1234567890</td>
                        </tr>
                        <tr>
                          <td>Swift Code : </td>
                          <td>1234567890</td>
                        </tr>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 p-0">
                <div class="form-field">
                  <input
                    type="text"
                    class="form-control"
                    id="amount"
                    placeholder="Amount"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-12 p-0">
                <div class="form-field">
                  <input
                    type="text"
                    class="form-control"
                    id="specification"
                    placeholder="Sepecification"
                  />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-12 p-0 btns-inline wallet-acc-fund-btns">
                <div class="btn-wrap">
                  <a href="#" class="btn outline-btn">
                    Cancel
                  </a>
                </div>
                <div class="btn-wrap">
                  <input type="submit" class="btn btn-primary" value="Fund" />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FundCashCredit;
