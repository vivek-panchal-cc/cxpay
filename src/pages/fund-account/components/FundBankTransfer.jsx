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

function FundBankTransfer(props) {
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
    account_type,
    address,
    bank_holder_first_name,
    bank_holder_last_name,
    bank_name,
    bank_number,
    city,
    country,
    email,
    id,
    mark_as_default,
    routing_number,
  } = userWallet.defaultBank || {};
  const { setIsLoading } = useContext(LoaderContext);
  const [countryList, cityList] = useCountriesCities();
  const [disbleCardField, setDisableCardField] = useState(false);

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
      bank_id: "",
      account_type: "",
      bank_name: "",
      routing_number: "",
      bank_account_number: "",
      bank_holder_first_name: first_name,
      bank_holder_last_name: last_name,
      email: userEmail,
      address: "",
      country: userCountry || "",
      country_index: country_index, // not required for API
      country_iso: country_iso, // not required for API
      city: userCity || "",
      transactionType: "PL",
      transactionAmount: "",
      txn_mode: "BANK",
      save_bank: false,
    },
    validationSchema: "",
    onSubmit: async (values, { setStatus, setErrors, resetForm }) => {
      setIsLoading(true);
      try {
        console.log(values);
        const { data } = await apiRequest.addFund(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        showPopupFunded(values.transactionAmount);
        resetForm();
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          account_type: error?.account_type?.[0],
          bank_name: error?.bank_name?.[0],
          routing_number: error?.routing_number?.[0],
          bank_account_number: error?.bank_account_number?.[0],
          bank_holder_first_name: error?.bank_holder_first_name?.[0],
          bank_holder_last_name: error?.bank_holder_last_name?.[0],
          email: error?.email?.[0],
          address: error?.address?.[0],
          country: error?.country?.[0],
          city: error?.city?.[0],
          transactionAmount: error?.transactionAmount?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await dispatch(fetchBanksList());
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!(id && bank_name && bank_number && email)) return;
    let country_iso = "";
    const country_index = countryList.findIndex((e) => {
      if (e.country_name === country) {
        country_iso = e.iso;
        return e;
      }
    });
    formik.setValues({
      ...formik.values,
      bank_id: id,
      account_type: account_type,
      bank_name: bank_name,
      routing_number: routing_number,
      bank_account_number: bank_number,
      bank_holder_first_name: bank_holder_first_name,
      bank_holder_last_name: bank_holder_last_name,
      email: email,
      address: address,
      country: country,
      country_index: country_index,
      country_iso: country_iso,
      city: city,
    });
    setDisableCardField(true);
  }, [id, bank_name, bank_number, email]);

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
                  defaultChecked
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
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
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
            <div className="row mb-2">
              <div className="col-6 p-0">
                <div className="form-field wallet-cb-wrap">
                  <input
                    type="checkbox"
                    id="save_bank_acc"
                    name="save_bank"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.save_bank && formik.errors.save_bank}
                  />
                  <label htmlFor="save_bank_acc">Save bank on account</label>
                </div>
              </div>
            </div>
            <div class="row wallet-fund-row-amt wallet-fund-row-amt-final">
              <div class="col-12 p-0">
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
