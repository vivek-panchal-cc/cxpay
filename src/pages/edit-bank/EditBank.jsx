import React from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { EditBankSchema } from "schemas/walletSchema";
import Breadcrumb from "components/breadcrumb/Breadcrumb";
import InputSelect from "components/ui/InputSelect";
import useCountriesCities from "hooks/useCountriesCities";
import { useDispatch, useSelector } from "react-redux";
import { setEditBank } from "features/user/userProfileSlice";

const EditBank = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [countryList, cityList] = useCountriesCities();
  const { bank } = useSelector((state) => state.userProfile);
  const {
    email,
    city,
    country,
    account_type,
    bank_holder_first_name,
    bank_holder_last_name,
    bank_name,
    bank_number,
    id,
    routing_number,
    address,
  } = bank || {};

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: id || "",
      email: email || "",
      country: country || "",
      city: city || "",
      address: address || "",
      bank_holder_first_name: bank_holder_first_name || "",
      bank_holder_last_name: bank_holder_last_name || "",
    },
    validationSchema: EditBankSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      try {
        const { data } = await apiRequest.updateBank(values);
        if (!data.success) throw data.message;
        toast.success(data.message);
        await dispatch(setEditBank({}));
        navigate("/wallet/bank-list", { replace: true });
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          routing_number: error.routing_number?.[0],
          bank_number: error.bank_number?.[0],
          email: error?.email?.[0],
          country: error?.country?.[0],
          city: error?.city?.[0],
        });
        setStatus(error);
      }
    },
  });

  if (!bank || Object.keys(bank).length <= 0)
    return <Navigate to={"/wallet/bank-list"} replace />;
  return (
    <div>
      <div className="wallet-link-bank-bottom">
        <div className="profile-info rm-pl-profile-info">
          <h3>Edit Bank</h3>
          <Breadcrumb />
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
                  defaultChecked={account_type === "savings"}
                  disabled
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
                  defaultChecked={account_type === "current"}
                  disabled
                />
                <label className="form-check-label" htmlFor="current_acc_op">
                  Current
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  className="form-control opacity-75"
                  placeholder="Bank Name"
                  name="bank_name"
                  value={bank_name}
                  disabled
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  inputMode="numeric"
                  className="form-control opacity-75"
                  placeholder="Routing Number"
                  name="routing_number"
                  value={routing_number}
                  disabled
                />
              </div>
            </div>
            <div className="row">
              <div className="col-12 col p-0">
                <Input
                  type="text"
                  inputMode="numeric"
                  className="form-control opacity-75"
                  placeholder="Account Number"
                  name="bank_number"
                  value={bank_number}
                  disabled
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
                  {countryList?.map((country) => (
                    <option key={country.iso} value={country.iso}>
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
                    <option key={city.city_name} value={city.city_name}>
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
                    to="/wallet/bank-list"
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
                    value="Save Changes"
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

export default EditBank;
