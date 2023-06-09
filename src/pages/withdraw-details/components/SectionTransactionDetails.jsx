import React from "react";

const SectionTransactionDetails = () => {
  return (
    <div class="wcr-innner-wrap wcr-innner-wrap-2 d-flex flex-wrap w-100">
      <div class="w-50-md wcr-transition-info wcr-transition-info-1">
        <table>
          <tbody>
            <tr>
              <td>Transection ID</td>
              <td>1234567890</td>
            </tr>
            <tr>
              <td>Date</td>
              <td>24/05/2023</td>
            </tr>
            <tr>
              <td>Time</td>
              <td>03:20 PM</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="w-50-md wcr-transition-info wcr-transition-info-2">
        <table>
          <tbody>
            <tr>
              <td>Amount</td>
              <td>100 NAFl</td>
            </tr>
            <tr>
              <td>Fees</td>
              <td>10 NAFl</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>
                <span class="green">Success</span> /{" "}
                <span class="red">Failed</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SectionTransactionDetails;
