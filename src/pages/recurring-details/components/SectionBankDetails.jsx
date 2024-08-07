import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import React, { useContext } from "react";

const SectionBankDetails = (props) => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );

  const { bank_account_number, bank_name, swift_code } = details || {};

  if (
    withdrawType === "card" ||
    !(bank_account_number && bank_name && swift_code)
  )
    return null;
  return (
    <div className="wr-bdatail-tbl pe-md-4">
      <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
        Bank Details
      </div>
      <table>
        <tbody>
          <tr>
            <td>Bank Name</td>
            <td>{bank_name}</td>
          </tr>
          <tr>
            <td>Account Number</td>
            <td>
              XXXX XXXX XXXX{" "}
              {bank_account_number
                ? bank_account_number?.substr(bank_account_number.length - 4)
                : "XXXX"}
            </td>
          </tr>
          {/* <tr>
            <td>Swift Code</td>
            <td>{swift_code}</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default SectionBankDetails;
