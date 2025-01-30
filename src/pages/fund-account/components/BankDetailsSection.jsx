import { SystemOptionsContext } from "context/systemOptionsContext";
import useBankDetails from "hooks/useBankDetails";
import LoaderDiv from "loaders/LoaderDiv";
import React, { useCallback, useContext, useState } from "react";
import {
  IconBank,
  IconDownArrow,
  IconLeftArrow,
  IconRightArrowBig,
} from "styles/svgs";

const BankDetailsSection = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [toggle, setToggle] = useState(true);
  const [loading, details] = useBankDetails();
  const { BANK_NAME, BANK_ACCOUNT_NUMBER, SWIFT_CODE } =
    useContext(SystemOptionsContext);
  // const {
  //   bank_name = "",
  //   bank_account_number = "",
  //   swift_code = "",
  // } = details || {};

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

  const nextBank = () => {
    if (currentIndex < details.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevBank = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const {
    bank_name = "",
    account_number = "",
    account_name = "",
    country_name = "",
  } = details[currentIndex] || {};

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
            ? { maxHeight: "400px" }
            : { paddingBottom: "0", paddingTop: "0", maxHeight: "0" }),
        }}
      >
        <div className="scrollable-bank-details">
          <table>
            <tbody>
              <tr>
                <td>Bank Name : </td>
                <td>{loading ? showLoader() : bank_name || BANK_NAME}</td>
              </tr>
              <tr>
                <td>Account Number : </td>
                <td>
                  {loading
                    ? showLoader()
                    : account_number || BANK_ACCOUNT_NUMBER}
                </td>
              </tr>
              <tr>
                <td>Account Name : </td>
                <td>{loading ? showLoader() : account_name || SWIFT_CODE}</td>
              </tr>
              {country_name && (
                <tr>
                  <td>Country : </td>
                  <td>{loading ? showLoader() : country_name}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {details.length > 1 && (
          <>
            <div
              className={`left-arrow ${currentIndex === 0 ? "disabled" : ""}`}
              onClick={prevBank}
            >
              <IconLeftArrow stroke="#0081c5" />
            </div>
            <div
              className={`right-arrow ${
                currentIndex === details.length - 1 ? "disabled" : ""
              }`}
              onClick={nextBank}
            >
              <IconRightArrowBig stroke="#0081c5" />
            </div>
          </>
        )}
        {/* <table>
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
              <td>Account Name : </td>
              <td>{loading ? showLoader() : swift_code}</td>
            </tr>
          </tbody>
        </table> */}
      </div>
    </div>
  );
};

export default BankDetailsSection;
