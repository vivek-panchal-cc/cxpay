import React from "react";
import { IconImage } from "styles/svgs";

function CustomizePalette(props) {
  const { color, handleChange, bgimg, removeBgImg } = props;

  const handleSelect = (e) => {
    const scolor = e.currentTarget.dataset.value;
    if (scolor === "white" && bgimg) {
      removeBgImg();
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
                />
                <span
                  className="position-absolute h-100 w-100 d-flex justify-content-center align-items-center"
                  style={{ background: "#00000070" }}
                >
                  <span className="text-white">&#10005;</span>
                </span>
              </>
            ) : (
              <IconImage stroke="#BDBDBD" />
            )}
          </div>
        </li>
      </ul>
    </div>
  );
}

export default CustomizePalette;
