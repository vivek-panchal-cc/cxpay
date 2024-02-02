import KycChecked from "components/notification-bar/kyc-checked/KycChecked";
import Image from "components/ui/Image";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { IconMobile, IconPersonalId } from "styles/svgs";

const AvatarInfo = (props) => {
  const {
    profileImg,
    profileName,
    profileEmail,
    profileType,
    profileNumber,
    nationalId,
  } = props;
  const location = useLocation();
  const thisRoute = useMemo(() => location.pathname.split("/")[1], [location]);
  const allowedKYCRoutes = ["profile"];
  const isProfile = allowedKYCRoutes.includes(thisRoute);

  return (
    <div className="profile-top-sec">
      <div className="profile-avtar">
        <Image
          src={profileImg}
          alt="profile avtar"
          fallbacksrc={
            profileType === "business"
              ? "/assets/images/Business-account.png"
              : profileType === "personal"
              ? "/assets/images/Personal.png"
              : profileType === "agent"
              ? "/assets/images/Agent-account.png"
              : "/assets/images/single_contact_profile.png"
          }
          className="h-100 w-100 object-fit-cover"
          style={{ objectPosition: "center" }}
        />
      </div>
      <div className="profile-info">
        <h3>{profileName}</h3>
        <p className="mb-0">
          {/* <a href={`mailto:${profileEmail}`}>{profileEmail}</a>&nbsp; */}
          {profileEmail && (
            <>
              <a href={`mailto:${profileEmail}`}>{profileEmail}</a>
              &nbsp;
            </>
          )}
          {profileNumber && (
            <span>
              <IconMobile />
              &nbsp;+{profileNumber}
            </span>
          )}
        </p>
        {nationalId && (
          <p>
            <IconPersonalId />
            &nbsp;{nationalId}
          </p>
        )}
        {/* {profileType !== "agent" && isProfile && <KycChecked />} */}
        {isProfile && <KycChecked />}
      </div>
    </div>
  );
};

export default AvatarInfo;
