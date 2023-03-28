import { apiRequest } from "helpers/apiRequests";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LeftArrow from "styles/svgs/LeftArrow";

const Notification = () => {
  const navigate = useNavigate();
  const [customerNotification, setCustomerNotification] = useState({
    sms_notification: false,
    email_notification: false,
    push_notification: false,
    whatsapp_notification: false,
  });

  useEffect(() => {
    getCustomerNotification();
  }, []);

  const getCustomerNotification = async () => {
    const { data } = await apiRequest.getCustomerNotification();
    console.log("data: ", data);
    if (data?.data) {
      setCustomerNotification(data?.data?.customerNotificationData);
    }
  };

  const handleChange = async (e) => {
    try {
      const { name, checked } = e.target;
      let config = customerNotification;
      config[name] = checked;
      const { data } = await apiRequest.updateCustomerNotification(config);
      if (data.success) getCustomerNotification();
      if (!data.success || data.data === null) throw data.message;
    } catch (error) {
      console.log("error: ", error);
      toast.error(error);
    }
  };
  return (
    <div className="settings-note-inner-sec">
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
            <div className="form-check form-switch">
              <input
                onChange={handleChange}
                value={customerNotification?.email_notification}
                checked={customerNotification?.email_notification}
                name="email_notification"
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                OFF
              </label>
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                ON
              </label>
            </div>
          </li>
          <li>
            <span className="settings">SMS</span>
            <div className="form-check form-switch">
              <input
                onChange={handleChange}
                value={customerNotification?.sms_notification}
                checked={customerNotification?.sms_notification}
                name="sms_notification"
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                OFF
              </label>
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                ON
              </label>
            </div>
          </li>
          <li>
            <span className="settings">Whatsapp</span>
            <div className="form-check form-switch">
              <input
                onChange={handleChange}
                value={customerNotification?.whatsapp_notification}
                checked={customerNotification?.whatsapp_notification}
                name="whatsapp_notification"
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                OFF
              </label>
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                ON
              </label>
            </div>
          </li>
          <li>
            <span className="settings">Mobile app</span>
            <div className="form-check form-switch">
              <input
                onChange={handleChange}
                value={customerNotification?.push_notification}
                checked={customerNotification?.push_notification}
                name="push_notification"
                className="form-check-input"
                type="checkbox"
                id="flexSwitchCheckDefault"
              />
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                OFF
              </label>
              <label
                className="form-check-label"
                htmlFor="flexSwitchCheckDefault"
              >
                ON
              </label>
            </div>
          </li>
        </ul>
        <div className="setting-btn-link">
          <button className="outline-btn" onClick={() => navigate("/setting")}>
            <LeftArrow style={{ stroke: "#0081C5" }} />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notification;
