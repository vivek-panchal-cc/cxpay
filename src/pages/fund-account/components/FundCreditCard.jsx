import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Link, useNavigate } from "react-router-dom";
import Input from "components/ui/Input";
import InputSelect from "components/ui/InputSelect";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { FundContext } from "context/fundContext";
import {
  IconAddBackground,
  IconCalender,
  IconCard,
  IconEyeClose,
  IconEyeOpen,
  IconRightArrowBig,
} from "styles/svgs";
import { CURRENCY_SYMBOL, isAdminApprovedWithRenewCheck } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";
import Button from "components/ui/Button";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

function FundCreditCard(props) {
  const navigate = useNavigate();
  const {
    formik,
    paymentDetails,
    disbleCardField,
    handleSelectNewCard,
    handleSelectExistingCard,
    isNewCard,
  } = useContext(FundContext);

  const [showCvv, setShowCvv] = useState(false);
  const [addNewCard, setAddNewCard] = useState(false);
  const { profile } = useSelector((state) => state.userProfile);
  const { admin_approved } = profile || {};
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );

  useEffect(() => {
    if (formik.values.card_id) setAddNewCard(false);
    else setAddNewCard(true);
  }, [formik.values]);

  // const isNewCard = addNewCard;

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  const handleNewCard = () => {
    handleSelectNewCard();
  };

  const handleExpiryDateChange = (dt) => {
    const mmyy = dt?.toLocaleDateString("en", {
      month: "2-digit",
      year: "numeric",
    });
    formik.setFieldValue("expiry_full", dt);
    formik.setFieldValue("expiry_date", mmyy);
  };

  // useEffect(() => {
  //   const handlePopState = (state) => {
  //     console.log("CALLED11", state);
  //     const lostConfirm = confirm("Your work will be lost");
  //     if (lostConfirm) {
  //       // dispatch(fundPaymentReset());
  //       window.removeEventListener("popstate", handlePopState);
  //     } else {
  //       window.removeEventListener("popstate", handlePopState);
  //       navigate("/wallet/fund-account/credit-card");
  //       // window.history.pushState(null, document.title, window.location.href);
  //     }
  //   };
  //   window.addEventListener("popstate", handlePopState);
  //   // return () => {
  //   //   window.removeEventListener("popstate", handlePopState);
  //   // };
  // }, []);

  return (
    <>
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Fund your account</h3>
          <Breadcrumb skipIndexes={[1]} />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Card Number"
                  name="card_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={
                    disbleCardField
                      ? "X".repeat(12) + formik.values.card_number
                      : formik.values.card_number
                  }
                  error={
                    formik.touched.card_number && formik.errors.card_number
                  }
                  disabled={disbleCardField}
                />
              </div>
            </div>
            <div className="row">
              <div
                className={`${
                  isNewCard
                    ? "col-lg-6 col-12 col-left col p-0"
                    : "col-12 col p-0"
                }`}
              >
                <div className="form-field position-relative z-2">
                  <DatePicker
                    id="datepickeradd-card"
                    selected={formik.values.expiry_full}
                    onChange={handleExpiryDateChange}
                    name="expiry_date"
                    dateFormat="MM/yyyy"
                    className={`form-control ${
                      disbleCardField ? "cursor-not-allowed" : ""
                    }`}
                    placeholderText="Expiration Date"
                    onBlur={formik.handleBlur}
                    showMonthYearPicker
                    disabled={disbleCardField}
                  />
                  <label
                    htmlFor="datepickeradd-card"
                    className="position-absolute"
                    style={{ top: "12px", right: "20px" }}
                  >
                    <IconCalender stroke="#0081c5" />
                  </label>
                  <p className="text-danger ps-2 shadow-none">
                    {formik.touched.expiry_date && formik.errors.expiry_date}
                  </p>
                </div>
              </div>
              {isNewCard && (
                <div className="col-lg-6 col-12 col-right col p-0">
                  <div className="position-relative">
                    <Input
                      type={showCvv ? "text" : "password"}
                      inputMode="numeric"
                      className="form-control"
                      placeholder="CVV"
                      name="security_code"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      // maxLength="3"
                      value={formik.values.security_code}
                      error={
                        formik.touched.security_code &&
                        formik.errors.security_code
                      }
                    />
                    <span
                      className="eye-icon position-absolute"
                      style={{ top: "12px", right: "20px" }}
                    >
                      {showCvv ? (
                        <IconEyeOpen onClick={() => setShowCvv((e) => !e)} />
                      ) : (
                        <IconEyeClose onClick={() => setShowCvv((e) => !e)} />
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-12 p-0 amt-with-currency">
                <span>{CURRENCY_SYMBOL}</span>
                <Input
                  type="text"
                  inputMode="decimal"
                  id="transactionAmount"
                  className="form-control"
                  placeholder="Amount"
                  name="transactionAmount"
                  maxLength="10"
                  onChange={formik.handleChange}
                  // onBlur={formik.handleBlur}
                  onBlur={(e) => {
                    let value = e.target.value.trim();
                    // If the input value is empty, set it to '0.00'
                    if (!value) {
                      value = "0.00";
                    } else {
                      const hasDecimal = value.includes(".");
                      // If there's no decimal point, add .00
                      if (!hasDecimal) {
                        value += ".00";
                      } else {
                        // If there's only one digit after the decimal point, add another zero
                        const parts = value.split(".");
                        if (parts[1].length === 1) {
                          value += "0";
                        }
                      }
                    }
                    // Update the formik values with the formatted value
                    formik.setFieldValue("transactionAmount", value);
                    formik.handleBlur(e);
                  }}
                  value={formik.values.transactionAmount}
                  error={
                    formik.touched.transactionAmount &&
                    formik.errors.transactionAmount
                  }
                />
              </div>
            </div>

            {/* <div className="row">
              <div className="col-12 p-0 amt-with-currency">
                <span>{CURRENCY_SYMBOL}</span>
                <Input
                  type="text"
                  inputMode="decimal"
                  id="transactionAmount"
                  className="form-control"
                  placeholder="Amount"
                  name="transactionAmount"
                  maxLength="10"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.transactionAmount}
                  error={
                    formik.touched.transactionAmount &&
                    formik.errors.transactionAmount
                  }
                />
              </div>
            </div> */}
            <div className="row">
              <div className="col-12 p-0">
                {addNewCard ? (
                  <div className="form-field wallet-cb-wrap">
                    <input
                      type="checkbox"
                      id="save_card_acc"
                      name="save_card"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.save_card && formik.errors.save_card
                      }
                    />
                    <label htmlFor="save_card_acc">Save card on account</label>
                  </div>
                ) : (
                  <div className="form-field">
                    <a
                      onClick={handleNewCard}
                      className="form-add-cwrap cursor-pointer"
                    >
                      <IconAddBackground style={{ fill: "#24BEEF" }} />
                      <span>Add New Card</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 p-0">
                <div className="form-field cursor-pointer">
                  <a
                    onClick={() => handleSelectExistingCard(true)}
                    className="form-choose-act-wrap"
                  >
                    <IconCard style={{ stroke: "#363853" }} />
                    <span>Choose from Existing Cards</span>
                    <IconRightArrowBig style={{ stroke: "#0081C5" }} />
                  </a>
                </div>
              </div>
            </div>
            <div className="row wallet-fund-row-amt wallet-fund-row-amt-final">
              <div className="col-12 p-0">
                <table>
                  <tbody>
                    {paymentDetails?.allCharges?.map((item, index) => (
                      <tr key={item?.desc?.trim() || index}>
                        <td>{item?.desc}</td>
                        <td className="amount">
                          <WrapAmount value={item?.amount} />
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td>Net Payable</td>
                      <td>
                        <WrapAmount value={paymentDetails?.grandTotal} />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            {adminApprovedWithRenewCheck ? (
              <div className="row">
                <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
                  <div className="btn-wrap">
                    <Button
                      className="btn outline-btn"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                  </div>
                  <div className="btn-wrap">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      } ${formik.isValid ? "" : "opacity-75"}`}
                      disabled={formik.isSubmitting}
                      value="Fund"
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}

export default FundCreditCard;
