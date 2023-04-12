import React, { useEffect, useState } from "react";
import { A11y, Navigation, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { renameKeys } from "constants/all";

const SwipeContactList = (props) => {
  const {
    list,
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

  // const groupDefaultBackgroundImages = [
  //   "yellow-bg",
  //   "blue-bg",
  //   "green-bg",
  //   "light-blue-bg",
  //   "purple-bg",
  //   "dark-yellow-bg",
  //   "dark-blue-bg",
  // ];

  // const getActiveColor = (index) => {
  //   return index % groupDefaultBackgroundImages.length;
  // };

  const breakpoints = fullWidth
    ? {
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
      }
    : {
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

  const [conList, setConList] = useState(list);

  useEffect(() => {
    if (!list) return;
    const alteredList = list.map((item) => {
      const itemAltered = renameKeys(ListItemComponentAlias, item);
      const selected =
        conList?.find((item) => item.id === itemAltered.id)?.isSelected ||
        false;
      return { ...itemAltered, isSelected: selected };
    });
    setConList(alteredList);
  }, [list]);

  const handleSelect = (e) => {
    const value = e?.currentTarget?.value;
    const checked = e?.currentTarget?.checked;
    if (!value) return;
    const selectedList = conList.map((item) => {
      if (item.id.toString() === value.toString())
        return { ...item, isSelected: checked ? true : false };
      return isMultiSelect ? item : { ...item, isSelected: false };
    });
    setConList(selectedList);
    const filteredList = list.filter(
      (li, index) => selectedList[index].isSelected
    );
    handleSelectedItems(filteredList);
  };

  const ListItems = conList?.map((item, index) => (
    <SwiperSlide key={`${item?.id}_${index}`}>
      <ListItemComponent
        {...{ ...ListItemComponentProps, ...item }}
        handleSelect={handleSelect}
      />
    </SwiperSlide>
  ));

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
        <div className={`swiper-wrapper ${className}`}>{ListItems}</div>
      </Swiper>
    </div>
  );
};

export default SwipeContactList;
