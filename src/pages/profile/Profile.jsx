import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AvatarInfo from "./components/AvatarInfo";
import ProfileInfo from "./components/ProfileInfo";
import QrCode from "./components/QrCode";
import "./profile.css";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { LoaderContext } from "context/loaderContext";
import {
  fetchDeactivateAccount,
  fetchDeactivateAccountForAgent,
  fetchUserProfile,
} from "features/user/userProfileSlice";

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
  } = profile || {};
  const profileName =
    user_type === "personal" || user_type === "agent"
      ? first_name + " " + last_name
      : company_name;

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);

  const handleInitiateDeleteAccount = () => {
    setShowConfirmPopup(true);
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      if (user_type !== "agent") {
        await dispatch(
          fetchDeactivateAccount({
            mobile_number: `${mobile_number}`,
          })
        );
      } else {
        await dispatch(fetchDeactivateAccountForAgent());
        await dispatch(fetchUserProfile());
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
      setShowConfirmPopup(false);
    }
  };

  const getSubHeading = () => {
    if (user_type === "agent") {
      return "Your request for account deletion has been submitted to the admin department. It will be done in the next 2-3 working days.";
    } else {
      return "Are you sure you want to delete your account? This will permanently erase all your details.";
    }
  };

  return (
    <div className="profile-inner-sec p-4">
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        heading="Delete Account"
        // subHeading="Are you sure you want to delete your account? This will permanently erase all your details."
        subHeading={getSubHeading()}
        handleCallback={handleDeleteAccount}
      ></ModalConfirmation>

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
        </div>
      </div>
      {user_type !== "agent" && (
        <div className="profile-right-content col-lg-5 col-12">
          <QrCode qrCodeImg={profile?.qr_code_image} />
        </div>
      )}
    </div>
  );
};

export default Profile;
