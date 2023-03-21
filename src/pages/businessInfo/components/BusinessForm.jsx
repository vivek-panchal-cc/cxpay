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

const BusinessForm = (props) => {
  const { countryList, profile } = props;
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
        if (!data.success || data.data === null) throw data.message;
      } catch (error) {
        console.log("error: ", error);
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
        <p>Business ID</p>
        <Input
          type="text"
          className="form-control"
          id="business-id"
          name="business_id"
          placeholder="ID Number"
          value={formik.values.business_id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.business_id && formik.errors.business_id}
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
          {countryList?.map((country, index) => (
            <option key={index} value={country.country_name}>
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
        <Button type="submit" className="btn btn-primary">
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default BusinessForm;
