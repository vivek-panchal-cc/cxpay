import { useState, useRef, useEffect } from "react";
import LoaderContent from "loaders/LoaderContent";

const TooltipInfo = ({
  children,
  content,
  setIconColor,
  isLoading = false,
}) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleTooltip = () => {
    setShow((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideTooltip =
        tooltipRef.current && !tooltipRef.current.contains(event.target);
      const clickedOutsideTrigger =
        triggerRef.current && !triggerRef.current.contains(event.target);

      if (show && clickedOutsideTooltip && clickedOutsideTrigger) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  useEffect(() => {
    setIconColor(show);
  }, [show, setIconColor]);

  return (
    <div className={`tooltip-wrapper ${show ? "show-arrow" : ""}`}>
      <div ref={triggerRef} onClick={toggleTooltip}>
        {children}
      </div>
      {show && (
        <>
          <div className="tooltip-box" ref={tooltipRef}>
            <div className="tooltip-content">
              {isLoading
                ? [1, 2, 3, 4, 5].map((item, index) => (
                    <p key={index} className="tooltip-content-loader">
                      <LoaderContent height="20" width="100%" />
                    </p>
                  ))
                : content}
            </div>
          </div>
          <div className="tooltip-info-arrow"></div>
        </>
      )}
    </div>
  );
};

export default TooltipInfo;
