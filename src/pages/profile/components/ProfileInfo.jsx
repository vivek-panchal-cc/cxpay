import React, { useState } from "react";
import { IconEdit } from "styles/svgs";
const ProfileInfo = (props) => {
  const { profile } = props;
  const { user_type = "personal" } = profile || {};

  const [isEditable, setIsEditable] = useState(false);

  const handleEditUlr = () => {
    setIsEditable(!isEditable);
  };

  return (
    <ul>
      {user_type !== "personal" && (
        <li>
          <div className="pi-title-div">Business URL</div>
          <div className="profile-info-right-desc">
            {!isEditable && (
              <>
                <p>{profile?.business_url ?? "-"}</p>
                <button onClick={handleEditUlr} className="edit-button border-0">
                  <IconEdit />
                </button>
              </>
            )}
          </div>
        </li>
      )}
      <li>
        <div className="pi-title-div">Email</div>
        <div className="profile-info-right-desc">
          <p>{profile?.email}</p>
        </div>
      </li>
      <li>
        <div className="pi-title-div">Phone no.</div>
        <div className="profile-info-right-desc">
          <p>{"+" + profile.country_code + profile?.mobile_number}</p>
        </div>
      </li>
      <li>
        <div className="pi-title-div">Country</div>
        <div className="profile-info-right-desc">
          <p>{profile?.country}</p>
        </div>
      </li>
    </ul>
  );
};

export default ProfileInfo;
