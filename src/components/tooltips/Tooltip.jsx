import React from "react";
import { usePopperTooltip } from "react-popper-tooltip";

function Tooltip({
  className = "",
  classNameTooltip = "",
  tooltipText = "",
  placement = "",
  isVisible,
}) {
  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({
    placement: placement || "bottom-end",
    closeOnOutsideClick: false,
    visible: isVisible,
    // onVisibleChange: setIsVisible,
  });

  return (
    <>
      <div className={`w-100 ${className}`} ref={setTriggerRef}></div>
      {visible ? (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: `tooltip-container tooltip-invalid z-1 ${classNameTooltip}`,
          })}
        >
          <div {...getArrowProps({ className: "tooltip-arrow" })} />
          {tooltipText}
        </div>
      ) : null}
    </>
  );
}

export default Tooltip;
