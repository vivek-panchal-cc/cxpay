import React, { useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/css/responsive.css";
import logo from "../../assets/images/logo-1.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios"
import { loginUrl } from 'constants/urls.js';
import { axiosInstance } from 'plugin/axios.js';

const dashboardMainCard = () => {


  return (
    <div className="dashboard-card-sec">
      <div className="title-content-wrap">
        <h3>Hi, Digicel</h3>
        <p>
          8 Cards <a href="#">+ Add Card</a>
        </p>
      </div>
      <div className="card-slider">
        <div className="swiper">
          {/* <!-- Additional required wrapper --> */}
          <div className="swiper-wrapper">
            {/* <!-- Slides --> */}
            <div className="swiper-slide">
              <img src="images/card-5.png" alt="card 5 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-6.png" alt="card 6 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-5.png" alt="card 7 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-6.png" alt="card 8 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-5.png" alt="card 1 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-6.png" alt="card 2 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-5.png" alt="card 3 image" />
            </div>
            <div className="swiper-slide">
              <img src="images/card-6.png" alt="card 4 image" />
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
