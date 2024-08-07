import React, { useContext } from "react";
import Input from "components/ui/Input";
import InputSelect from "components/ui/InputSelect";
import { Link } from "react-router-dom";
import { FundContext } from "context/fundContext";
import { CURRENCY_SYMBOL } from "constants/all";
import WrapAmount from "components/wrapper/WrapAmount";

function FundBank() {
  const { formik, countryList, cityList, paymentDetails, banksList } =
    useContext(FundContext);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="radio-wrap mb-4 mw-100">
        <div className="col-6 form-check">
          <input
            className="form-check-input"
            type="radio"
            id="saving_acc_op"
            name="account_type"
            value={"savings"}
            onChange={formik.handleChange}
            checked={formik.values.account_type === "savings" ? true : false}
          />
          <label className="w-100 form-check-label" htmlFor="saving_acc_op">
            Savings
          </label>
        </div>
        <div className="col-6 form-check">
          <input
            className="form-check-input"
            type="radio"
            id="current_acc_op"
            name="account_type"
            value={"current"}
            onChange={formik.handleChange}
            checked={formik.values.account_type === "current" ? true : false}
          />
          <label className="w-100 form-check-label" htmlFor="current_acc_op">
            Current
          </label>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col p-0">
          <InputSelect
            className="form-select form-control"
            name="bank_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bank_name}
            error={formik.touched.bank_name && formik.errors.bank_name}
          >
            <option value={""}>Select Bank</option>
            {banksList?.map((bank, index) => (
              <option key={bank?.id || index} value={bank.id}>
                {bank.bank_name}
              </option>
            ))}
          </InputSelect>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col p-0">
          <Input
            type="text"
            inputMode="numeric"
            className="form-control"
            placeholder={"Routing Number"}
            name="routing_number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.routing_number}
            error={
              formik.touched.routing_number && formik.errors.routing_number
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col p-0">
          <Input
            type="text"
            inputMode="numeric"
            className="form-control"
            placeholder="Account Number"
            name="bank_account_number"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bank_account_number}
            error={
              formik.touched.bank_account_number &&
              formik.errors.bank_account_number
            }
          />
        </div>
      </div>
      <div className="row">
        <div className="col-lg-6 col-12 col-left p-0">
          <Input
            type="name"
            className="form-control"
            placeholder="First Name"
            name="bank_holder_first_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bank_holder_first_name}
            error={
              formik.touched.bank_holder_first_name &&
              formik.errors.bank_holder_first_name
            }
          />
        </div>
        <div className="col-lg-6 col-12 col-right p-0">
          <Input
            type="name"
            className="form-control"
            placeholder="Last Name"
            name="bank_holder_last_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.bank_holder_last_name}
            error={
              formik.touched.bank_holder_last_name &&
              formik.errors.bank_holder_last_name
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
            id="address"
            className="form-control"
            placeholder="Address"
            name="address"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.address}
            error={formik.touched.address && formik.errors.address}
          />
        </div>
      </div>
      <div className="form-field two-fields mb-0">
        <div className="field-half">
          <InputSelect
            className="form-select form-control"
            name="country"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.country}
            error={formik.touched.country && formik.errors.country}
          >
            <option value={""}>Select Country</option>
            {countryList?.map((country, index) => (
              <option key={country?.iso || index} value={country.iso}>
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
            {cityList[formik.values.country]?.map((city, index) => (
              <option key={city?.city_name || index} value={city.city_name}>
                {city.city_name}
              </option>
            ))}
          </InputSelect>
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
            name="transactionAmount"
            onChange={formik.handleChange}
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
              id="save_bank_acc"
              name="save_bank"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.save_bank && formik.errors.save_bank}
            />
            <label htmlFor="save_bank_acc">Save Bank Account</label>
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

export default FundBank;
