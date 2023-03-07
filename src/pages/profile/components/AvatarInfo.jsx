import Image from "components/ui/Image";
import React from "react";

const AvatarInfo = (props) => {
  const { profileImg, profileName, profileEmail, profileType } = props;

  return (
    <div className="profile-top-sec">
      <div className="profile-avtar">
        <Image
          src={profileImg}
          alt="profile avtar"
          fallbacksrc={
            profileType === "business"
              ? "/assets/images/Business-account.png"
              : "/assets/images/Personal.png"
          }
          className="h-100 w-100 object-fit-cover"
          style={{ objectPosition: "center" }}
        />
      </div>
      <div className="profile-info">
        <h3>{profileName}</h3>
        <p>
          <a href={`mailto:${profileEmail}`}>{profileEmail}</a>
        </p>
      </div>
    </div>
  );
};

export default AvatarInfo;
