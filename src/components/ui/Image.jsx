import React, { useState } from "react";

const Image = (props) => {
  const { src, className, style, alt, fallbacksrc } = props;
  const [isError, setIsError] = useState(false);
  return (
    <img
      src={src || ""}
      className={className}
      style={style}
      alt={alt}
      onError={
        !isError
          ? (event) => {
              event.currentTarget.src = fallbacksrc;
              setIsError(true);
            }
          : null
      }
    />
  );
};

export default Image;
