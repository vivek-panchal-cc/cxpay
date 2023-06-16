import React from "react";

const SectionBankDetails = () => {
  return (
    <div className="wr-bdatail-tbl pe-md-4">
      <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
        Bank Details
      </div>
      <table>
        <tr>
          <td>Bank Name</td>
          <td>MCB Bank</td>
        </tr>
        <tr>
          <td>Account Number</td>
          <td>112233445566778899</td>
        </tr>
        <tr>
          <td>Swift Code</td>
          <td>ABC123456</td>
        </tr>
      </table>
    </div>
  );
};

export default SectionBankDetails;
