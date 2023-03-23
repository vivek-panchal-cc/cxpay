import Input from "components/ui/Input";
import { LoaderContext } from "context/loaderContext";
import { useFormik } from "formik";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { fetchBanksList } from "features/user/userWalletSlice";
import { apiRequest } from "helpers/apiRequests";
import AccountFundedPopup from "components/popups/AccountFundedPopup";
import Modal from "components/modals/Modal";
import { FundContext } from "context/fundContext";

function FundBankTransfer(props) {
  const {
    formik,
    countryList,
    cityList,
    disbleBankField,
    handleSelectNewBank,
    handleSelectExistingBank,
  } = useContext(FundContext);
  const [addNewBank, setAddNewBank] = useState(false);

  // const formik = useFormik({
  //   enableReinitialize: true,
  //   initialValues: {
  //     bank_id: "",
  //     account_type: "",
  //     bank_name: "",
  //     routing_number: "",
  //     bank_account_number: "",
  //     bank_holder_first_name: first_name,
  //     bank_holder_last_name: last_name,
  //     email: userEmail,
  //     address: "",
  //     country: userCountry || "",
  //     country_index: country_index, // not required for API
  //     country_iso: country_iso, // not required for API
  //     city: userCity || "",
  //     transactionType: "PL",
  //     transactionAmount: "",
  //     txn_mode: "BANK",
  //     save_bank: false,
  //   },
  //   validationSchema: "",
  //   onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
  //     setIsLoading(true);
  //     try {
  //       console.log(values);
  //       const { data } = await apiRequest.addFund(values);
  //       if (!data.success) throw data.message;
  //       toast.success(data.message);
  //       showPopupFunded(values.transactionAmount);
  //       resetForm();
  //     } catch (error) {
  //       if (typeof error === "string") return toast.error(error);
  //       setErrors({
  //         account_type: error?.account_type?.[0],
  //         bank_name: error?.bank_name?.[0],
  //         routing_number: error?.routing_number?.[0],
  //         bank_account_number: error?.bank_account_number?.[0],
  //         bank_holder_first_name: error?.bank_holder_first_name?.[0],
  //         bank_holder_last_name: error?.bank_holder_last_name?.[0],
  //         email: error?.email?.[0],
  //         address: error?.address?.[0],
  //         country: error?.country?.[0],
  //         city: error?.city?.[0],
  //         transactionAmount: error?.transactionAmount?.[0],
  //       });
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  // });

  const handleNewBank = () => {
    setAddNewBank(true);
    handleSelectNewBank();
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
            <div className="radio-wrap mb-4 mw-100">
              <div className="col-6 form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="saving_acc_op"
                  name="account_type"
                  value={"savings"}
                  onChange={formik.handleChange}
                  checked={
                    formik.values.account_type === "savings" ? true : false
                  }
                  disabled={disbleBankField}
                />
                <label
                  className="w-100 form-check-label"
                  htmlFor="saving_acc_op"
                >
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
                  checked={
                    formik.values.account_type === "current" ? true : false
                  }
                  disabled={disbleBankField}
                />
                <label
                  className="w-100 form-check-label"
                  htmlFor="current_acc_op"
                >
                  Current
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Bank Name"
                  name="bank_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bank_name}
                  error={formik.touched.bank_name && formik.errors.bank_name}
                  disabled={disbleBankField}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  className="form-control"
                  placeholder={
                    formik.values.account_type === "savings"
                      ? "Routing Number"
                      : "Routing Number"
                  }
                  name="routing_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.routing_number}
                  error={
                    formik.touched.routing_number &&
                    formik.errors.routing_number
                  }
                  disabled={disbleBankField}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="number"
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
                  disabled={disbleBankField}
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
            <div className="row">
              <div className="col-12 p-0">
                {addNewBank ? (
                  <div className="form-field wallet-cb-wrap">
                    <input
                      type="checkbox"
                      id="save_bank_acc"
                      name="save_bank"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.save_bank && formik.errors.save_bank
                      }
                    />
                    <label for="save_bank_acc">Save Bank Account</label>
                  </div>
                ) : (
                  <div className="form-field">
                    <a
                      onClick={handleNewBank}
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
                        ></path>
                        <path
                          d="M13 18V8"
                          stroke="white"
                          strokeWidth="2.16959"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M8 13L18 13"
                          stroke="white"
                          strokeWidth="2.16959"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                      <span>Link New Bank Account</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="row">
              <div className="col-12 p-0">
                <div className="form-field">
                  <a
                    onClick={() => handleSelectExistingBank(true)}
                    className="form-choose-act-wrap"
                  >
                    <svg
                      width="29"
                      height="29"
                      viewBox="0 0 29 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.5 1L2.5 7H26.5L14.5 1Z"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.5 11V23"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.5 11V23"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23.5 11V23"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M1 27.5H27.5"
                        stroke="#363853"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Choose from Linked Banks</span>
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
                        stroke-miterlimit="10"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="row wallet-fund-row-amt wallet-fund-row-amt-final">
              <div className="col-12 p-0">
                <table>
                  <tr>
                    <td>Fees</td>
                    <td>0 Nafl</td>
                  </tr>
                  <tr>
                    <td>Amount Pending</td>
                    <td> {formik.values.transactionAmount} Nafl </td>
                  </tr>
                </table>
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

export default FundBankTransfer;
