import React, { useEffect, useState, useContext } from "react";
import InputSwitch from "components/ui/InputSwitch";
import { LoaderContext } from "context/loaderContext";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftArrow from "styles/svgs/LeftArrow";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { is_email_verify = true } = useSelector(
    (state) => state.userProfile.profile
  );
  const { setIsLoading } = useContext(LoaderContext);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const [error, setError] = useState("");
  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setShowPinPopup);
  const [changeName, setChangeName] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email_notification: false,
      // whatsapp_notification: false,
      push_notification: false,
    },
    onSubmit: async (values, { setStatus, setErrors }) => {
      // setError("");
      // setShowPinPopup(true);
    },
  });

  const handleSubmitData = async (pin) => {
    if (!pin || !pendingToggle) return;
    setIsLoading(true);
    try {
      const payload = {
        [pendingToggle.name]: pendingToggle.value.toString(),
        user_pin: pin,
      };
      const { data } = await apiRequest.updateCustomerNotification(payload);
      if (!data.success) throw data;

      // Update formik values only after successful API call
      formik.setFieldValue(pendingToggle.name, pendingToggle.value);
      toast.success(data.message);
      setShowPinPopup(false);
      setPendingToggle(null);
    } catch (error) {
      if (typeof error.message === "string") setError(error.message);
      if (error.data?.is_suspended) {
        navigate("/logout", { replace: true });
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Onchange of Notification Checkbox
  const handleChange = (e) => {
    const { name, checked } = e.target;
    setError("");
    setChangeName(name);
    setPendingToggle({ name, value: checked });
    setShowPinPopup(true); // open PIN modal
  };

  // const handleChange = async (e) => {
  //   if (!e.target.name) return;
  //   setChangeName(e.target.name);
  //   await formik.handleChange(e);
  //   await formik.submitForm();
  // };

  // Getting notification from the API
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchUserProfile());
        const { data } = await apiRequest.getCustomerNotification();
        if (!data.success) throw data.message;
        const notification = data.data?.customerNotificationData;
        if (!notification) return;
        await formik.setValues({ ...notification });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <>
      <ModalPaymentPin
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={showPinPopup}
        allowClickOutSide={true}
        setShow={(show) => {
          setShowPinPopup(show);
          if (!show) setPendingToggle(null);
        }}
        heading="Enter your 5 - Digit unique PIN"
        headingImg="/assets/images/setupPin.svg"
        subHeading=""
        validationSchema={sendPaymentPinSchema}
        error={error}
        handleSubmitPin={handleSubmitData}
        handleForgotPin={handleForgotPin}
      />
      {OtpModal()}
      {PinModal()}
      <div className="settings-note-inner-sec settings-vc-sec setting-noti-sec-new">
        <div className="profile-info">
          <h3>Notification</h3>
          <ul className="breadcrumb">
            <li>
              <Link to="/setting">Setting</Link>
            </li>
            <li>Notifications</li>
          </ul>
        </div>
        <div className="settings-notifications-bottom-info-sec">
          <ul>
            <li>
              <span className="settings">Email</span>
              {is_email_verify ? (
                <InputSwitch
                  name="email_notification"
                  className="form-check-input"
                  labelOffText="OFF"
                  labelOnText="ON"
                  onChange={handleChange}
                  checked={formik.values.email_notification}
                />
              ) : (
                <div className="badge border border-danger-subtle bg-danger-subtle text-wrap m-0 p-2">
                  <div className="text-dark">
                    Please verify your Email
                    <Link
                      to="/profile"
                      className="ms-2"
                      style={{ textDecoration: "underline" }}
                    >
                      Go to Profile
                    </Link>
                  </div>
                </div>
              )}
            </li>
            {/* <li>
            <span className="settings">Whatsapp</span>
            <InputSwitch
              name="whatsapp_notification"
              className="form-check-input"
              labelOffText="OFF"
              labelOnText="ON"
              onChange={handleChange}
              checked={formik.values.whatsapp_notification}
            />
          </li> */}
            <li>
              <span className="settings">Mobile app</span>
              <InputSwitch
                name="push_notification"
                className="form-check-input"
                labelOffText="OFF"
                labelOnText="ON"
                onChange={handleChange}
                checked={formik.values.push_notification}
              />
            </li>
          </ul>
          <div className="setting-btn-link">
            <button
              type="button"
              className="outline-btn"
              onClick={() => navigate("/setting")}
            >
              <LeftArrow style={{ stroke: "#0081C5" }} />
              Settings
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Notification;
