import React, { useContext } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { editProfileBusinessUserSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import InputFile from "components/ui/InputImage";
import { IconLeftArrow } from "styles/svgs";
import InputSelect from "components/ui/InputSelect";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import { CURRENCY_SYMBOL } from "constants/all";

function Businessform(props) {
  const { countryList, cityList } = props;
  const { profile } = useSelector((state) => state.userProfile);
  const {
    company_name,
    user_type,
    email,
    address,
    mobile_number,
    country_code,
    country,
    city,
    profile_image,
  } = profile;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: email || "", //not required for API
      address: address || "",
      mobile_number: mobile_number || "", //not required for API
      profile_image: profile_image || "",
      user_type: user_type || "",
      company_name: company_name || "",
      country_code: country_code,
      country: country || "",
      city: city || "",
    },
    validationSchema: editProfileBusinessUserSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setIsLoading(true);
      try {
        const formData = new FormData();
        for (let key in values) {
          if (key === "profile_image") continue;
          formData.append(key, values[key]);
        }
        formData.append("profile_image", values.profile_image);
        const { data } = await apiRequest.updateUser(formData);
        if (!data.success) throw data.message;
        toast.success(data.message);
        dispatch(fetchUserProfile());
        navigate("/setting", { replace: true });
      } catch (error) {
        setErrors({
          email: error.first_name?.[0],
          mobile_number: error.mobile_number?.[0],
          company_name: error.company_name?.[0],
          country: error.country?.[0],
          city: error.city?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });
  return (
    <div className="settings-edit-profile-right-sec">
      <div className="settings-edit-profile-inner-sec">
        <div className="settings-profile-bottom-info-sec">
          <form onSubmit={formik.handleSubmit}>
            <div className="settings-edit-profile-top-sec">
              <InputFile
                id="_upBusiness"
                name="profile_image"
                onChange={(e) => {
                  formik.setFieldValue(
                    "profile_image",
                    e.currentTarget.files[0]
                  );
                }}
                showPreview={true}
                showLabel={false}
                previewSrc={profile_image}
                fallbackSrc={
                  profile_image
                    ? profile_image
                    : "/assets/images/Business-account.png"
                }
                showLoader={true}
                classNameInput="d-none"
                classNameBorder="border-0 overflow-visible"
                classNameLabel="profile-avtar"
              />
              <div className="profile-info">
                <h3>{company_name}</h3>
                <p>
                  <a href={`mailto:${email}`}>{email}</a>
                </p>
                <p className="">
                  <label
                    htmlFor="fileInput_upBusiness"
                    className="cursor-pointer"
                    style={{ color: "#0081c5" }}
                  >
                    {profile_image || formik.values.profile_image
                      ? "Change Profile Picture"
                      : "Select Profile Picture"}
                  </label>
                  {!profile_image && !formik.values.profile_image ? (
                    <p className="red">
                      Note: Allowed formats are JPEG, PNG, JPG
                    </p>
                  ) : null}
                </p>
                <p className="text-danger">{formik.errors.profile_image}</p>
              </div>
            </div>
            <Input
              type="name"
              className="form-control"
              placeholder="Business Name"
              name="company_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.company_name}
              error={formik.touched.company_name && formik.errors.company_name}
            />
            <Input
              type="text"
              disabled
              className="form-control"
              placeholder="Mobile Number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile_number}
              error={
                formik.touched.mobile_number && formik.errors.mobile_number
              }
            />
            <Input
              type="text"
              disabled
              className="form-control"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              error={formik.touched.email && formik.errors.email}
              autoComplete={"new-email"}
            />
            <Input
              type="text"
              className="form-control"
              placeholder="address"
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
              error={formik.touched.address && formik.errors.address}
            />
            <div className="form-field two-fields">
              <div className="field-half">
                <InputSelect
                  className="form-select form-control"
                  name="country"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.country}
                  error={formik.touched.country && formik.errors.country}
                  disabled
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
                  {cityList[formik.values.country]?.map((city) => (
                    <option key={city.city_name} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                </InputSelect>
              </div>
            </div>
            <p className="currency-wrap">
              Currency:{" "}
              <span className="selected-currency">{CURRENCY_SYMBOL}</span>
            </p>
            <div className="login-btn">
              <div className="setting-btn-link">
                <Link to="/setting">
                  <IconLeftArrow style={{ stroke: "#0081C5" }} />
                  Settings
                </Link>
              </div>
              <input
                type="submit"
                className={`btn btn-primary ${
                  formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                }`}
                disabled={formik.isSubmitting}
                value="Save Changes"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Businessform;
