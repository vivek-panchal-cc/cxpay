import React, { useState } from "react";
import { A11y, Navigation, Scrollbar } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import ContactCard from "./ContactCard";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const ContactList = (props) => {
  const {
    fullWidth = false,
    isSelectable = false,
    selectedItems,
    className,
    data,
    containerClassName,
    onReachEnd,
    isMultiSelect = true,
  } = props;
  const [selectedContact, setSelectedContact] = useState([]);

  const groupDefaultBackgroundImages = [
    "yellow-bg",
    "blue-bg",
    "green-bg",
    "light-blue-bg",
    "purple-bg",
    "dark-yellow-bg",
    "dark-blue-bg",
  ];

  const getActiveColor = (index) => {
    return index % groupDefaultBackgroundImages.length;
  };

  //   const contactsList = [
  //     {
  //       id: 1,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 2,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 3,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 4,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 5,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 6,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 7,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //     {
  //       id: 8,
  //       imgUrl: "assets/images/recent-contact-img01.png",
  //       name: "Contact Name 01",
  //     },
  //   ];

  // const resizeListener = () => {
  //     setWidth(window.innerWidth)
  // }

  const breakpoints = fullWidth
    ? {
        1300: {
          slidesPerView: 6.5,
          spaceBetween: 28,
        },
        1199: {
          slidesPerView: 5.5,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4.5,
          spaceBetween: 20,
        },
        576: {
          slidesPerView: 3.5,
          spaceBetween: 15,
        },
        0: {
          slidesPerView: 2.3,
          spaceBetween: 15,
        },
      }
    : {
        1199: {
          slidesPerView: 5.5,
          spaceBetween: 10,
        },
        992: {
          slidesPerView: 4.5,
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

  const handleSelectChange = (e) => {
    const checked = e.target.checked;
    var value = e.target.value;
    let selectedArray = [];
    if (isMultiSelect) {
      if (checked) {
        selectedArray = [...selectedContact, value];
      } else {
        selectedArray = selectedContact.filter((elm) => elm !== value);
      }
    } else {
      value = parseInt(e.target.value);
      if (checked) {
        selectedArray = [value];
      }else{
        selectedArray = [];
      }
    }
    setSelectedContact(selectedArray);
    selectedItems(selectedArray);
  };

  return (
    <div
      className={`${
        fullWidth ? "send-whom-slider" : "recent-contact-slider"
      } ${containerClassName}`}
    >
      <Swiper
        // install Swiper modules
        modules={[Navigation, Scrollbar, A11y]}
        spaceBetween={10}
        slidesPerView={fullWidth ? 6.6 : 5.5}
        breakpoints={breakpoints}
        navigation
        pagination={{ clickable: true }}
        scrollbar={{ draggable: false }}
        onReachEnd={onReachEnd}
      >
        <div className={`swiper-wrapper ${className}`}>
          {data?.map((elm, index) => (
            <SwiperSlide
              key={"slider" + (elm.group_id ? elm.group_id : elm.mobile)}
            >
              <ContactCard
                isSelectable={isSelectable}
                selectedContact={selectedContact}
                handleSelectChange={handleSelectChange}
                fullWidth={fullWidth}
                backgroundColor={
                  elm.group_image !== undefined
                    ? elm.group_image !== ""
                      ? ""
                      : groupDefaultBackgroundImages[getActiveColor(index)]
                    : ""
                }
                imgUrl={
                  elm.group_image !== undefined
                    ? elm.group_image !== ""
                      ? elm.group_image
                      : "assets/images/group-payment-black-icon.png"
                    : elm.profile_image !== ""
                    ? elm.profile_image
                    : ""
                }
                name={elm.group_name ?? elm.name}
                id={elm.group_id ? elm.group_id : elm.mobile}
                isMultiSelect={isMultiSelect}
              />
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default ContactList;
