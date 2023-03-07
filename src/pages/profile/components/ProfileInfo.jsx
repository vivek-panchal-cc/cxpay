import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBusinessUrlSchema } from "schemas/validationSchema";
import { IconEdit } from "styles/svgs";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { toast } from "react-toastify";

const ProfileInfo = (props) => {
  const { profile } = props;
  const {
    user_type = "personal",
    email,
    business_url,
    country_code,
    mobile_number,
    country,
  } = profile || {};

  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();

  const handleEditUlr = () => {
    setIsEditable(!isEditable);
  };

  const formik = useFormik({
    initialValues: {
      business_url: "",
    },
    validationSchema: addBusinessUrlSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      try {
        const { data } = await apiRequest.updateBusinessUrl(values);
        if (data.success) {
          await dispatch(fetchUserProfile());
          setIsEditable(false);
          resetForm();
          toast.success("Business url updated successfully.");
        }
        if (!data.success || data.data === null) throw data.message;
      } catch (error) {
        setErrors({
          business_url: error?.business_url?.[0],
        });
      }
    },
  });

  return (
    <ul>
      {user_type !== "personal" && (
        <li>
          <div className="pi-title-div">Business URL</div>
          <div className="profile-info-right-desc">
            {!isEditable && (
              <>
                <p>{business_url ?? "-"}</p>
                <button
                  onClick={handleEditUlr}
                  className="edit-button border-0"
                >
                  <IconEdit />
                </button>
              </>
            )}
            {isEditable && (
              <form
                onSubmit={formik.handleSubmit}
                className="w-100 d-flex align-items-start gap-2 justify-content-between"
              >
                <div className="form-field mb-0">
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Add Business Url"
                    name="business_url"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.business_url}
                    error={
                      formik.touched.business_url && formik.errors.business_url
                    }
                  />
                </div>
                <button type="submit" className="edit-button">
                  <IconEdit />
                </button>
              </form>
            )}
          </div>
        </li>
      )}
      <li>
        <div className="pi-title-div">Email</div>
        <div className="profile-info-right-desc">
          <p>{email}</p>
        </div>
      </li>
      <li>
        <div className="pi-title-div">Phone no.</div>
        <div className="profile-info-right-desc">
          <p>
            + {country_code} {mobile_number}
          </p>
        </div>
      </li>
      <li>
        <div className="pi-title-div">Country</div>
        <div className="profile-info-right-desc">
          <p>{country}</p>
        </div>
      </li>
    </ul>
  );
};

export default ProfileInfo;
