import React, { useState, useEffect } from "react";
import ContentLoader from "react-content-loader";

const LoaderImageWithSkeleton = ({
  src,
  alt = "Profile",
  className = "",
  width = 50,
  height = 50,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setIsLoaded(false); // fallback to broken state if needed
    img.src = src;
  }, [src]);

  return isLoaded ? (
    <img src={src} alt={alt} className={className} />
  ) : (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      className={className}
      {...props}
    >
      <circle cx={width / 2} cy={height / 2} r={Math.min(width, height) / 2} />
    </ContentLoader>
  );
};

export default LoaderImageWithSkeleton;
