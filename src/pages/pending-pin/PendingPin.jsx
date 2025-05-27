import React, { useEffect, useState, useRef } from "react";
import InputPin from "components/ui/InputPin";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { setNewPinSchema } from "schemas/sendPaymentSchema";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

function PendingPin() {
  const pinInputRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  // const isPending = searchParams.get("is_pending");
  const isLegitimateAccess = sessionStorage.getItem("pendingPin") === "true";

  useEffect(() => {
    if (!isLegitimateAccess) {
      navigate("/", { replace: true });
    } else if (pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [isLegitimateAccess, navigate]);

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

  const handleSetPin = () => {
    navigate("/set-pin", { replace: true, state: { setPin: true } });
  };

  if (!isLegitimateAccess) return <Navigate to="/" replace />;

  return (
    <div className="login-signup login-signup-main common-body-bg">
      <div className="container login-signup-01 login-signup-02">
        <div className="row">
          <div className="col-xs-12">
            <div className="login-signup-content-wrap login-signup01-content-wrap">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <h3 className="text-center">Set Your Security PIN</h3>
                  <p className="text-center">
                    To enhance your account security, please set a 5-digit PIN.
                    This PIN will be required for confirming transactions and
                    other actions in your account.
                  </p>
                  <div className="modal-header">
                    <div className="">
                      <img
                        src={"/assets/images/setupPin.svg"}
                        alt="new_pin img"
                      />
                    </div>
                  </div>
                  <div className="popup-btn-wrap">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSetPin}
                    >
                      Done
                    </button>
                  </div>
                  <p className="text-danger text-center mt-3">
                    Important: Ensure your PIN is easy to remember, but secure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingPin;
