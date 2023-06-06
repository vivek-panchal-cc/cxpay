import React from "react";

const SectionTransactionDetails = () => {
  return (
    <div className="py-3 my-3 border border-start-0 border-end-0">
      <div className="row">
        <div className="col-6">
          <table className="w-100">
            <tbody>
              <tr>
                <td>Transaction Id:</td>
                <td>ABCD123XYZ1</td>
              </tr>
              <tr>
                <td>Date:</td>
                <td>06 Jun 2023</td>
              </tr>
              <tr>
                <td>Time:</td>
                <td>04:44 PM</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="col-6">
          <table className="w-100">
            <tbody>
              <tr>
                <td>Amount:</td>
                <td>500 ANG</td>
              </tr>
              <tr>
                <td>Fee:</td>
                <td>10 ANG</td>
              </tr>
              <tr>
                <td>Status:</td>
                <td>Success</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SectionTransactionDetails;
