import React, { useEffect, useContext } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import InputSelect from "components/ui/InputSelect";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { IconLeftArrow } from "styles/svgs";
import { businessInfoSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import { LoaderContext } from "context/loaderContext";
import { LoginContext } from "context/loginContext";
import { isComponentDisabled } from "constants/all";

const BusinessForm = (props) => {
  const { countryList, profile } = props;
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const disableComponent = isComponentDisabled(
    profile.admin_approved,
    show_renew_section
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);

  const formik = useFormik({
    initialValues: {
      business_url: profile?.business_url,
      business_id: "",
      business_country: "",
    },
    validationSchema: businessInfoSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.updateBusinessData(values);
        if (data.success) {
          dispatch(fetchUserProfile());
          toast.success("Business data updated successfully.");
          navigate("/setting");
        }
        if (!data.success) throw data.message;
      } catch (error) {
        if (typeof error === "string") return toast.error(error);
        setErrors({
          business_url: error?.business_url?.[0],
          business_id: error?.business_id?.[0],
          business_country: error?.business_country?.[0],
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("business_url", profile?.business_url ?? "");
    formik.setFieldValue("business_id", profile?.business_id ?? "");
    formik.setFieldValue("business_country", profile?.business_country ?? "");
  }, [profile]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="form-field business-url-field">
        <p>Business URL</p>
        <Input
          type="text"
          className="form-control"
          id="business-url"
          name="business_url"
          placeholder="Business URL"
          value={formik.values.business_url}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.business_url && formik.errors.business_url}
        />
      </div>
      <div className="form-field business-id-field">
        <p>
          Chamber of Commerce{" "}
          <span className="smaller-note">(not older than 2 months)</span>
        </p>
        <Input
          type="text"
          className={`form-control ${
            profile.admin_approved ? "disabled-field" : ""
          }`}
          id="business-id"
          name={profile.admin_approved ? "" : "business_id"}
          placeholder="Chamber of Commerce"
          value={formik.values.business_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.business_id && formik.errors.business_id}
          disabled={disableComponent}
        />
      </div>
      <div className="form-field">
        <InputSelect
          className="form-select form-control"
          name="business_country"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.business_country}
          error={
            formik.touched.business_country && formik.errors.business_country
          }
        >
          <option value={""}>Select Country</option>
          {countryList?.map((country) => (
            <option key={country.iso} value={country.iso}>
              {country.country_name}
            </option>
          ))}
        </InputSelect>
      </div>
      <div className="login-btn">
        <div className="setting-btn-link">
          <Link to="/setting">
            <IconLeftArrow style={{ stroke: "#0081C5" }} />
            Settings
          </Link>
        </div>
        <Button
          type="submit"
          className="btn btn-primary"
          disabled={formik.isSubmitting}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default BusinessForm;
