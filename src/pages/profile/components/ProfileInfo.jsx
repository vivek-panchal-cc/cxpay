import Input from "components/ui/Input";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addBusinessUrlSchema } from "schemas/validationSchema";
import { IconCross, IconEdit, IconSave } from "styles/svgs";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { Link } from "react-router-dom";
import useCountriesCities from "hooks/useCountriesCities";

const ProfileInfo = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const [countryList] = useCountriesCities();
  const { profile } = props;
  const {
    user_type = "personal",
    email,
    business_url,
    country_code,
    mobile_number,
    is_email_verify,
  } = profile || {};

  const [isEditable, setIsEditable] = useState(false);
  const dispatch = useDispatch();

  const handleEditUlr = () => {
    setIsEditable(!isEditable);
  };

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.resendVerifyEmail();
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      business_url: "",
    },
    validationSchema: addBusinessUrlSchema,
    onSubmit: async (values, { resetForm, setStatus, setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.updateBusinessUrl(values);
        if (!data.success) throw data.message;
        setIsEditable(false);
        await dispatch(fetchUserProfile());
        toast.success("Business url updated successfully.");
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          business_url: error?.business_url?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("business_url", business_url);
  }, [business_url]);

  return (
    <ul>
      {user_type !== "personal" && (
        <li>
          <div className="pi-title-div">Business URL</div>
          <div className="profile-info-right-desc with-edit-ic">
            {!isEditable && (
              <div className="d-flex align-items-center">
                <Link
                  to={business_url}
                  target="_blank"
                  className="text-break w-100"
                >
                  {business_url ?? "-"}
                </Link>
                <button
                  type="button"
                  onClick={handleEditUlr}
                  className="edit-button border-0 ms-3"
                >
                  <IconEdit />
                </button>
              </div>
            )}
            {isEditable && (
              <form
                onSubmit={formik.handleSubmit}
                className="w-100 d-flex align-items-start gap-2 justify-content-between profile-edit-form-wrap"
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
                <button
                  type="submit"
                  className="edit-button"
                  disabled={formik.isSubmitting}
                >
                  <IconSave />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditable(false)}
                  className="edit-button"
                >
                  <IconCross style={{ stroke: "#0081C5" }} />
                </button>
              </form>
            )}
          </div>
        </li>
      )}
      <li>
        <div className="pi-title-div">Email</div>
        <div className="profile-info-right-desc">
          <div className="d-flex justify-content-center align-items-center column-gap-3">
            <p className="">{email}</p>
            {!is_email_verify && (
              <button
                type="button"
                className="badge rounded-pill text-bg-primary border-0 border-primary"
                onClick={handleVerifyEmail}
              >
                Verify Email
              </button>
            )}
          </div>
        </div>
      </li>
      <li>
        <div className="pi-title-div">Phone No.</div>
        <div className="profile-info-right-desc">
          <p>
            + {country_code} {mobile_number}
          </p>
        </div>
      </li>
      <li>
        <div className="pi-title-div">Country</div>
        <div className="profile-info-right-desc">
          <p>
            {
              countryList?.find(
                ({ phonecode }) =>
                  phonecode.toString() === country_code.toString()
              )?.country_name
            }
          </p>
        </div>
      </li>
    </ul>
  );
};

export default ProfileInfo;
