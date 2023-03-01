import React from 'react';
import { useSelector } from 'react-redux';
import { IconContact, IconLogout, IconSetting } from 'styles/svgs';
import ProfileDropItem from './ProfileDropItem';

const ProfileDropdown = () => {
    const { profile } = useSelector((state) => state.userProfile);

    const profileDropItems = [
        {
            title: "Profile",
            path: "/",
            icon: <IconContact style={{ stroke: "#363853" }} />
        },
        {
            title: "Settings",
            path: "/",
            icon: <IconSetting style={{ stroke: "#363853" }} />
        },
        {
            title: "Logout",
            path: "/",
            icon: <IconLogout style={{ stroke: "#363853" }} />
        },
    ]
    return (
        <div className="user-profile">
            <div className="user-image">
              <div className="user-image-wrap">
                <span className="user-image">
                  <img src={profile.profile_image} alt="user img" />
                </span>
              </div>
              <ul>
                {
                    profileDropItems.map(elm => (
                        <ProfileDropItem path={elm.path}>
                            {elm.icon}
                            {elm.title}
                        </ProfileDropItem>
                    ))
                }
              </ul>
            </div>
          </div>
    );
}

export default ProfileDropdown;
