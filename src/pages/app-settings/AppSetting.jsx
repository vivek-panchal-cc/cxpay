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
import LoaderAppSetting from "loaders/LoaderAppSetting";

const AppSetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { setIsLoading, isLoading } = useContext(LoaderContext);
  const [isLoading, setIsLoading] = useState(false);
  const [changeName, setChangeName] = useState("");
  const [appSettings, setAppSettings] = useState({});

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: appSettings,
    onSubmit: async (values, { setStatus, setErrors }) => {
      // setIsLoading(true);
      try {
        const { data } = await apiRequest.updateCustomerNotification({
          [changeName]: values[changeName].toString(),
        });
        if (!data.success) throw data.message;
        toast.success(data.message);
      } catch (error) {
        if (typeof error === "string") toast.error(error);
      } finally {
        // setIsLoading(false);
        await dispatch(fetchUserProfile());
      }
    },
  });

  // Onchange of AppSettings Checkbox
  const handleChange = async (e) => {
    if (!e.target.name) return;
    setChangeName(e.target.name);
    await formik.handleChange(e);
    await formik.submitForm();
  };

  // Getting app settings from the API
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        // await dispatch(fetchUserProfile());
        const { data } = await apiRequest.getCustomerNotification();
        if (!data.success) throw data.message;
        const settings = data.data?.customerNotificationData;
        if (!settings) return;
        setAppSettings(settings);
        await formik.setValues({ ...settings });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const capitalize = (str) => {
    return str
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  // Determine the number of skeleton loaders to show
  const skeletonCount = Object.keys(appSettings).length || 2;

  return (
    <div className="settings-note-inner-sec settings-vc-sec setting-noti-sec-new">
      <div className="profile-info">
        <h3>App Setting</h3>
        <ul className="breadcrumb">
          <li>
            <Link to="/setting">Setting</Link>
          </li>
          <li>App Settings</li>
        </ul>
      </div>
      <div className="settings-notifications-bottom-info-sec">
        <ul>
          {isLoading
            ? Array.from({ length: skeletonCount }).map((_, index) => (
                <li key={index} className="p-0">
                  <LoaderAppSetting />
                </li>
              ))
            : Object.keys(formik.values).sort().map((key) => (
                <li key={key}>
                  <span className="settings">{capitalize(key)}</span>
                  <InputSwitch
                    name={key}
                    className="form-check-input"
                    labelOffText="OFF"
                    labelOnText="ON"
                    onChange={handleChange}
                    checked={formik.values[key]}
                  />
                </li>
              ))}
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

export default AppSetting;
