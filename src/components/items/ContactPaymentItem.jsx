import React, { forwardRef } from "react";
import Button from "components/ui/Button";
import { usePopperTooltip } from "react-popper-tooltip";

const ContactPaymentItem = forwardRef((props, ref) => {
  const {
    name,
    imgUrl,
    handleDelete,
    fieldName,
    fieldValue,
    fieldChange,
    fieldOnBlur,
    fieldError,
  } = props;

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: "bottom-end" });

  return (
    <li>
      <div class="payee-name-img-wrap">
        <div class="payee-img">
          <img src={imgUrl} alt="contact 1 img" />
        </div>
        <div class="payee-name">
          <h4>{name}</h4>
        </div>
      </div>
      <div class="specification-input form-field">
        <input
          type="text"
          class="form-control"
          id="specification-input"
          placeholder="Type your specification Here"
        />
      </div>
      <div class="input-select-wrap form-field">
        <input
          type="text"
          name={fieldName}
          value={fieldValue}
          onChange={fieldChange}
          onBlur={fieldOnBlur}
          class={`form-control ${fieldError ? "error-field" : ""}`}
          id="specification-input"
          placeholder="0.00"
          ref={ref}
        />
        {fieldError && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: "tooltip-container tooltip-invalid",
            })}
          >
            <div {...getArrowProps({ className: "tooltip-arrow" })} />
            Tooltip Element
          </div>
        )}
        <p class="ip_currancy" ref={setTriggerRef}>
          NAFl
        </p>
      </div>
      <div class="remove-btn">
        <Button class="close-icons" onClick={handleDelete}></Button>
      </div>
    </li>
  );
});

export default ContactPaymentItem;
