import ModalPaymentPin from "components/modals/ModalPaymentPin";
import { LoaderContext } from "context/loaderContext";
import { usePinContext } from "context/pinContext";
import { apiRequest } from "helpers/apiRequests";
import useForgotPinHandler from "hooks/useForgotPinHandler";
import React, { useContext, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";
import {
  IconInfo,
  IconLock,
  IconNotification,
  IconProfile,
  IconRightArrow,
  IconSetting,
} from "styles/svgs";
import ChangePin from "styles/svgs/ChangePin";

const settingsRedirects = [
  {
    icon: <IconNotification />,
    title: "Notifications",
    link: (
      <Link
        to={"/setting/notification"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconLock />,
    title: "Password",
    link: (
      <Link
        to={"/setting/change-password"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <ChangePin />,
    title: "Change PIN",
    link: (
      <Link
        to={"/setting/change-pin"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconProfile />,
    title: "Profile",
    link: (
      <Link
        to={"/setting/edit-profile"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  {
    icon: <IconInfo />,
    title: "Business info",
    link: (
      <Link
        to={"/setting/business-info"}
        className="setting-details-links stretched-link"
      >
        <IconRightArrow />
      </Link>
    ),
  },
  // {
  //   icon: <IconSetting style={{ fill: "#ffff" }}/>,
  //   title: "App Settings",
  //   link: (
  //     <Link
  //       to={"/setting/app-settings"}
  //       className="setting-details-links stretched-link"
  //     >
  //       <IconRightArrow />
  //     </Link>
  //   ),
  // },
];

function Setting() {
  const { profile } = useSelector((state) => state.userProfile);
  const { user_type = "personal" } = profile || {};
  const { isPinValidated, setIsPinValidated } = usePinContext();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { setIsLoading } = useContext(LoaderContext);
  const [showPinPopup, setShowPinPopup] = React.useState(false);
  const { handleForgotPin, OtpModal, PinModal } =
    useForgotPinHandler(setShowPinPopup);

  React.useEffect(() => {
    if (user_type === "agent") {
      setIsPinValidated(true);
      setShowPinPopup(false);
      return;
    }
    if (!isPinValidated && (user_type === "personal" || user_type === "business")) {
      setShowPinPopup(true);
    }
  }, [isPinValidated, user_type, setIsPinValidated]);

  const handleSubmitPin = async (pin) => {
    if (!pin) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.pinValidate({ user_pin: pin });
      if (!data.success) throw data.message;
      toast.success(data.message);
      setShowPinPopup(false);
      setIsPinValidated(true);
      navigate("/setting");
    } catch (error) {
      setError(error);
      // toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-right-sec settings-vc-sec">
      {isPinValidated && (
        <div className="settings-inner-sec">
          <div className="profile-info">
            <h3>Settings</h3>
          </div>
          <div className="settings-bottom-info-sec">
            <ul>
              {settingsRedirects?.map((item, index) => (
                <React.Fragment key={index}>
                  {(item?.title === "Business info" &&
                    user_type === "personal") ||
                  (item?.title === "Business info" && user_type === "agent") ||
                  (item?.title === "Notifications" && user_type === "agent") ||
                  (item?.title === "Change PIN" && user_type === "agent") ? (
                    ""
                  ) : (
                    <li key={item.title?.trim() || index}>
                      <div className="icon-wrap">
                        <span className="icon-settings">{item.icon}</span>
                        {item.title}
                      </div>
                      {item.link}
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      )}
      {showPinPopup && user_type !== "agent" && (
        <ModalPaymentPin
          id="group_pay_otp_modal"
          className="otp-verification-modal group_pay_otp_modal"
          show={showPinPopup}
          allowClickOutSide={true}
          setShow={setShowPinPopup}
          heading="5 - Digit PIN Access"
          headingImg="/assets/images/setupPin.svg"
          subHeading="Secure your account with 5 - Digit PIN Access"
          validationSchema={sendPaymentPinSchema}
          error={error}
          handleSubmitPin={handleSubmitPin}
          handleForgotPin={handleForgotPin}
        />
      )}
      {OtpModal()}
      {PinModal()}
    </div>
  );
}

export default Setting;
