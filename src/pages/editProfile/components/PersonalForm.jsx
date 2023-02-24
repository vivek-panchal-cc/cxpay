import React from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { editProfilePersonalUserSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import InputFile from "components/ui/InputFile";
import { IconLeftArrow } from "styles/svgs";
import InputSelect from "components/ui/InputSelect";
// import FileInput from "components/ui/FileInput";

function PersonalForm(props) {
  const { countryList, cityList } = props;
  const { profile } = useSelector((state) => state.userProfile);
  const {
    first_name,
    last_name,
    user_type,
    email,
    mobile_number,
    country,
    city,
    profile_image,
  } = profile || {};

  const navigate = useNavigate();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: email || "", //not required for API
      mobile_number: mobile_number || "", //not required for API
      first_name: first_name || "",
      last_name: last_name || "",
      user_type: user_type || "",
      profile_image: profile_image || "",
      country_index: -1, //not required for API
      country: "",
      country_iso: "", //not required for API
      country_code: "",
      city: "",
    },
    validationSchema: editProfilePersonalUserSchema,
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
        navigate("/setting");
      } catch (error) {
        setErrors({
          email: error.email?.[0],
          mobile_number: error.mobile_number?.[0],
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
                id="_upPersonal"
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
                <h3>
                  {first_name} {last_name}
                </h3>
                <p>
                  <a href="mailto:">{email}</a>
                </p>
                <p className="">
                  <label
                    htmlFor="fileInput_upPersonal"
                    className="cursor-pointer"
                    style={{ color: "#0081c5" }}
                  >
                    Change Profile Picture
                  </label>
                </p>
              </div>
            </div>
            <div className="form-field two-fields mb-0">
              <div className="field-half">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="First Name"
                  name="first_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.first_name}
                  error={formik.touched.first_name && formik.errors.first_name}
                />
              </div>
              <div className="field-half">
                <Input
                  type="text"
                  className="form-control"
                  placeholder="Last Name"
                  name="last_name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.last_name}
                  error={formik.touched.last_name && formik.errors.last_name}
                />
              </div>
            </div>
            <div className="form-field">
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
            </div>
            <div className="form-field">
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
            </div>

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

export default PersonalForm;
