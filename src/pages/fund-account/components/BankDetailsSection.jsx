import useBankDetails from "hooks/useBankDetails";
import LoaderDiv from "loaders/LoaderDiv";
import React, { useCallback, useState } from "react";
import { IconBank, IconDownArrow } from "styles/svgs";

const BankDetailsSection = (props) => {
  const [toggle, setToggle] = useState(true);
  const [loading, details] = useBankDetails();
  const {
    bank_name = "",
    bank_account_number = "",
    swift_code = "",
  } = details || {};

  const showLoader = useCallback(
    () => (
      <LoaderDiv
        rx="2"
        ry="2"
        height="14"
        width="80%"
        backgroundColor={"#cbf1fe80"}
        foregroundColor={"#0081c520"}
      />
    ),
    []
  );

  return (
    <div className="fc-bdetails-dd-wrap active">
      <div
        className="fc-bdetails-dd-title"
        onClick={() => setToggle((cs) => !cs)}
      >
        <IconBank stroke={"#363853"} />
        <span>Bank Details</span>
        <IconDownArrow
          stroke={"#0081c5"}
          style={{
            transition: "all 0.5s linear",
            ...(toggle
              ? { transform: "rotate(180deg)" }
              : { transform: "rotate(0deg)" }),
          }}
        />
      </div>
      <div
        className="fc-bdetails-dd-content overflow-hidden"
        style={{
          transition: "all 0.5s linear",
          ...(toggle
            ? { maxHeight: "250px" }
            : { paddingBottom: "0", paddingTop: "0", maxHeight: "0" }),
        }}
      >
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
            {/* <tr>
              <td>Swift Code : </td>
              <td>{loading ? showLoader() : swift_code}</td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankDetailsSection;
