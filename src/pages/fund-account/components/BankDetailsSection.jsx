import useBankDetails from "hooks/useBankDetails";
import LoaderDiv from "loaders/LoaderDiv";
import React, { useCallback } from "react";
import { IconBank, IconDownArrow } from "styles/svgs";

const BankDetailsSection = (props) => {
  const [loading, details] = useBankDetails();
  const {
    bank_name = "",
    bank_account_number = "",
    swift_code = "",
  } = details || {};

  const showLoader = useCallback(
    () => (
      <LoaderDiv
        height="14"
        width="80%"
        rx="2"
        ry="2"
        backgroundColor={"#cbf1fe80"}
        foregroundColor={"#0081c520"}
      />
    ),
    []
  );

  return (
    <div className="fc-bdetails-dd-wrap active">
      <div className="fc-bdetails-dd-title ">
        <IconBank stroke={"#363853"} />
        <span>Bank Details</span>
        <IconDownArrow storke={"#0081C5"} />
      </div>
      <div className="fc-bdetails-dd-content">
        <table>
          <tbody>
            <tr>
              <td>Bank Name : </td>
              <td>{loading ? showLoader() : bank_name}</td>
            </tr>
            <tr>
              <td>Account Number : </td>
              <td>{loading ? showLoader() : bank_account_number}</td>
            </tr>
            <tr>
              <td>Swift Code : </td>
              <td>{loading ? showLoader() : swift_code}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetailsSection;
