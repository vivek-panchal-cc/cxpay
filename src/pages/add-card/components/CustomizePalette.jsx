import React from "react";
import { IconRightArrow } from "styles/svgs";

function CustomizePalette(props) {
  const { color, handleChange, bgimg, removeBgImg } = props;

  const handleSelect = (e) => {
    const scolor = e.currentTarget.dataset.value;
    if (scolor === "white" && bgimg) {
      removeBgImg("");
      handleChange("blue");
      return;
    }
    handleChange(scolor);
  };

  return (
    <div className="add-card-color-wrap">
      <p>Customize</p>
      <ul className="radio-group-wrap">
        <li
          className={`radio-group-inner ${
            color === "purple" ? "selected" : ""
          }`}
          data-value="purple"
          onClick={handleSelect}
        >
          <div className="radio-round purple"></div>
        </li>
        <li
          className={`radio-group-inner ${color === "blue" ? "selected" : ""}`}
          data-value="blue"
          onClick={handleSelect}
        >
          <div className="radio-round blue"></div>
        </li>
        <li
          className={`radio-group-inner ${color === "green" ? "selected" : ""}`}
          data-value="green"
          onClick={handleSelect}
        >
          <div className="radio-round green"></div>
        </li>
        <li
          className={`radio-group-inner ${
            color === "light_blue" ? "selected" : ""
          }`}
          data-value="light_blue"
          onClick={handleSelect}
        >
          <div className="radio-round light_blue"></div>
        </li>
        <li
          className={`radio-group-inner ${
            color === "yellow" ? "selected" : ""
          }`}
          data-value="yellow"
          onClick={handleSelect}
        >
          <div className="radio-round yellow"></div>
        </li>
        <li
          className={`radio-group-inner ${color === "white" ? "selected" : ""}`}
          data-value="white"
          onClick={handleSelect}
        >
          <div className="radio-round white overflow-hidden">
            {bgimg ? (
              <>
                <img
                  src={bgimg}
                  className="position-absolute h-100 w-100 object-fit-cover"
                  style={{ objectPosition: "center" }}
                  alt=""
                  srcset=""
                />
                <span
                  className="position-absolute h-100 w-100 d-flex justify-content-center align-items-center"
                  style={{ background: "#00000070" }}
                >
                  <span className="text-white">&#10005;</span>
                </span>
              </>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M20 4C19.5 3 19 2.5 18 2C18 2 13.8431 1 11 1C8.15694 1 4 2 4 2C3 2.5 2.5 3 2 4C2 4 1 8.23858 1 11C1 13.7614 2 18 2 18C2.5 19 2.5 19.5 4 20C4 20 8.15694 21 11 21C13.8431 21 18 20 18 20C19 19.5 19.5 19 20 18C20 18 21 13.7614 21 11C21 8.23858 20 4 20 4Z"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7.5 9C8.32843 9 9 8.32843 9 7.5C9 6.67157 8.32843 6 7.5 6C6.67157 6 6 6.67157 6 7.5C6 8.32843 6.67157 9 7.5 9Z"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 14L15 9L4 20"
                  stroke="#BDBDBD"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default CustomizePalette;
