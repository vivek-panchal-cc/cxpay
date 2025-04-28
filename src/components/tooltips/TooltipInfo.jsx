import { useState, useRef, useEffect } from "react";

const TooltipInfo = ({ children, content, setIconColor }) => {
  const [show, setShow] = useState(false);
  const tooltipRef = useRef(null);
  const triggerRef = useRef(null);

  const toggleTooltip = () => {
    setShow((prev) => !prev);
  };

  const handleClickOutside = (event) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target) &&
      triggerRef.current &&
      !triggerRef.current.contains(event.target)
    ) {
      setShow(false);
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  useEffect(() => {
    setIconColor(show);
  }, [show, setIconColor]);

  return (
    <div
      className={`tooltip-wrapper ${show ? "show-arrow" : ""}`}
      ref={triggerRef}
      onClick={toggleTooltip}
    >
      {children}
      {show && (
        <>
          <div className="tooltip-box" ref={tooltipRef}>
            <div className="tooltip-content">{content}</div>
          </div>
          <div className="tooltip-info-arrow"></div>
        </>
      )}
    </div>
  );
};

export default TooltipInfo;
