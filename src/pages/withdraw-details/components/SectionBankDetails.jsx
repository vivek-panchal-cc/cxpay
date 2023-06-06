import React from "react";

const SectionBankDetails = () => {
  return (
    <div className="pb-3 mb-3 border border-top-0 border-start-0 border-end-0">
      <p className="fs-6 text-center">Bank Details</p>
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
      </div>
    </div>
  );
};

export default SectionBankDetails;
