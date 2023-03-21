import Input from "components/ui/Input";
import { LoaderContext } from "context/loaderContext";
import { useFormik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import { IconCalender, IconEyeClose, IconEyeOpen } from "styles/svgs";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { fetchCardsList } from "features/user/userWalletSlice";
import { apiRequest } from "helpers/apiRequests";
import Modal from "components/modals/Modal";
import AccountFundedPopup from "components/popups/AccountFundedPopup";

function FundCreditCard(props) {
  const { showPopupFunded } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userProfile, userWallet } = useSelector((state) => state);
  const {
    first_name,
    last_name,
    email: userEmail,
    city: userCity,
    country: userCountry,
  } = userProfile.profile || {};
  const {
    id,
    card_number,
    expiry_date,
    billing_address,
    card_holder_first_name,
    card_holder_last_name,
    city,
    country,
    email,
  } = userWallet.defaultCard || {};
  const { setIsLoading } = useContext(LoaderContext);
  const [countryList, cityList] = useCountriesCities();
  const [showCvv, setShowCvv] = useState(false);
  const [expDate, setExpDate] = useState();
  const [disbleCardField, setDisableCardField] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await dispatch(fetchCardsList());
      setIsLoading(false);
    })();
  }, []);

  const { country_index, country_iso } = useMemo(() => {
    let country_iso = "";
    if (!userCountry) return {};
    const country_index = countryList.findIndex((e) => {
      if (e.country_name === userCountry) {
        country_iso = e.iso;
        return e;
      }
    });
    return { country_index, country_iso };
  }, [countryList, userCountry]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      card_id: "",
      card_number: "",
      expiry_date: "", // mm/yyyy
      security_code: "",
      card_holder_first_name: first_name || "",
      card_holder_last_name: last_name || "",
      email: userEmail || "",
      billing_address: "",
      country: userCountry || "",
      country_index: country_index, // not required for API
      country_iso: country_iso, // not required for API
      city: userCity || "",
      transactionType: "PL",
      transactionAmount: "",
      txn_mode: "CARD",
      save_card: false,
    },
    validationSchema: "",
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.addFund(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        showPopupFunded(values.transactionAmount);
        resetForm();
        setExpDate();
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          card_number: error?.card_number?.[0],
          expiry_date: error?.expiry_date?.[0],
          security_code: error?.security_code?.[0],
          card_holder_first_name: error?.card_holder_first_name?.[0],
          card_holder_last_name: error?.card_holder_last_name?.[0],
          email: error?.email?.[0],
          billing_address: error?.billing_address?.[0],
          country: error?.country?.[0],
          city: error?.city?.[0],
          transactionAmount: error?.transactionAmount?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleExpiryDateChange = (dt) => {
    const mmyy = dt?.toLocaleDateString("en", {
      month: "2-digit",
      year: "numeric",
    });
    setExpDate(dt);
    formik.setFieldValue("expiry_date", mmyy);
  };

  useEffect(() => {
    if (!(id && card_number && expiry_date && email)) return;
    console.log("This is the ND");
    // setting country
    let country_iso = "";
    const country_index = countryList.findIndex((e) => {
      if (e.country_name === country) {
        country_iso = e.iso;
        return e;
      }
    });
    // setting card expiry
    const date = new Date();
    const moyr = expiry_date.split("/").map((item) => parseInt(item));
    date.setFullYear(moyr[1], moyr[0] - 1);
    setExpDate(date);
    setDisableCardField(true);
    formik.setValues({
      ...formik.values,
      card_id: id,
      card_number: card_number,
      expiry_date: expiry_date,
      security_code: "...",
      card_holder_first_name: card_holder_first_name,
      card_holder_last_name: card_holder_last_name,
      email: email,
      billing_address: billing_address,
      country: country,
      country_index: country_index,
      country_iso: country_iso,
      city: city,
    });
  }, [id, card_number, expiry_date, email]);

  return (
    <>
      <div className="settings-inner-sec wallet-ac-is">
        <div className="profile-info">
          <h3>Fund your account</h3>
          <Breadcrumb />
        </div>
        <div className="wallet-fund-form-wrap">
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
                  error={
                    formik.touched.card_number && formik.errors.card_number
                  }
                  disabled={disbleCardField}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 col-12 col-left col p-0">
                <div className="form-field position-relative z-1">
                  <DatePicker
                    id="datepickeradd-card"
                    selected={expDate}
                    onChange={handleExpiryDateChange}
                    name="expiry_date"
                    dateFormat="MM/yyyy"
                    className="form-control"
                    placeholderText="Expiration Date"
                    onBlur={formik.handleBlur}
                    showMonthYearPicker
                    disabled={disbleCardField}
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
                    placeholder="Security Code"
                    name="security_code"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    maxength="3"
                    value={formik.values.security_code}
                    error={
                      formik.touched.security_code &&
                      formik.errors.security_code
                    }
                    disabled={disbleCardField}
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
                  disabled={disbleCardField}
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
                  disabled={disbleCardField}
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
                  disabled={disbleCardField}
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
                    formik.touched.billing_address &&
                    formik.errors.billing_address
                  }
                  disabled={disbleCardField}
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
                    formik.setFieldValue(
                      "country",
                      countryList[i]?.country_name
                    );
                    formik.setFieldValue("city", "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.country_index}
                  error={formik.touched.country_index && formik.errors.country}
                  disabled={disbleCardField}
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
                  disabled={disbleCardField}
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
                <div className="form-field">
                  <Input
                    type="text"
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
            </div>
            <div className="row">
              <div className="p-0">
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
            <div className="row">
              <div className="col-12 p-0">
                <div className="form-field wallet-total-am-wrap">
                  Amount:{" "}
                  <span className="amount-total">
                    {formik.values.transactionAmount} Nafl
                  </span>
                </div>
              </div>
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
                    value="Fund"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default FundCreditCard;
