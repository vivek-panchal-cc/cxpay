import React, { useEffect, useState } from "react";

const ImageQR = (props) => {
  const { src, className, style, alt, fallbacksrc, onLoad = () => {}, onError = () => {} } = props;
  const [isError, setIsError] = useState(false);

  const handleError = (event) => {
    if (!isError) {
      event.currentTarget.src = fallbacksrc;
      setIsError(true);
      onError();
    }
  };

  return (
    <img
      src={src || fallbacksrc}
      className={className}
      style={style}
      alt={alt}
      onLoad={onLoad}
      onError={handleError}
    />
  );
};

export default ImageQR;
