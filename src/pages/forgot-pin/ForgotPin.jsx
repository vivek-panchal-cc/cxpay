import React, { useEffect, useState, useRef } from "react";
import InputPin from "components/ui/InputPin";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { setNewPinSchema } from "schemas/sendPaymentSchema";

function ForgotPin() {  
  const pinInputRef = useRef(null);  

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
        resetForm();
        toast.success(data.message);
        navigate("/logout", { replace: true });
      } catch (error) {
        resetForm();
        console.log(error);
      }
    },
  });

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <h3 className="text-center">5 - Digit PIN Access</h3>
                  <p className="text-center">
                    Secure your account with 5 - Digit PIN Access
                  </p>
                  <div className="modal-header">
                    <div className="">
                      <img src={"/assets/images/setupPin.svg"} alt="new_pin img" />
                    </div>
                  </div>
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
                          error={formik.touched.new_pin && formik.errors.new_pin}
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
    </div>
  );
}

export default ForgotPin;
