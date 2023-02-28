import Image from 'components/ui/Image';
import React from 'react';

const AvatarInfo = (props) => {
    const {profileImg, profileName, profileEmail} = props;
    
    return (
        <div className="profile-top-sec">
            <div className="profile-avtar">
                <Image src={profileImg} alt="profile avtar" fallbacksrc={"/assets/images/user-avatar.png"}/>
            </div>
            <div className="profile-info">
                <h3>{profileName}</h3>
                <p><a href={`mailto:${profileEmail}`}>{profileEmail}</a></p>
            </div>
        </div>
    );
}

export default AvatarInfo;
