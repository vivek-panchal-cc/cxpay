import Input from "components/ui/Input";
import React, { useContext, useState } from "react";
import DatePicker from "react-datepicker";
import { IconCalender, IconEyeClose, IconEyeOpen } from "styles/svgs";
import InputSelect from "components/ui/InputSelect";
import { Link } from "react-router-dom";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { FundContext } from "context/fundContext";

function FundCreditCard(props) {
  const {
    formik,
    countryList,
    cityList,
    disbleCardField,
    handleSelectNewCard,
    handleSelectExistingCard,
  } = useContext(FundContext);
  const [showCvv, setShowCvv] = useState(false);
  const [addNewCard, setAddNewCard] = useState(false);

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: {},
  //   validationSchema: "",
  //   onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
  //     setIsLoading(true);
  //     try {
  //       const { data } = await apiRequest.addFund(values);
  //       if (!data.success) throw data.message;
  //       toast.success(data.message);
  //       showPopupFunded(values.transactionAmount);
  //       resetForm();
  //       setExpDate();
  //     } catch (error) {
  //       if (typeof error === "string") return toast.error(error);
  //       setErrors({
  //         card_number: error?.card_number?.[0],
  //         expiry_date: error?.expiry_date?.[0],
  //         security_code: error?.security_code?.[0],
  //         card_holder_first_name: error?.card_holder_first_name?.[0],
  //         card_holder_last_name: error?.card_holder_last_name?.[0],
  //         email: error?.email?.[0],
  //         billing_address: error?.billing_address?.[0],
  //         country: error?.country?.[0],
  //         city: error?.city?.[0],
  //         transactionAmount: error?.transactionAmount?.[0],
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  // });

  const handleNewCard = () => {
    setAddNewCard(true);
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
                    selected={formik.values.expiry_full}
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
                    formik.touched.billing_address &&
                    formik.errors.billing_address
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
                    formik.setFieldValue(
                      "country",
                      countryList[i]?.country_name
                    );
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="27"
                        viewBox="0 0 27 27"
                        fill="none"
                      >
                        <path
                          d="M0.519514 8.76035C1.47866 4.67137 4.67137 1.47866 8.76036 0.519513C11.7134 -0.173171 14.7866 -0.173171 17.7396 0.519513C21.8286 1.47866 25.0213 4.67138 25.9805 8.76036C26.6732 11.7134 26.6732 14.7866 25.9805 17.7396C25.0213 21.8286 21.8286 25.0213 17.7396 25.9805C14.7866 26.6732 11.7134 26.6732 8.76036 25.9805C4.67138 25.0213 1.47866 21.8286 0.519514 17.7396C-0.173171 14.7866 -0.173171 11.7134 0.519514 8.76035Z"
                          fill="#24BEEF"
                        />
                        <path
                          d="M13 18V8"
                          stroke="white"
                          strokeWidth="2.16959"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M8 13L18 13"
                          stroke="white"
                          strokeWidth="2.16959"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="33"
                      viewBox="0 0 35 33"
                      fill="none"
                    >
                      <path
                        d="M9.79956 8.80646H16.9315"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1.89258 18.1302H33.5363"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2.74805 23.2615H32.6813"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M1.20605 16.0254C1.20605 4.77455 5.28982 1.02539 17.5444 1.02539C29.7974 1.02539 33.8812 4.77455 33.8812 16.0254C33.8812 27.2746 29.7974 31.0254 17.5444 31.0254C5.28982 31.0254 1.20605 27.2746 1.20605 16.0254Z"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Choose from Existing Cards</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="8"
                      height="14"
                      viewBox="0 0 8 14"
                      fill="none"
                    >
                      <path
                        d="M1 12.3851L6.34 7.04508L1 1.70508"
                        stroke="#0081C5"
                        strokeWidth="2"
                        strokeMiterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
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
