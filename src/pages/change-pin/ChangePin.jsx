import React, { useContext, useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { pinChangeSchema } from "../../schemas/settingSchema";
import { apiRequest } from "../../helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { Link, useNavigate } from "react-router-dom";
import InputPin from "components/ui/InputPin";
import ModalAlert from "components/modals/ModalAlert";
import { IconLeftArrow } from "styles/svgs";

function ChangePin() {
  const { setIsLoading } = useContext(LoaderContext);
  const pinInputRef = useRef(null);
  const [modalDetails, setModalDetails] = useState({
    show: false,
    message: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      old_pin: "",
      new_pin: "",
      confirm_pin: "",
    },
    validationSchema: pinChangeSchema,
    onSubmit: async (values, { setStatus, resetForm, setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.pinChange(values);
        if (!data.success) throw data.message;
        resetForm();
        setModalDetails({
          show: true,
          message: data.message || "Your PIN Changed Successfully!",
        });
        // toast.success(data.message);
        // navigate("/setting", { replace: true });
      } catch (error) {
        toast.error(error);
        resetForm();
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleModalCallback = () => {
    setModalDetails({ show: false, message: "" });
    navigate("/setting", { replace: true });
  };

  return (
    <>
      <div className="settings-password-right-sec settings-vc-sec">
        <div className="settings-note-inner-sec">
          <div className="profile-info">
            <h3>Change PIN</h3>
            <ul className="breadcrumb">
              <li>
                <Link to="/setting">Setting</Link>
              </li>
              <li>Change PIN</li>
            </ul>
          </div>
          <div className="settings-profile-bottom-info-sec change-pin settings-password-bottom-info-sec">
            <div className="tab-content" id="nav-tabContent">
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="change-tab"
              >
                <div className="modal-body">
                  <form
                    className="login-otp-numbers"
                    onSubmit={formik.handleSubmit}
                  >
                    <label className="mb-2 text-center">Old PIN</label>
                    <div className="form-field">
                      <InputPin
                        pinSize={5}
                        name="old_pin"
                        className={"form-control"}
                        value={formik.values.old_pin}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isSubmitting={formik.isSubmitting}
                        handleSubmit={
                          !formik.isSubmitting && formik.handleSubmit
                        }
                        error={formik.touched.old_pin && formik.errors.old_pin}
                        ref={pinInputRef}
                      />
                    </div>

                    <label className="mb-2 text-center">New PIN</label>
                    <div className="form-field">
                      <InputPin
                        pinSize={5}
                        name="new_pin"
                        className={"form-control"}
                        value={formik.values.new_pin || ""}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isSubmitting={formik.isSubmitting}
                        handleSubmit={
                          !formik.isSubmitting && formik.handleSubmit
                        }
                        error={formik.touched.new_pin && formik.errors.new_pin}
                      />
                    </div>

                    <label className="mb-2 text-center">Confirm PIN</label>
                    <div className="form-field">
                      <InputPin
                        pinSize={5}
                        name="confirm_pin"
                        className={"form-control"}
                        value={formik.values.confirm_pin || ""}
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
                    <div className="login-btn">
                      {formik.status && (
                        <p className="text-danger">{formik.status}</p>
                      )}
                      <div className="setting-btn-link">
                        <Link to="/setting" replace={true}>
                          <IconLeftArrow style={{ stroke: "#0081C5" }} />
                          Settings
                        </Link>
                      </div>
                      <input
                        type="submit"
                        className={`btn btn-primary ${
                          formik.isSubmitting ? "cursor-wait" : "cursor-pointer"
                        }`}
                        value="Change"
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
      <ModalAlert
        id="pin_set_initiated"
        className="fund-sucess-modal"
        show={modalDetails?.show}
        heading={modalDetails?.message}
        headingImg={"/assets/images/pin-success.svg"}
        btnText={"Close"}
        handleBtnClick={handleModalCallback}
      />
    </>
  );
}

export default ChangePin;
