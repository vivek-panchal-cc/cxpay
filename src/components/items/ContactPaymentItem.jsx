import React, { forwardRef } from "react";
import Button from "components/ui/Button";
import { usePopperTooltip } from "react-popper-tooltip";
import Input from "components/ui/Input";

const ContactPaymentItem = forwardRef((props, ref) => {
  const {
    item,
    handleDelete,
    fieldNameAmount,
    fieldValueAmount,
    fieldNameSpecifications,
    fieldValueSpecifications,
    fieldOnChange,
    fieldOnBlur,
    fieldErrorAmount,
  } = props;
  const { name, profile_image: imgUrl } = item;

  const {
    getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible,
  } = usePopperTooltip({ placement: "bottom-end" });

  return (
    <li>
      <div className="payee-name-img-wrap">
        <div className="payee-img">
          <img src={imgUrl} alt="contact 1 img" />
        </div>
        <div className="payee-name">
          <h4>{name}</h4>
        </div>
      </div>
      <div className="specification-input form-field">
        <Input
          type="text"
          name={fieldNameSpecifications}
          value={fieldValueSpecifications}
          onChange={fieldOnChange}
          onBlur={fieldOnBlur}
          className="form-control"
          placeholder="Type your specification Here"
        />
      </div>
      <div className="input-select-wrap form-field">
        <Input
          type="text"
          inputmode="decimal"
          name={fieldNameAmount}
          value={fieldValueAmount}
          onChange={fieldOnChange}
          onBlur={fieldOnBlur}
          className={`form-control ${fieldErrorAmount ? "error-field" : ""}`}
          placeholder="0.00"
          ref={ref}
        />
        {fieldErrorAmount && (
          <div
            ref={setTooltipRef}
            {...getTooltipProps({
              className: "tooltip-container tooltip-invalid z-1",
            })}
          >
            <div {...getArrowProps({ className: "tooltip-arrow" })} />
            {fieldErrorAmount}
          </div>
        )}
        <p className="ip_currancy" ref={setTriggerRef}>
          NAFl
        </p>
      </div>
      <div className="remove-btn">
        <Button
          type="button"
          className="close-icons"
          onClick={() => handleDelete(item)}
        ></Button>
      </div>
    </li>
  );
});

export default ContactPaymentItem;
