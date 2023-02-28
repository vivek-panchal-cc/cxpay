import React from 'react';
import { useSelector } from 'react-redux';
import AvatarInfo from './components/AvatarInfo';
import ProfileInfo from './components/ProfileInfo';
import QrCode from './components/QrCode';

const Profile = () => {
    const { profile } = useSelector((state) => state.userProfile);
    const profileName = profile?.user_type === "personal" ? profile?.first_name +" "+ profile?.last_name : profile?.company_name
    return (

        <div className="profile-inner-sec p-4">
            <div className="profile-left-content col-lg-7 col-12">
                <AvatarInfo profileImg={profile?.profile_image} profileName={profileName} profileEmail={profile?.email}/>
                <div className="profile-bottom-info-sec">
                    <ProfileInfo profile={profile}/>
                </div>			  
            </div>
            <QrCode qrCodeImg={profile?.qr_code_image} />
        </div>
    );
}

export default Profile;
