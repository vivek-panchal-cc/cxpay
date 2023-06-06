import React from "react";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { useFormik } from "formik";
import { CURRENCY_SYMBOL } from "constants/all";
import Input from "components/ui/Input";
import { Link } from "react-router-dom";

const WithdrawCard = () => {
  const formik = useFormik({
    initialValues: {},
    validationSchema: "",
    onSubmit: () => {},
  });

  return (
    <div>
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Withdraw from card</h3>
          <Breadcrumb />
        </div>
        <div className="wallet-fund-form-wrap">
          <form onSubmit={formik.handleSubmit}>
            <div className="row">
              <div className="col-12 p-0">
                <Input
                  type="text"
                  id="billing_address"
                  className="form-control"
                  placeholder="Sepecification"
                  name="billing_address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  // value={formik.values}
                  // error={formik.touched && formik.errors}
                />
              </div>
            </div>
            <div className="row">
              <p className="text-dark"> Please ener amount to refund </p>
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
                  // value={formik.values}
                  // error={formik.touched && formik.errors}
                />
              </div>
            </div>
            {/* <!-- payment blocks footer section starts --> */}
            <div className="payment-footer-block">
              <ul>
                <li className="">
                  <div className="payment-footer-col-label">Amount</div>
                  <div className="amount-currency-wrap justify-content-end">
                    <h4 className="amount">
                      <span>{CURRENCY_SYMBOL}</span>
                      {500}
                    </h4>
                  </div>
                </li>
                <li className="">
                  <div className="payment-footer-col-label">Fees 1</div>
                  <div className="amount-currency-wrap justify-content-end">
                    <h4 className="amount">
                      <span>{CURRENCY_SYMBOL}</span>
                      {500}
                    </h4>
                  </div>
                </li>
              </ul>
            </div>
            <div className="row">
              <div className="col-12 p-0 btns-inline wallet-acc-fund-btns">
                <div className="btn-wrap">
                  <Link to="/wallet" replace className="btn outline-btn">
                    Cancel
                  </Link>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    className={`btn btn-primary ${
                      formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                    } ${formik.isValid ? "" : "opacity-75"}`}
                    disabled={formik.isSubmitting}
                    value="Submit Request"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WithdrawCard;
