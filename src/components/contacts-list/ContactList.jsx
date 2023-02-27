import React, { useEffect, useState } from 'react';
import { A11y, Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import ContactCard from './ContactCard';

const ContactList = (props) => {
    const {fullWidth = false, isSelectable = false, selectedItems, className} = props;
    const [selectedContact, setSelectedContact] = useState([]);
    
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

    const breakpoints = fullWidth ? {
        1300: {
            slidesPerView: 6.5,
            spaceBetween: 28
        },
		1199: {
            slidesPerView: 5.5,
            spaceBetween: 20
        },
        768: {
                slidesPerView: 4.5,
                spaceBetween: 20
            },
        576: {
                slidesPerView: 3.5,
                spaceBetween: 15
        },
        0: {
                slidesPerView: 2.3,
                spaceBetween: 15
        }
    } : {
        1199: {
            slidesPerView: 5.5,
            spaceBetween: 10,
        },
		992:{
            slidesPerView: 4.5,
            spaceBetween: 10
        },
        650:{
                slidesPerView: 5.5,
                spaceBetween: 10
            },
        575: {
            slidesPerView:4.5,
            spaceBetween: 10
        },
        0: {
            slidesPerView: 3.5,
            spaceBetween: 10
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
                spaceBetween={10}
                slidesPerView={fullWidth ? 6.6 : 5.5}
                breakpoints={breakpoints}
                navigation
                pagination={{ clickable: true }}
                scrollbar={{ draggable: false }}
            >
                <div className={`swiper-wrapper ${className}`}>
                    {contactsList?.map((elm) => (
                        <SwiperSlide key={'slider' + elm?.id}>
                            <ContactCard isSelectable={isSelectable} selectedContact={selectedContact} handleSelectChange={handleSelectChange} fullWidth={fullWidth} imgUrl={elm.imgUrl} name={elm.name} id={elm.id}/>
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </div>
    );
}

export default ContactList;
