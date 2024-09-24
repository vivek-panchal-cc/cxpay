import Image from "components/ui/Image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { IconContact, IconLogout, IconSetting } from "styles/svgs";
import ProfileDropItem from "./ProfileDropItem";
import { LoaderContext } from "context/loaderContext";
import { apiRequest } from "helpers/apiRequests";
import { useNavigate } from "react-router-dom";
import ModalPaymentPin from "components/modals/ModalPaymentPin";
import { sendPaymentPinSchema } from "schemas/sendPaymentSchema";
import { toast } from "react-toastify";
import { usePinContext } from "context/pinContext";
import useForgotPinHandler from "hooks/useForgotPinHandler";

const ProfileDropdown = () => {
  const dropdownref = useRef(null);
  const navigate = useNavigate();
  const { setIsPinValidated } = usePinContext();
  const { profile } = useSelector((state) => state.userProfile);
  const [showDrop, setShowDrop] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const [showPinPopup, setShowPinPopup] = useState(false);
  const { handleForgotPin, OtpModal, PinModal } = useForgotPinHandler(setShowPinPopup);

  useEffect(() => {
    function handleclickOutside(event) {
      if (dropdownref.current && !dropdownref.current.contains(event.target)) {
        setShowDrop(false);
      }
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [dropdownref]);

  // Function to handle PIN validation
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
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsClick = (e) => {
    e.preventDefault();
    setShowPinPopup(true);
  };

  const profileDropItems = [
    {
      title: "Profile",
      path: "/profile",
      icon: <IconContact style={{ stroke: "#363853" }} />,
    },
    {
      title: "Settings",
      path: "/setting",
      icon: <IconSetting style={{ stroke: "#363853" }} />,
    },
    {
      title: "Logout",
      path: "/logout",
      icon: <IconLogout style={{ stroke: "#363853" }} />,
    },
  ];
  return (
    <div className="user-profile">
      <div className="user-image">
        <div className="user-image-wrap" onClick={() => setShowDrop(true)}>
          <span className="h-100 w-100">
            <Image
              src={profile?.profile_image || ""}
              alt="profile avtars"
              fallbacksrc={
                profile?.user_type === "business"
                  ? "/assets/images/Business-account.png"
                  : profile?.user_type === "personal"
                  ? "/assets/images/Personal.png"
                  : profile?.user_type === "agent"
                  ? "/assets/images/Agent-account.png"
                  : "/assets/images/single_contact_profile.png"
              }
              className="h-100 w-100 object-fit-cover"
              style={{ objectPosition: "center" }}
            />
          </span>
        </div>
        <ul ref={dropdownref} style={{ display: showDrop ? "block" : "none" }}>
          {profileDropItems.map((elm) => (
            <ProfileDropItem
              key={elm.path}
              path={elm.path === "/setting" ? null : elm.path}
              onClick={(e) => {
                setShowDrop(false);
                if (elm.path === "/setting") {
                  handleSettingsClick(e);
                } else {
                  navigate(elm.path);
                }
              }}
            >
              {elm.icon}
              {elm.title}
            </ProfileDropItem>
          ))}
        </ul>
      </div>
      {showPinPopup && (
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
          handleSubmitPin={handleSubmitPin}
          handleForgotPin={handleForgotPin}
        />
      )}
      {OtpModal()}
      {PinModal()}
    </div>
  );
};

export default ProfileDropdown;
