import React, { useEffect, useState } from 'react';
import { A11y, Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

const ContactList = (props) => {
    const {fullWidth = false, isSelectable = false, selectedItems, className} = props;
    const [selectedContact, setSelectedContact] = useState([]);
    const [width, setWidth] = useState(window.innerWidth);
    useEffect(() => {
       window.addEventListener("resize", resizeListener)
    }, []);
    
    // static contact list in future will replace with api data
    const contactsList = [
        {
            id: 1,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 2,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 3,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 4,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 5,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 6,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 7,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        },
        {
            id: 8,
            imgUrl: "assets/images/recent-contact-img01.png",
            name: "Contact Name 01"
        }

    ];
    
    const resizeListener = () => {
        setWidth(window.innerWidth)
    } 

    const getSlidePerView = () => {
        switch (true) {
            case width <= 500: 
                return 2
            case width >= 500 && width < 700: 
                return 3
            case width >= 700 && width < 900:
                return 4
            case width >= 900 && width < 1300:
                return 5
            case width >= 1300:
                return 6
            default:
                return 2
           }
    }
    const handleSelectChange = (e) => {
        const checked = e.target.checked;
        const value = parseInt(e.target.value)
        let selectedArray = []
        if(checked){
            selectedArray = [...selectedContact, value]
        }else{
            selectedArray = selectedContact.filter((elm) => elm !== value);
        }
        setSelectedContact(selectedArray);
        selectedItems(selectedArray)
    }
    
    return (
        <div className={`${fullWidth? "send-whom-slider" : "recent-contact-slider"}`}>
            <Swiper
                // install Swiper modules
                modules={[Navigation, Scrollbar, A11y]}
                spaceBetween={15}
                slidesPerView={getSlidePerView()}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: false }}
            >
                <div className={`swiper-wrapper ${className}`}>
                    {contactsList?.map((elm) => (
                        <SwiperSlide key={'slider' + elm?.id}>
                            <div className='cb-div'>
                                {isSelectable && <input value={elm.id} checked={selectedContact.includes(elm.id)} type={'checkbox'} onChange={handleSelectChange} />}
                                <div className={`${fullWidth ? 'img-wrap' : 'recent-con-img-wrap'}`}>
                                        <img src={elm.imgUrl} alt="contact 1 image" />
                                </div>
                            </div>
                            <div className="contact-name">{elm.name}</div>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </div>
    );
}

export default ContactList;
