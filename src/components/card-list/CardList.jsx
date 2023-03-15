import React, { useState } from 'react';
import { useEffect } from 'react';
import { A11y, EffectCards, Navigation, Scrollbar } from 'swiper';
import { SwiperSlide, Swiper } from 'swiper/react';
import Card from './Card';


const CardList = (props) => {
    const { getCurrentSlide, walletSlider=true } = props;
    // walletSlider ? 'wallet-slider' (for wallet dashboard page) : 'card-slider'

    const [activeSlide, setActiveSlide] = useState(1)
    
    const customClass = walletSlider ? 'wallet-ac-inner' : 'slider-card-common slider-card-db card-bg-color'
    const slidesView = walletSlider ? 1 : 2.2;
    const breakPoints = walletSlider ? {} : {
        1199: {
            slidesPerView: 2.2
        },
        992: {
            slidesPerView:1.5
        },
        650:{
                slidesPerView: 3.5
            },
        575: {
            slidesPerView:2.5
        },
        0: {
            slidesPerView: 1.5
        }
    }

    const cardLists = [
        {
            cardHolderName: "MCB Bank",
            cardNumber: ".... .... .... XXXX",
            cardDate: "20 DEC 2025",
            cardBg: "#936EE3"
        },
        {
            cardHolderName: "MCB Bank",
            cardNumber: ".... .... .... XXXX",
            cardDate: "20 DEC 2025",
            cardBg: "#0081C5"
        },
        {
            cardHolderName: "MCB Bank",
            cardNumber: ".... .... .... XXXX",
            cardDate: "20 DEC 2025",
            cardBg: "#93E06F"
        },
        {
            cardHolderName: "MCB Bank",
            cardNumber: ".... .... .... XXXX",
            cardDate: "20 DEC 2025",
            cardBg: "#24BEEF"
        },
    ]
    return (
        <div className={`${walletSlider ? 'wallet-slider' : 'card-slider'}`}>
            <Swiper
              modules={[Navigation, Scrollbar, EffectCards]}
              effect={walletSlider ? "cards" : ""}
              navigation
              spaceBetween={walletSlider ? 0 : 8}
              slidesPerView={slidesView}
              pagination={{ clickable: true }}
              scrollbar={{ draggable: false }}
              loop={false}
              centeredSlides={false}
              breakpoints={breakPoints}
              onSlideChange={(e) => {
                setActiveSlide(e.activeIndex + 1)
                getCurrentSlide(e.activeIndex + 1)
            }}
              onSwiper={(swiper) => console.log(swiper)}
              >
                <div className="swiper-wrapper">
                    {cardLists?.map((elm, i) => (
                        <SwiperSlide key={"swiper" + i}>
                            <Card customClass={customClass} cardBg={elm.cardBg} cardHolderName={elm.cardHolderName} cardDate={elm.cardDate} cardNumber={elm.cardNumber} />
                        </SwiperSlide>
                    ))}
                </div>
            </Swiper>
        </div>
    );
}

export default CardList;
