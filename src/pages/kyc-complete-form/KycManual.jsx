import React, { useContext, useEffect, useState } from "react";
import Input from "components/ui/Input";
import { useFormik } from "formik";
import { kycDetailsSchema } from "schemas/validationSchema";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { SignupContext } from "context/signupContext";
import InputFile from "components/ui/InputImage";
import InputSelect from "components/ui/InputSelect";
import { IconEyeClose, IconEyeOpen } from "styles/svgs";
import { LoaderContext } from "context/loaderContext";
import { storageRequest } from "helpers/storageRequests";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { CXPAY_LOGO, FILE_SIZE } from "constants/all";
import InputDatePicker from "components/ui/InputDatePicker";
import ModalDatePicker from "components/modals/ModalDatePicker";
import UploadFile from "components/upload-files/UploadFile";
import { addObjToFormData } from "helpers/commonHelpers";
import Modal from "components/modals/Modal";
import KycManualFirstStep from "./Components/KycManualFirstStep";
import { useSelector } from "react-redux";
import ModalDatePickerKyc from "components/modals/ModalDatePickerKyc";
import { LoginContext } from "context/loginContext";

function KycManual(props) {
  const location = useLocation();
  const { kycStatus, kycUpdate = "" } = location?.state || {};
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { signUpCreds, setSignUpCreds } = useContext(SignupContext);
  const { setLoginCreds } = useContext(LoginContext);
  const [datePicker, setDatePicker] = useState(false);
  const [showKycPopup, setShowKycPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [showPassword, setShowPassword] = useState({
    new: false,
    confirm: false,
  });
  const { countryList, cityList, country_iso, selected_country_name } =
    signUpCreds || {};

  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordStrengthData, setPasswordStrengthData] = useState({
    strength: "",
    percent: 0,
  });

  const formik = useFormik({
    initialValues: {
      kyc_document_type: "",
      kyc_document_id: "",
      expiry_date: "",
      document: [],
    },
    validationSchema: kycDetailsSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setIsLoading(true);
      try {
        const muValues = { ...values };
        const formData = new FormData();
        for (const key in muValues) {
          if (key === "expiry_date") {
            formData.append(key, muValues[key]);
          } else {
            addObjToFormData(muValues[key], key, formData);
          }
        }
        for (const file of values.document) formData.append("image", file);
        formData.append("is_apply_for_renew", kycUpdate === "renew" ? "true" : "false");
        const { data } = await apiRequest.manualKyc(formData);
        if (!data.success) throw data.message;
        setLoginCreds((ls) => ({
          ...ls,
          renew_kyc_approved_status: data.data.kyc_renew_data?.renew_kyc_approved_status || "",
          renew_kyc_attempt_count:
            data.data.kyc_renew_data?.renew_kyc_attempt_count || "",
          show_renew_section:
            data.data.kyc_renew_data?.show_renew_section || "",
          show_renew_button: Boolean(data.data.kyc_renew_data?.show_renew_button),
          kyc_message: data.data.kyc_renew_data?.kyc_message || "",
        }));
        setMessage(data.message);
        setShowKycPopup(true);
        // navigate("/complete-kyc-initial", { replace: true });
      } catch (error) {
        if (typeof error === "string") toast.error(error);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
  });

  const formatDate = (dateObj) => {
    if (dateObj instanceof Date) {
      const day = String(dateObj.getDate()).padStart(2, "0");
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const year = dateObj.getFullYear();
      return `${year}-${month}-${day}`;
    }
    return null;
  };

  const handleChangeDateFilter = (date) => {
    if (datePicker) {
      const formattedDate = formatDate(date);
      formik.setFieldValue("expiry_date", formattedDate);
      setStartDate(formattedDate);
    }
    setDatePicker("");
  };

  // For making input scroll into view on validation error
  useEffect(() => {
    const { errors } = formik;
    if (!errors || Object.keys(errors).length <= 0) return;
    const inputName = Object.keys(errors)[0];
    const inputField = document.querySelector(`input[name='${inputName}']`);
    if (!inputField) return;
    inputField.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [formik.isSubmitting]);

  if (!kycStatus) return <Navigate to="/" replace />;

  return (
    <>
      <div className="login-signup common-body-bg">
        <div className="container login-signup-01 login-signup-02">
          <div className="row">
            <div className="col-xs-12">
              <div className="login-signup-content-wrap login-signup01-content-wrap">
                <form
                  onSubmit={formik.handleSubmit}
                  style={{ maxWidth: "400px" }}
                >
                  <div className="login-logo-image text-center">
                    <img src={CXPAY_LOGO} alt="kyc logo img" />
                  </div>
                  <h4 className="blue-text text-center">
                    Provide Your KYC Details
                  </h4>
                  <InputSelect
                    className="form-select form-control"
                    name="kyc_document_type"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.kyc_document_type}
                    error={
                      formik.touched.kyc_document_type &&
                      formik.errors.kyc_document_type
                    }
                  >
                    <option value={""}>Document Type</option>
                    <option value={"passport"}>Passport</option>
                    <option value={"national_id"}>National Id</option>
                  </InputSelect>
                  <Input
                    type="text"
                    className="form-control"
                    placeholder="Document Number"
                    name="kyc_document_id"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.kyc_document_id}
                    error={
                      formik.touched.kyc_document_id &&
                      formik.errors.kyc_document_id
                    }
                    autoComplete={"new-id"}
                  />
                  <InputDatePicker
                    className="d-flex flex-column form-field kyc-date-filter"
                    date={formik.values.expiry_date}
                    onClick={() => setDatePicker(true)}
                    placeholder="Expiry Date"
                  />
                  {formik.touched.expiry_date && formik.errors.expiry_date ? (
                    <p
                      style={{ marginLeft: "10px" }}
                      className="kyc-text-danger"
                    >
                      {formik.errors.expiry_date}
                    </p>
                  ) : null}
                  <UploadFile
                    label="Upload Document"
                    max={1}
                    maxSize={FILE_SIZE}
                    name="document"
                    showPreview={true}
                    files={formik.values.document}
                    onChange={async (files) =>
                      await formik.setFieldValue("document", files)
                    }
                    error={formik.touched.document && formik.errors.document}
                  />
                  <div className="text-center login-btn personal-sign-up">
                    <input
                      type="submit"
                      className={`btn btn-primary ${
                        formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                      } ${formik.isValid ? "" : "opacity-75"}`}
                      disabled={formik.isSubmitting}
                      value="Submit"
                    />
                    {kycUpdate && (
                      <div className="pop-cancel-btn text-center">
                        <button type="button" onClick={() => navigate(-1)}>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <ModalDatePickerKyc
                minDate={datePicker ? new Date() : ""}
                show={datePicker}
                setShow={() => setDatePicker(false)}
                classNameChild={"schedule-time-modal"}
                heading="Expiry Date"
                handleChangeDate={handleChangeDateFilter}
              />
            </div>
          </div>
        </div>
      </div>

      <Modal id="kyc_step_2_modal" show={showKycPopup} classNameChild="">
        <KycManualFirstStep setShow={setShowKycPopup} message={message} kycUpdate={kycUpdate}/>
      </Modal>
    </>
  );
}

export default KycManual;
