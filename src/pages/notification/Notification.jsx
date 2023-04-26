import React, { useEffect, useState } from "react";
import InputSwitch from "components/ui/InputSwitch";
import { LoaderContext } from "context/loaderContext";
import { useFormik } from "formik";
import { apiRequest } from "helpers/apiRequests";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftArrow from "styles/svgs/LeftArrow";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile } from "features/user/userProfileSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { is_email_verify = true } = useSelector(
    (state) => state.userProfile.profile
  );
  const { setIsLoading } = useContext(LoaderContext);
  const [changeName, setChangeName] = useState("");

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email_notification: false,
      whatsapp_notification: false,
      push_notification: false,
    },
    onSubmit: async (values, { setStatus, setErrors }) => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.updateCustomerNotification({
          [changeName]: values[changeName].toString(),
        });
        if (!data.success) throw data.message;
        toast.success(data.message);
      } catch (error) {
        if (typeof error === "string") toast.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // Onchange of Notification Checkbox
  const handleChange = async (e) => {
    if (!e.target.name) return;
    setChangeName(e.target.name);
    await formik.handleChange(e);
    await formik.submitForm();
  };

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
                    Goto Profile
                  </Link>
                </div>
              </div>
            )}
          </li>
          <li>
            <span className="settings">Whatsapp</span>
            <InputSwitch
              name="whatsapp_notification"
              className="form-check-input"
              labelOffText="OFF"
              labelOnText="ON"
              onChange={handleChange}
              checked={formik.values.whatsapp_notification}
            />
          </li>
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
  );
};

export default Notification;
