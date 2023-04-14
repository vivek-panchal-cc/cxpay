import React from "react";
import { A11y, Navigation, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

const fullwidthPoints = {
  1381: {
    slidesPerView: 9.5,
    spaceBetween: 24,
  },
  1380: {
    slidesPerView: 8.6,
    spaceBetween: 24,
  },
  1199: {
    slidesPerView: 7.5,
    spaceBetween: 24,
  },
  768: {
    slidesPerView: 5.5,
    spaceBetween: 20,
  },
  576: {
    slidesPerView: 4.5,
    spaceBetween: 15,
  },
  0: {
    slidesPerView: 2.5,
    spaceBetween: 15,
  },
};

const otherWidthPoints = {
  1199: {
    slidesPerView: 9.5,
    spaceBetween: 10,
  },
  992: {
    slidesPerView: 6.5,
    spaceBetween: 10,
  },
  650: {
    slidesPerView: 5.5,
    spaceBetween: 10,
  },
  575: {
    slidesPerView: 4.5,
    spaceBetween: 10,
  },
  0: {
    slidesPerView: 3.5,
    spaceBetween: 10,
  },
};

const SwipeContactList = (props) => {
  const {
    list,
    selectedList = [],
    className,
    fullWidth = false,
    isMultiSelect = false,
    containerClassName,
    handleReachEnd,
    handleSelectedItems,
    ListItemComponent = () => <>Item</>,
    ListItemComponentProps = {},
    ListItemComponentAlias = {},
  } = props;

  const breakpoints = fullWidth ? fullwidthPoints : otherWidthPoints;

  return (
    <div
      className={`${
        fullWidth ? "send-whom-slider" : "recent-contact-slider"
      } ${containerClassName}`}
    >
      <Swiper
        navigation
        modules={[Navigation, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={fullWidth ? 6.6 : 5.5}
        breakpoints={breakpoints}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: false }}
        onReachEnd={handleReachEnd}
      >
        <div className={`swiper-wrapper ${className}`}>
          {list?.map((item, index) => (
            <SwiperSlide key={`${item?.id}_${index}`}>
              <ListItemComponent
                item={item}
                selectedList={selectedList}
                alias={ListItemComponentAlias}
                handleSelect={handleSelectedItems}
                {...ListItemComponentProps}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default SwipeContactList;
