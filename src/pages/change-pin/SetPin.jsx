import React, { useEffect, useState, useRef } from "react";
import InputPin from "components/ui/InputPin";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { setNewPinSchema } from "schemas/sendPaymentSchema";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ModalAlert from "components/modals/ModalAlert";

function SetPin() {
  const pinInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { setPin } = location?.state || {};
  const [modalDetails, setModalDetails] = useState({
    show: false,
    message: "",
  });

  useEffect(() => {
    if (pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      new_pin: "",
      confirm_pin: "",
    },
    validationSchema: setNewPinSchema,
    onSubmit: async (values, { resetForm, setValues, setErrors }) => {
      try {
        const { data } = await apiRequest.pinSet(values);
        if (!data.success) throw data.message;
        sessionStorage.removeItem("pendingPin");
        resetForm();
        setModalDetails({
          show: true,
          message: data.message || "Your PIN Set Successfully!",
        });
        // toast.success(data.message);
        // navigate("/logout", { replace: true });
      } catch (error) {
        resetForm();
        console.log(error);
      }
    },
  });

  const handleModalCallback = () => {
    setModalDetails({ show: false, message: "" });
    navigate("/", { replace: true });
  };

  if (!setPin) return <Navigate to="/" replace />;

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap p-0">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <div className="">
                      <img
                        src={"/assets/images/setupPin.svg"}
                        alt="new_pin img"
                      />
                    </div>
                  </div>
                  <h3 className="text-center">5 - Digit PIN Access</h3>
                  <p className="text-center">
                    Secure your account with 5 - Digit PIN Access
                  </p>
                  <div className="modal-body">
                    <form
                      className="login-otp-numbers"
                      onSubmit={formik.handleSubmit}
                    >
                      <label className="mb-3 w-100 text-center">
                        Please enter your unique PIN
                      </label>
                      <div className="form-field">
                        <InputPin
                          pinSize={5}
                          name="new_pin"
                          className={"form-control"}
                          value={formik.values.new_pin}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isSubmitting={formik.isSubmitting}
                          handleSubmit={
                            !formik.isSubmitting && formik.handleSubmit
                          }
                          error={
                            formik.touched.new_pin && formik.errors.new_pin
                          }
                          ref={pinInputRef}
                        />
                      </div>

                      <label className="mb-3 w-100 text-center">
                        Please confirm your unique PIN
                      </label>
                      <div className="form-field">
                        <InputPin
                          pinSize={5}
                          name="confirm_pin"
                          className={"form-control"}
                          value={formik.values.confirm_pin}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isSubmitting={formik.isSubmitting}
                          handleSubmit={
                            !formik.isSubmitting && formik.handleSubmit
                          }
                          error={
                            formik.touched.confirm_pin &&
                            formik.errors.confirm_pin
                          }
                        />
                      </div>
                      <div className="popup-btn-wrap">
                        {formik.status && (
                          <p className="text-danger">{formik.status}</p>
                        )}
                        <input
                          type="submit"
                          className={`btn btn-primary ${
                            formik.isSubmitting
                              ? "cursor-wait"
                              : "cursor-pointer"
                          }`}
                          value="Set PIN"
                          disabled={formik.isSubmitting}
                        />
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalAlert
        id="pin_set_initiated"
        className="fund-sucess-modal"
        show={modalDetails?.show}
        heading={modalDetails?.message}
        headingImg={"/assets/images/pin-success.svg"}
        btnText={"Close"}
        handleBtnClick={handleModalCallback}
      />
    </div>
  );
}

export default SetPin;
