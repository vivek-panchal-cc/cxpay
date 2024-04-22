import React, { useEffect } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { linkBankSchema } from "schemas/walletSchema";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { useSelector } from "react-redux";
import useCountryBanks from "hooks/useCountryBanks";

const LinkBank = (props) => {
  const navigate = useNavigate();
  const [countryList, cityList] = useCountriesCities();
  const [banksList] = useCountryBanks();

  const { profile } = useSelector((state) => state.userProfile);
  const { first_name, last_name, email, address, city, country } =
    profile || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      account_type: "current",
      bank_name: "",
      // swift_code: "",
      bank_number: "",
      bank_holder_first_name: first_name || "",
      bank_holder_last_name: last_name || "",
      email: email || "",
      address: address || "",
      country: country || "",
      city: city || "",
    },
    validationSchema: linkBankSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      try {
        const { data } = await apiRequest.linkBank(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        navigate("/wallet/bank-list");
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          bank_name: error.bank_name?.[0],
          // swift_code: error.swift_code?.[0],
          bank_number: error.bank_number?.[0],
          bank_holder_first_name: error.bank_holder_first_name?.[0],
          bank_holder_last_name: error.bank_holder_last_name?.[0],
          email: error?.email?.[0],
          address: error?.address?.[0],
          country: error?.country?.[0],
          city: error?.city?.[0],
        });
        setStatus(error);
      }
    },
  });

  useEffect(() => {
    const type = formik.values.account_type;
    formik.resetForm();
    formik.setFieldValue("account_type", type);
  }, [formik.values.account_type]);

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
    <div>
      <div className="wallet-link-bank-bottom">
        <div className="profile-info rm-pl-profile-info">
          <h3>Link a Bank</h3>
          <ul className="breadcrumb">
            <li>
              <Link to="/wallet">Wallet</Link>
            </li>
            <li>Link A Bank</li>
          </ul>
        </div>
        <div className="wallet-bank_link-form-wrap">
          <form
            id="form_saving_acc_op"
            className="wallet_acc_form"
            onSubmit={formik.handleSubmit}
          >
            <div className="radio-wrap">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="saving_acc_op"
                  name="account_type"
                  value={"savings"}
                  onChange={formik.handleChange}
                />
                <label className="form-check-label" htmlFor="saving_acc_op">
                  Savings
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  id="current_acc_op"
                  name="account_type"
                  value={"current"}
                  onChange={formik.handleChange}
                  defaultChecked
                />
                <label className="form-check-label" htmlFor="current_acc_op">
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
            {/* <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text-uppercase"
                  inputMode="text"
                  className="form-control"
                  placeholder={"Swift Code"}
                  name="swift_code"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.swift_code}
                  error={formik.touched.swift_code && formik.errors.swift_code}
                />
              </div>
            </div> */}
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  inputMode="numeric"
                  className="form-control"
                  placeholder="Account Number"
                  name="bank_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bank_number}
                  error={
                    formik.touched.bank_number && formik.errors.bank_number
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
            <div className="form-field two-fields">
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
                    <option
                      key={city.city_name || index}
                      value={city.city_name}
                    >
                      {city.city_name}
                    </option>
                  ))}
                </InputSelect>
              </div>
            </div>

            <div className="row">
              <div className="col-12 p-0 btns-inline">
                <div className="setting-btn-link btn-wrap">
                  <Link
                    to="/wallet"
                    className="outline-btn w-100 text-center d-block"
                    replace
                  >
                    Cancel
                  </Link>
                </div>
                <div className="btn-wrap">
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Link"
                    disabled={formik.isSubmitting}
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

export default LinkBank;
