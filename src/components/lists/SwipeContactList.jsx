import React, { useEffect, useState } from "react";
import LoaderRecentContact from "loaders/LoaderRecentContact";
import LoaderSendContact from "loaders/LoaderSendContact";
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
    slidesPerView: 5,
    spaceBetween: 10,
  },
  992: {
    slidesPerView: 4,
    spaceBetween: 10,
  },
  650: {
    slidesPerView: 6,
    spaceBetween: 10,
  },
  575: {
    slidesPerView: 4,
    spaceBetween: 10,
  },
  0: {
    slidesPerView: 4,
    spaceBetween: 10,
  },
};

const SwipeContactList = (props) => {
  const {
    isLoading = false,
    list,
    selectedList = [],
    className,
    fullWidth = false,
    containerClassName,
    handleReachEnd,
    handleSelectedItems,
    ListItemComponent = () => <>Item</>,
    ListItemComponentProps = {},
    ListItemComponentAlias = {},
  } = props;

  const breakpoints = fullWidth ? fullwidthPoints : otherWidthPoints;
  const [swiperRef, setSwiperRef] = useState(null);
  const [swiperList, setSwiperList] = useState(list || []);

  useEffect(() => {
    if (list && swiperList) {
      setSwiperList([...list]);
      swiperRef?.update();
    }
  }, [list]);

  return (
    <div
      className={`position-relative ${
        fullWidth ? "send-whom-slider" : "recent-contact-slider"
      } ${containerClassName}`}
      style={isLoading && fullWidth ? { minHeight: "220px" } : {}}
    >
      {isLoading ? (
        <div
          className={`position-absolute bg-white z-2 h-100 w-100 ${
            fullWidth ? "ps-4" : ""
          }`}
          style={{ inset: "0" }}
        >
          <div className={`d-inline-flex column-gap-2 pt-2`}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) =>
              fullWidth ? (
                <LoaderSendContact key={item} />
              ) : (
                <LoaderRecentContact key={item} />
              )
            )}
          </div>
        </div>
      ) : null}
      <Swiper
        navigation
        modules={[Navigation, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={"auto"}
        breakpoints={breakpoints}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: false }}
        onReachEnd={handleReachEnd}
        loop={false}
        onSwiper={(swiper) => setSwiperRef(swiper)}
      >
        <div className={`swiper-wrapper ${className}`}>
          {swiperList?.map((item, index) => {
            const ukey = item.group_id || item.account_number || index;
            return (
              <SwiperSlide key={ukey}>
                <ListItemComponent
                  item={item}
                  selectedList={selectedList}
                  alias={ListItemComponentAlias}
                  handleSelect={handleSelectedItems}
                  {...ListItemComponentProps}
                />
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>
    </div>
  );
};

export default SwipeContactList;
