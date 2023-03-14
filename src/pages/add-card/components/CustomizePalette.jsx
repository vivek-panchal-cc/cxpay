import React, { useContext, useEffect, useState } from "react";
import { IconImage } from "styles/svgs";
import { apiRequest } from "helpers/apiRequests";
import { LoaderContext } from "context/loaderContext";

function CustomizePalette(props) {
  const { setIsLoading } = useContext(LoaderContext);

  const { color, handleChange, bgimg, removeBgImg } = props;
  const [colorsPallette, setColorPalette] = useState([]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await apiRequest.getCardColor();
        if (!data.success) throw data.message;
        setColorPalette(data.data);
        handleChange(data?.data?.[1]);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleSelect = (e) => {
    const scolor = e.currentTarget.dataset.value;
    if (scolor === "white" && bgimg) {
      removeBgImg();
      return;
    }
    handleChange(scolor);
  };

  return (
    <div className="add-card-color-wrap">
      <p>Customize</p>
      <ul className="radio-group-wrap">
        {colorsPallette?.map((colorPal, index) => (
          <li
            key={index}
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
