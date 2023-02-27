import Image from 'components/ui/Image';
import React from 'react';

const ContactCard = (props) => {
    const {isSelectable, selectedContact, handleSelectChange, fullWidth, id, imgUrl, name} = props;
    return (
        <div>
            <div className='cb-div'>
                {isSelectable && <input value={id} checked={selectedContact.includes(id)} type={'checkbox'} onChange={handleSelectChange} />}
                <div className={`${fullWidth ? 'img-wrap' : 'recent-con-img-wrap'}`}>
                        <Image src={imgUrl} alt="contact 1 image" />
                </div>
            </div>
            <div className="contact-name">{name}</div>
        </div>
    );
}

export default ContactCard;
