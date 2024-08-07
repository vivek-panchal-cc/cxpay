import React from "react";
import { IconImage } from "styles/svgs";

function CustomizePalette(props) {
  const { color, handleChange, bgimg, removeBgImg, colorsPallette } = props;

  const handleSelect = (e) => {
    const scolor = e.currentTarget.dataset.value;
    if (scolor === "" && bgimg) {
      handleChange(colorsPallette[0]);
      return removeBgImg();
    }
    handleChange(scolor);
  };

  return (
    <div className="add-card-color-wrap">
      <p>Customize</p>
      <ul className="radio-group-wrap">
        {colorsPallette?.map((colorPal) => (
          <li
            key={colorPal}
            className={`radio-group-inner ${
              color === colorPal ? "selected" : ""
            }`}
            data-value={colorPal}
            onClick={handleSelect}
          >
            <div className="radio-round" style={{ background: colorPal }}></div>
          </li>
        ))}
        <li
          className={`radio-group-inner ${bgimg ? "selected" : ""}`}
          data-value=""
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
