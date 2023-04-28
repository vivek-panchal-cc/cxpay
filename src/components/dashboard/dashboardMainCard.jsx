import React from "react";

const dashboardMainCard = () => {
  return (
    <div className="dashboard-card-sec">
      <div className="title-content-wrap">
        <h3>Hi, Digicel</h3>
        <p>
          8 Cards <a href="/">+ Add Card</a>
        </p>
      </div>
      <div className="card-slider">
        <div className="swiper">
          {/* <!-- Additional required wrapper --> */}
          <div className="swiper-wrapper">
            {/* <!-- Slides --> */}
            <div className="swiper-slide">
              <img src="/assets/images/card-5.png" alt="card 5 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-6.png" alt="card 6 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-5.png" alt="card 7 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-6.png" alt="card 8 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-5.png" alt="card 1 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-6.png" alt="card 2 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-5.png" alt="card 3 img" />
            </div>
            <div className="swiper-slide">
              <img src="/assets/images/card-6.png" alt="card 4 img" />
            </div>
          </div>
          {/*  <!-- If we need pagination --> */}
          <div className="swiper-pagination"></div>

          {/*  <!-- If we need navigation buttons --> */}
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>

          {/*  <!-- If we need scrollbar --> */}
          <div className="swiper-scrollbar"></div>
        </div>
      </div>
    </div>
  );
};

export default dashboardMainCard;
