import React, { forwardRef } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Image from "components/ui/Image";
import Tooltip from "components/tooltips/Tooltip";
import { CURRENCY_SYMBOL } from "constants/all";

const ContactPaymentItem = forwardRef((props, ref) => {
  const {
    formik,
    item,
    showDelete,
    handleDelete,
    fieldNameAmount,
    fieldValueAmount,
    fieldNameSpecifications,
    fieldValueSpecifications,
    fieldOnChange,
    fieldOnBlur,
    fieldErrorAmount,
    fieldErrorSpecifications,
    fallbackImgUrl,
    disableSpecification,
    disableAmount,
  } = props;
  const { name, profile_image: imgUrl } = item;
  const isDisable = disableSpecification && disableAmount;

  return (
    <li>
      <div className="payee-name-img-wrap">
        <div className="payee-img">
          <Image
            src={imgUrl}
            fallbacksrc={fallbackImgUrl}
            className=""
            style={{ objectPosition: "center", objectFit: "cover" }}
            alt="contact img"
          />
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
          className={`form-control ${
            fieldErrorSpecifications ? "error-field" : ""
          }`}
          placeholder="Type your specification Here"
          disabled={disableSpecification}
        />
        <Tooltip
          isVisible={fieldErrorSpecifications}
          tooltipText={fieldErrorSpecifications}
        />
      </div>
      <div className="input-select-wrap form-field">
        <Input
          type="text"
          inputMode="decimal"
          name={disableAmount ? "" : fieldNameAmount}
          value={fieldValueAmount}
          onChange={fieldOnChange}
          // onBlur={fieldOnBlur}
          onBlur={(e) => {
            let value = e.target.value.trim();
            // If the input value is empty, set it to '0.00'
            if (!value) {
              value = "0.00";
            } else {
              const hasDecimal = value.includes(".");
              // If there's no decimal point, add .00
              if (!hasDecimal) {
                value += ".00";
              } else {
                // If there's only one digit after the decimal point, add another zero
                const parts = value.split(".");
                if (parts[1].length === 1) {
                  value += "0";
                }
              }
            }
            // Update the formik values with the formatted value
            formik.setFieldValue(fieldNameAmount, value);
            if (fieldOnBlur) {
              fieldOnBlur(e);
          }
          }}
          disabled={disableAmount}
          className={`form-control ${fieldErrorAmount ? "error-field" : ""}`}
          placeholder="0.00"
          maxLength="10"
          ref={ref}
        />
        <Tooltip isVisible={fieldErrorAmount} tooltipText={fieldErrorAmount} />
        <p className="ip_currancy">{CURRENCY_SYMBOL}</p>
      </div>
      <div className="remove-btn">
        {showDelete && !isDisable ? (
          <Button
            type="button"
            className="close-icons"
            onClick={() => handleDelete(item)}
          ></Button>
        ) : null}
      </div>
    </li>
  );
});

export default ContactPaymentItem;
