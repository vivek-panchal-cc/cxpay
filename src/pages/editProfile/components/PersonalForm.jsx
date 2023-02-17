import React from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { editProfilePersonalUserSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
// import FileInput from "components/ui/FileInput";

function PersonalForm(props) {
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
  } = profile;
  const navigate = useNavigate();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: first_name || "",
      last_name: last_name || "",
      user_type: user_type || "personal",
      email: email || "",
      country: country || "",
      city: city || "",
      mobile_number: mobile_number || "",
      account_number: localStorage.getItem("account_number"),
      profile_image: profile_image || "",
    },
    validationSchema: editProfilePersonalUserSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      console.log(values);
      try {
        const { data } = await apiRequest.updateUser(values);
        if (!data.success || data.data === null) throw data.message;
        toast.success(data.message);
        navigate("/settings");
      } catch (error) {
        setErrors({
          email: error.email?.[0],
          mobile_number: error.mobile_number?.[0],
        });
      }
    },
  });
  return (
    <div className="container-fluid">
      <div className="row profile-page">
        <div className="col-12 col-lg-9 dashboard-right-sec settings-edit-profile-right-sec">
          <div className="settings-edit-profile-inner-sec">
            <div className="settings-edit-profile-top-sec">
              <div className="profile-avtar">
                <img src={profile_image} alt="profile pic" />
              </div>
              <div className="profile-info">
                <h3>
                  {first_name} {last_name}
                </h3>
                <p>
                  <a href="mailto:">{email}</a>
                </p>
                {/* <FileInput
                  name="profile_image"
                  onChange={(e) => {
                    formik.setFieldValue(
                      "profile_image",
                      e.currentTarget.files[0]
                    );
                  }}
                  preview={profile_image}
                  error={formik.errors.profile_image}
                  showPreview={true}
                  showLabel={true}
                  labelText="Change Profile Picture"
                  //defaultImg="/assets/images/profile-img.png"
                  classNameInput="d-none"
                /> */}
              </div>
            </div>
            <div className="settings-profile-bottom-info-sec">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-field two-fields">
                  <div className="field-half">
                    <Input
                      type="text"
                      className="form-control"
                      placeholder="First Name"
                      name="first_name"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.first_name}
                      error={
                        formik.touched.first_name && formik.errors.first_name
                      }
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
                      error={
                        formik.touched.last_name && formik.errors.last_name
                      }
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
                      formik.touched.mobile_number &&
                      formik.errors.mobile_number
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
                    <a href="/">
                      <svg
                        width="8"
                        height="14"
                        viewBox="0 0 8 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7 13L1 7L7 1"
                          stroke="#0081C5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      Settings
                    </a>
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
      </div>
    </div>
  );
}

export default PersonalForm;
