import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import InputSelect from "components/ui/InputSelect";
import { Link } from "react-router-dom";
import { FundContext } from "context/fundContext";
import DatePicker from "react-datepicker";
import { IconCalender, IconEyeClose, IconEyeOpen } from "styles/svgs";
import { CURRENCY_SYMBOL } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";

function FundCard() {
  const { formik, paymentDetails } = useContext(FundContext);
  const [showCvv, setShowCvv] = useState(false);

  const handleExpiryDateChange = (dt) => {
    const mmyy = dt?.toLocaleDateString("en", {
      month: "2-digit",
      year: "numeric",
    });
    formik.setFieldValue("expiry_full", dt);
    formik.setFieldValue("expiry_date", mmyy);
  };

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  return (
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
            value={formik.values.card_number}
            error={formik.touched.card_number && formik.errors.card_number}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-12 col-left col p-0">
          <div className="form-field position-relative z-2">
            <DatePicker
              id="datepickeradd-card"
              selected={formik.values.expiry_full}
              onChange={handleExpiryDateChange}
              name="expiry_date"
              dateFormat="MM/yyyy"
              className="form-control"
              placeholderText="Expiry Date"
              onBlur={formik.handleBlur}
              showMonthYearPicker
              showTwoColumnMonthYearPicker
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
              maxength="3"
              value={formik.values.security_code}
              error={
                formik.touched.security_code && formik.errors.security_code
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
            maxLength="10"
            name="transactionAmount"
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
      <div className="row">
        <div className="col-12 p-0">
          <div className="form-field wallet-cb-wrap">
            <input
              type="checkbox"
              id="save_card_acc"
              name="save_card"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.save_card && formik.errors.save_card}
            />
            <label htmlFor="save_card_acc">Save card on account</label>
          </div>
        </div>
      </div>
      <div className="payment-footer-block p-4">
        <ul>
          {paymentDetails?.allCharges?.map((item, index) => (
            <li key={item?.desc?.trim() || index}>
              <div className="payment-footer-col-label">{item?.desc}</div>
              <h4 className="amount d-flex justify-content-between">
                <span>{CURRENCY_SYMBOL}</span>
                <WrapAmount value={item?.amount} prefix="" />
              </h4>
            </li>
          ))}
          <li>
            <div className="payment-footer-col-label">Net Payable</div>
            <h4 className="amount d-flex justify-content-between">
              <span>{CURRENCY_SYMBOL}</span>
              <WrapAmount value={paymentDetails?.grandTotal} prefix="" />
            </h4>
          </li>
        </ul>
      </div>
      <div className="row">
        <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
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
          <div className="btn-wrap">
            <Link to={"/"} className="btn outline-btn" replace={true}>
              {"Skip >>"}
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FundCard;
