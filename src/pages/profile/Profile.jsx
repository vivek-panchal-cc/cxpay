import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AvatarInfo from "./components/AvatarInfo";
import ProfileInfo from "./components/ProfileInfo";
import QrCode from "./components/QrCode";
import Modal from "components/modals/Modal";
import "./profile.css";
import ModalPasswordConfirmation from "components/modals/ModalPasswordConfirmation";
import { LoaderContext } from "context/loaderContext";
import {
  fetchDeactivateAccount,
  fetchDeactivateAccountForAgent,
  fetchUserProfile,
} from "features/user/userProfileSlice";
import OtpTypePopup from "components/popups/OtpTypePopup";
import ModalOtpConfirmation from "components/modals/ModalOtpConfirmation";
import { sendPaymentOtpSchema } from "schemas/sendPaymentSchema";
import NewMobileChange from "pages/new-mobile-change/NewMobileChange";
import NewMobileModal from "components/modals/NewMobileModal";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";

const Profile = () => {
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoaderContext);
  const { profile } = useSelector((state) => state.userProfile);
  const {
    user_type = "",
    first_name = "",
    last_name = "",
    company_name = "",
    mobile_number,
    is_delete_request,
    admin_approved,
  } = profile || {};
  const profileName =
    user_type === "personal" || user_type === "agent"
      ? first_name + " " + last_name
      : company_name;

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [showOtpTypePopup, setShowOtpTypePopup] = useState(false);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [showNewMobilePopup, setShowNewMobilePopup] = useState(false);
  const [details, setDetails] = useState("");

  const handleInitiateDeleteAccount = () => {
    setShowConfirmPopup(true);
  };

  const handleDeleteAccount = async (password) => {
    setIsLoading(true);
    try {
      let responseMessage = "";
      let isApiCallSuccessful = false;

      if (user_type !== "agent") {
        const response = await dispatch(
          fetchDeactivateAccount({
            mobile_number: `${mobile_number}`,
            password: password,
          })
        );
        // Check if the API call was successful
        if (fetchDeactivateAccount.fulfilled.match(response)) {
          isApiCallSuccessful = true;
        } else if (fetchDeactivateAccount.rejected.match(response)) {
          responseMessage = response.payload;
        }
      } else {
        const response = await dispatch(
          fetchDeactivateAccountForAgent({ password: password })
        );
        // Check if the API call was successful
        if (fetchDeactivateAccountForAgent.fulfilled.match(response)) {
          isApiCallSuccessful = true;
        } else if (fetchDeactivateAccountForAgent.rejected.match(response)) {
          responseMessage = response.payload;
        }
      }
      // Only show the responseMessage when it is not an empty string
      if (responseMessage?.trim() !== "") {
        setShowConfirmPopup({ show: true, message: responseMessage });
      }
      // Close the ModalConfirmation only when the API call is successful
      if (isApiCallSuccessful) {
        setShowConfirmPopup(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      await dispatch(fetchUserProfile());
      // setShowConfirmPopup(false);
    }
  };

  const getSubHeading = () => {
    if (user_type === "agent" || user_type === "business") {
      return "Your request for account deletion has been submitted to the admin department. It will be done in the next 2-3 working days.";
    } else {
      return "Are you sure you want to delete your account? This will permanently erase all your details.";
    }
  };
 
  const getOtpHeading = () => {
    if (details.verification_via === "sms") {
      return "We have sent you a verification code to your old mobile number. Enter the OTP below.";
    } else {
      return "We have sent you a verification code to your email address. Enter the OTP below.";
    }
  };

  const handleModalOtpConfirmation = (values) => {    
    if (!values) return;
    setShowOtpPopup(true);
    setDetails(values);
  };

  const handleOtpTypePopup = () => {
    setShowOtpTypePopup(true);
  };

  const handleSubmitOtp = async (otp) => {
    if (!otp) return;
    setIsLoading(true);    
    try {
      const formData = new FormData();
      formData.append("user_mobile_otp", otp);
      formData.append("verify_number_flag", details.verify_number_flag);
      formData.append("customer_id", details.customer_id);
      formData.append("country_code", details.country_code);
      formData.append("mobile_number", details.mobile_number);
      const { data } = await apiRequest.verifyChangeMobileOtp(formData);
      if (!data.success) throw data.message;
      toast.success(`${data.message}`);
      setShowOtpPopup(false);
      setShowNewMobilePopup(true);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.createChangeMobileOtp(details);
      if (!data.success) throw data.message;
      if (data?.data) toast.success(data.data.otp);
      toast.success(data.message);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-inner-sec p-4">
      <ModalPasswordConfirmation
        id="delete-group-member-popup"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        heading="Delete Account"
        // subHeading="Are you sure you want to delete your account? This will permanently erase all your details."
        subHeading={getSubHeading()}
        handleCallback={handleDeleteAccount}
        error={showConfirmPopup.message}
      ></ModalPasswordConfirmation>

      <div className="profile-left-content col-lg-7 col-12">
        <AvatarInfo
          profileImg={profile?.profile_image}
          profileName={profileName}
          profileType={profile?.user_type}
          profileEmail={profile?.email}
        />
        <div className="profile-bottom-info-sec">
          <ProfileInfo profile={profile} />
        </div>
        <div className="profile-del-acc-btn mt-4 mt-lg-5">
          <button
            type="button"
            className="btn"
            onClick={handleInitiateDeleteAccount}
            disabled={is_delete_request}
          >
            Delete Account
          </button>
          &nbsp;
          {mobile_number && (
            <button type="button" className="btn" onClick={handleOtpTypePopup} disabled={!admin_approved}>
              Change Mobile
            </button>
          )}
        </div>
      </div>
      {user_type !== "agent" && (
        <div className="profile-right-content col-lg-5 col-12">
          <QrCode qrCodeImg={profile?.qr_code_image} />
        </div>
      )}
      <Modal
        id="fund_acc_modal"
        show={showOtpTypePopup}
        setShow={setShowOtpTypePopup}
        className="fund-acc-modal"
        classNameChild="modal-dialog w-100"
      >
        <OtpTypePopup
          details={profile}
          setModalShow={setShowOtpTypePopup}
          handleCallBack={handleModalOtpConfirmation}
        />
      </Modal>

      <ModalOtpConfirmation
        id="group_pay_otp_modal"
        className="otp-verification-modal group_pay_otp_modal"
        show={showOtpPopup}
        allowClickOutSide={true}
        setShow={setShowOtpPopup}
        heading="OTP Verification"
        headingImg="/assets/images/sent-payment-otp-pop.svg"
        subHeading={getOtpHeading()}
        validationSchema={sendPaymentOtpSchema}
        handleSubmitOtp={handleSubmitOtp}
        handleResendOtp={handleResendOtp}
      />

      <Modal
        id="fund_acc_modal"
        show={showNewMobilePopup}
        className="fund-acc-modal"
        // classNameChild="modal-dialog w-100"
      >
        <NewMobileChange setShow={setShowNewMobilePopup} details={details} />
      </Modal>
    </div>
  );
};

export default Profile;
