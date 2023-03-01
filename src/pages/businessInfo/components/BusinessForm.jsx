import React from 'react';
import Button from 'components/ui/Button';
import Input from 'components/ui/Input';
import InputSelect from 'components/ui/InputSelect';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { IconLeftArrow } from 'styles/svgs';
import { businessInfoSchema } from 'schemas/validationSchema';
import { apiRequest } from 'helpers/apiRequests';
import { toast } from 'react-toastify';

const BusinessForm = (props) => {
    const {countryList} = props;
    const formik = useFormik({
        initialValues: {
            business_url: "",
            business_id: "",
        },
        validationSchema: businessInfoSchema,
        onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
            try{
                const {data} = await apiRequest.updateBusinessData(values)
                if(data.success){
                    toast.success("Business data update successfully.")
                }
                if (!data.success || data.data === null) throw data.message;
            } catch(error) {
                console.log('error: ', error);
            }            
        }
    })
    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="form-field business-url-field">
                <p>Update Business URL</p>
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
                <p>Update Business ID</p>
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
                  name="country_index"
                  onChange={({ currentTarget }) => {
                    const i = parseInt(currentTarget.value);
                    console.log('i: ', i);
                    // formik.setFieldValue("country_index", i);
                    // formik.setFieldValue("country_iso", countryList[i].iso);
                    // formik.setFieldValue(
                    //   "mobile_code",
                    //   countryList[i].phonecode
                    // );
                    // formik.setFieldValue(
                    //   "country",
                    //   countryList[i].country_name
                    // );
                    // formik.setFieldValue("city", "");
                  }}
                //   onBlur={formik.handleBlur}
                //   value={formik.values.country_index}
                //   error={formik.touched.country && formik.errors.country}
                >
                  <option value={""}>Select Country</option>
                  {countryList?.map((country, index) => (
                    <option key={index} value={index}>
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
                <Button type="submit" className="btn btn-primary">Save Changes</Button>
            </div>
        </form>
    );
}

export default BusinessForm;
