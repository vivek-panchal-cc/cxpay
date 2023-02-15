import React from "react";

export default function recentContactSlider() {
  const options = [
    { name: "Contact Name 01", img: "/assets/images/recent-contact-img01.png" },
    { name: "Contact Name 02", img: "/assets/images/recent-contact-img02.png" },
    { name: "Contact Name 03", img: "/assets/images/recent-contact-img01.png" },
    { name: "Contact Name 04", img: "/assets/images/recent-contact-img02.png" },
    { name: "Contact Name 05", img: "/assets/images/recent-contact-img01.png" },
  ];
  return (
    <div className="recent-contact-slider">
      <div className="swiper">
        {/*   <!-- Additional required wrapper --> */}
        <div className="swiper-wrapper">
          {/* <!-- Slides --> */}
          {options.map((option) => (
            <div key={option.name} className="swiper-slide">
              <img src={option.img} alt="contact 2 img" />
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
