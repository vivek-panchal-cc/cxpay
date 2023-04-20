import React, { useState } from "react";
import { usePopperTooltip } from "react-popper-tooltip";

function Tooltip({ tooltipText, isVisible }) {
  //   const [isVisible, setIsVisible] = useState(true);
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement: "bottom-end",
    closeOnOutsideClick: false,
    visible: isVisible,
    // onVisibleChange: setIsVisible,
  });

  return (
    <>
      <div className="w-100" ref={setTriggerRef}></div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: "tooltip-container tooltip-invalid z-1",
          })}
        >
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          {tooltipText}
        </div>
      )}
    </>
  );
}

export default Tooltip;
