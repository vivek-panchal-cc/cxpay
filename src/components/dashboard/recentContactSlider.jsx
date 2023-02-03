import React from "react";
import recentContactImg01 from "assets/images/recent-contact-img01.png";
import recentContactImg02 from "assets/images/recent-contact-img02.png";

export default function recentContactSlider() {
  const options = [
    { name: "Contact Name 01", img: recentContactImg01 },
    { name: "Contact Name 02", img: recentContactImg02 },
    { name: "Contact Name 03", img: recentContactImg01 },
    { name: "Contact Name 04", img: recentContactImg02 },
    { name: "Contact Name 05", img: recentContactImg01 },
  ];
  return (
    <div className="recent-contact-slider">
      <div className="swiper">
        {/*   <!-- Additional required wrapper --> */}
        <div className="swiper-wrapper">
          {/* <!-- Slides --> */}
          {options.map((option) => (
            <div key={option.name} className="swiper-slide">
              <img src={option.img} alt="contact 2 image" />
              <div className="contact-name">{option.name}</div>
            </div>
          ))}
        </div>
        {/* <!-- If we need pagination --> */}
        <div className="swiper-pagination"></div>

        {/*  <!-- If we need navigation buttons --> */}
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>

        {/* <!-- If we need scrollbar --> */}
        <div className="swiper-scrollbar"></div>
      </div>
    </div>
  );
}
