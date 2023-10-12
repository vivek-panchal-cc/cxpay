import Image from "components/ui/Image";
import React from "react";

const AvatarInfo = (props) => {
  const { profileImg, profileName, profileEmail, profileType, profileNumber } =
    props;

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
        <p>
          <a href={`mailto:${profileEmail}`}>{profileEmail}</a>{" "}
          {profileNumber && <span>+{profileNumber}</span>}
        </p>
      </div>
    </div>
  );
};

export default AvatarInfo;
