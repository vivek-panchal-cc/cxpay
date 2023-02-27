import React, { useMemo } from "react";
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

function Businessform(props) {
  const { countryList, cityList } = props;
  const { profile } = useSelector((state) => state.userProfile);
  const {
    company_name,
    user_type,
    email,
    mobile_number,
    country_code,
    city,
    profile_image,
  } = profile;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { country_index, country_iso, country } = useMemo(() => {
    if (!country_code) return {};
    const cphonecode = parseInt(country_code);
    const country_index = countryList.findIndex(
      (e) => e.phonecode === cphonecode
    );
    const { iso, country_name } =
      countryList.find((e) => e.phonecode === cphonecode) || {};
    return { country_index, country_iso: iso, country: country_name };
  }, [country_code, countryList]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: email || "", //not required for API
      mobile_number: mobile_number || "", //not required for API
      profile_image: profile_image || "",
      user_type: user_type || "",
      company_name: company_name || "",
      country_index: country_index, //not required for API
      country: country || "",
      country_iso: country_iso || "", //not required for API
      country_code: country_code || "",
      city: city || "",
    },
    validationSchema: editProfileBusinessUserSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
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
        navigate("/setting");
      } catch (error) {
        setErrors({
          email: error.first_name?.[0],
          mobile_number: error.mobile_number?.[0],
          company_name: error.company_name?.[0],
          country: error.country?.[0],
          city: error.city?.[0],
        });
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
                error={formik.errors.profile_image}
                showPreview={profile_image}
                showLabel={false}
                previewSrc={profile_image}
                fallbackSrc={profile_image}
                classNameInput="d-none"
                classNameBorder="border-0 overflow-visible"
                classNameLabel="profile-avtar"
              />
              <div className="profile-info">
                <h3>{company_name}</h3>
                <p>
                  <a href="mailto:abcdef@gmail.com">{email}</a>
                </p>
                <p className="">
                  <label
                    htmlFor="fileInput_upBusiness"
                    className="cursor-pointer"
                    style={{ color: "#0081c5" }}
                  >
                    Change Profile Picture
                  </label>
                </p>
              </div>
            </div>
            <Input
              type="text"
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
              placeholder="Phone Number"
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
            <div className="form-field two-fields">
              <div className="field-half">
                <InputSelect
                  className="form-select form-control"
                  name="country_index"
                  onChange={({ currentTarget }) => {
                    const i = parseInt(currentTarget.value);
                    formik.setFieldValue("country_index", i);
                    formik.setFieldValue("country_iso", countryList[i].iso);
                    formik.setFieldValue(
                      "country_code",
                      countryList[i].phonecode
                    );
                    formik.setFieldValue(
                      "country",
                      countryList[i].country_name
                    );
                    formik.setFieldValue("city", "");
                  }}
                  onBlur={formik.handleBlur}
                  value={formik.values.country_index}
                  error={formik.touched.country && formik.errors.country}
                >
                  <option value={""}>Select Country</option>
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
            <p className="currency-wrap">
              Currency: <span className="selected-currency">Nafl</span>
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
