import React, { useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { editProfileSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import FileInput from "components/ui/FileInput";
import { IconLeftArrow } from "styles/svgs";

function Businessform(props) {
  const { profile } = useSelector((state) => state.userProfile);
  const {
    company_name,
    user_type,
    email,
    mobile_number,
    country,
    city,
    profile_image,
  } = profile;
  const navigate = useNavigate();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company_name: company_name || "",
      user_type: user_type || "business",
      email: email || "",
      country: country || "",
      city: city || "",
      mobile_number: mobile_number || "",
      account_number: localStorage.getItem("account_number"),
      profile_image: profile_image || "",
    },
    validationSchema: editProfileSchema,
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
          email: error.first_name?.[0],
          mobile_number: error.mobile_number?.[0],
          company_name: error.company_name?.[0],
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
              <FileInput
                name="profile_image"
                onChange={(e) => {
                  formik.setFieldValue(
                    "profile_image",
                    e.currentTarget.files[0]
                  );
                }}
                error={formik.errors.profile_image}
                showPreview={true}
                showLabel={false}
                previewImg={profile_image}
                fallbackImg="/assets/images/profile-img.png"
                classNameInput="d-none"
                className="profile-avtar"
              />
              <div className="profile-info">
                <h3>{company_name}</h3>
                <p>
                  <a href="mailto:abcdef@gmail.com">{email}</a>
                </p>
                <p className="upload-profile-image">
                  <a href="/">Change Profile Picture</a>
                </p>
              </div>
            </div>
            <div className="form-field">
              <Input
                type="text"
                className="form-control"
                placeholder="Business Name"
                name="company_name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.company_name}
                error={
                  formik.touched.company_name && formik.errors.company_name
                }
              />
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
                <select
                  defaultValue="0"
                  className="form-select form-control"
                  aria-label="Default select example"
                >
                  <option value="0">Country</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </select>
              </div>
              <div className="field-half">
                <select
                  defaultValue="0"
                  className="form-select form-control"
                  aria-label="Default select example"
                >
                  <option value="0">City</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </select>
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
                className="btn btn-primary"
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
