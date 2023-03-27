import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import InputSelect from "components/ui/InputSelect";
import { Link, useNavigate } from "react-router-dom";
import { FundContext } from "context/fundContext";
import DatePicker from "react-datepicker";
import { IconCalender, IconEyeClose, IconEyeOpen } from "styles/svgs";

function FundCard() {
  const { formik, countryList, cityList, chargesDetails } =
    useContext(FundContext);
  const [showCvv, setShowCvv] = useState(false);

  const handleExpiryDateChange = (dt) => {
    const mmyy = dt?.toLocaleDateString("en", {
      month: "2-digit",
      year: "numeric",
    });
    formik.setFieldValue("expiry_full", dt);
    formik.setFieldValue("expiry_date", mmyy);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="row">
        <div className="col-12 col p-0">
          <Input
            type="text"
            className="form-control"
            placeholder="Credit Card Number"
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
          <div className="form-field position-relative z-1">
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
            />
            <label
              htmlFor="datepickeradd-card"
              className="position-absolute"
              style={{ top: "14px", right: "20px" }}
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
              style={{ top: "14px", right: "20px" }}
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
        <div className="col-lg-6 col-12 col-left p-0">
          <Input
            type="name"
            className="form-control"
            placeholder="First Name"
            name="card_holder_first_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.card_holder_first_name}
            error={
              formik.touched.card_holder_first_name &&
              formik.errors.card_holder_first_name
            }
          />
        </div>
        <div className="col-lg-6 col-12 col-right p-0">
          <Input
            type="name"
            className="form-control"
            placeholder="Last Name"
            name="card_holder_last_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.card_holder_last_name}
            error={
              formik.touched.card_holder_last_name &&
              formik.errors.card_holder_last_name
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 p-0">
          <Input
            type="text"
            className="form-control"
            placeholder="Email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 p-0">
          <Input
            type="text"
            id="billing_address"
            className="form-control"
            placeholder="Billing Address"
            name="billing_address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.billing_address}
            error={
              formik.touched.billing_address && formik.errors.billing_address
            }
          />
        </div>
      </div>
      <div className="form-field two-fields mb-0">
        <div className="field-half">
          <InputSelect
            className="form-select form-control"
            name="country_index"
            onChange={({ currentTarget }) => {
              const i = parseInt(currentTarget.value);
              formik.setFieldValue("country_index", i);
              formik.setFieldValue("country_iso", countryList[i]?.iso);
              formik.setFieldValue("country", countryList[i]?.country_name);
              formik.setFieldValue("city", "");
            }}
            onBlur={formik.handleBlur}
            value={formik.values.country_index}
            error={formik.touched.country_index && formik.errors.country}
          >
            <option value={"-1"}>Select Country</option>
            {countryList?.map((country, index) => (
              <option key={index} value={index}>
                {country.country_name}
              </option>
            ))}
          </InputSelect>
        </div>
        <div className="field-half">
          <InputSelect
            className="form-select form-control"
            name="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            error={formik.touched.city && formik.errors.city}
          >
            <option value={""}>Select City</option>
            {cityList[formik.values.country_iso]?.map((city, index) => (
              <option key={index} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </InputSelect>
        </div>
      </div>
      <div className="row">
        <div className="col-12 p-0">
          <Input
            type="number"
            id="transactionAmount"
            className="form-control"
            placeholder="Amount"
            name="transactionAmount"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
      <div className="row wallet-fund-row-amt wallet-fund-row-amt-final">
        <div className="col-12 p-0">
          <table>
            <tr>
              <td>Fees</td>
              <td>{chargesDetails?.percentage} %</td>
            </tr>
            <tr>
              <td>Amount</td>
              <td> {formik.values.chargedAmount} Nafl </td>
            </tr>
          </table>
        </div>
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
            <Link to={"/"} className="btn outline-btn py-2" replace={true}>
              {"Skip >>"}
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}

export default FundCard;
