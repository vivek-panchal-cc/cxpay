import Image from 'components/ui/Image';
import React from 'react';

const Card = (props) => {
    const {cardBg, cardHolderName, cardDate, cardNumber, customClass} = props;
    return (
        <div className={`${customClass}`} style={{backgroundColor: cardBg}}>
            <Image src={"assets/images/card_top_left.png"} className={'w-card-top-img'} alt=""/>
            <Image src={"assets/images/card_bottom_right.png"} className={'w-card-bottom-img'} alt=""/>
            <p className="card-holder-nm">{cardHolderName}</p>
            <div className="card-num-date">
                <p className="">{cardNumber}</p>
                <p className="">{cardDate}</p>
            </div>
        </div>
    );
}

export default Card;
