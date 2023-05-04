import React from "react";
import { EffectCards, Navigation, Scrollbar } from "swiper";
import { SwiperSlide, Swiper } from "swiper/react";
import Card from "./Card";

const CardList = (props) => {
  const { getCurrentSlideCard, walletSlider = true, cardsList } = props;
  // walletSlider ? 'wallet-slider' (for wallet dashboard page) : 'card-slider'

  const customClass = walletSlider
    ? "wallet-ac-inner"
    : "slider-card-common slider-card-db card-bg-color";
  const slidesView = walletSlider ? 1 : 2.2;
  const breakPoints = walletSlider
    ? {}
    : {
        1199: {
          slidesPerView: 2.2,
        },
        992: {
          slidesPerView: 1.5,
        },
        650: {
          slidesPerView: 3.5,
        },
        575: {
          slidesPerView: 2.5,
        },
        0: {
          slidesPerView: 1.5,
        },
      };

  return (
    <div className={`${walletSlider ? "wallet-slider" : "card-slider"}`}>
      <Swiper
        modules={[Navigation, Scrollbar, EffectCards]}
        effect={walletSlider ? "cards" : ""}
        navigation
        cardsEffect={{ rotate: 0 }}
        spaceBetween={walletSlider ? 0 : 8}
        slidesPerView={slidesView}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: false }}
        loop={false}
        centeredSlides={false}
        breakpoints={breakPoints}
        onSlideChange={(e) => {
          getCurrentSlideCard(cardsList[e.activeIndex], e.activeIndex + 1);
        }}
      >
        <div className="swiper-wrapper">
          {cardsList?.map((elm, i) => (
            <SwiperSlide key={`swiper${elm.card_number}`}>
              <Card
                customClass={customClass}
                cardBgImg={elm.image}
                cardBgColor={elm.color}
                cardHolderName={`${elm.card_holder_first_name} ${elm.card_holder_last_name}`}
                cardDate={elm.expiry_date}
                cardNumber={".... .... .... " + elm.card_number}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default CardList;
