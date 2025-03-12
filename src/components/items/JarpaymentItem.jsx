import React, { forwardRef, memo } from "react";
import Button from "components/ui/Button";
import Input from "components/ui/Input";
import Image from "components/ui/Image";
import Tooltip from "components/tooltips/Tooltip";
import { CURRENCY_SYMBOL } from "constants/all";
import { getInitials, getRandomColorClass } from "constants/all";

const JarPaymentItem = forwardRef((props, ref) => {
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
  const { jar_name, jar_url: imgUrl } = item;
  const isDisable = disableSpecification && disableAmount;

  return (
    <li>
      <div className="payee-name-img-wrap">
        <div className="payee-img">
          {/* <Image
            src={imgUrl}
            fallbacksrc={fallbackImgUrl}
            className=""
            style={{ objectPosition: "center", objectFit: "cover" }}
            alt="contact img"
          /> */}
          {imgUrl ? (
            <Image
              src={imgUrl}
              className="blue-bg"
              style={{ objectPosition: "center", objectFit: "cover" }}
              alt="contact img"
            />
          ) : (
            <div
              className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                jar_name
              )}`}
            >
              {getInitials(jar_name)}
            </div>
          )}
        </div>
        <div className="payee-name">
          <h4 className="jar-name-word-ellipsis" title={jar_name}>
            {jar_name}
          </h4>
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
          onChange={(e) => {
            let value = e.target.value.replace(/[^0-9.]/g, ""); // Allow only numbers and decimals

            // Prevent more than one decimal point
            const decimalCount = (value.match(/\./g) || []).length;
            if (decimalCount > 1) {
              value = value.slice(0, -1); // Remove extra decimal point
            }

            // Allow only up to 6 digits before the decimal point
            const [integerPart, decimalPart] = value.split(".");
            if (integerPart.length <= 6) {
              if (decimalPart && decimalPart.length > 2) {
                // Limit to two decimal places
                formik.setFieldValue(
                  fieldNameAmount,
                  integerPart + "." + decimalPart.slice(0, 2)
                );
              } else {
                formik.setFieldValue(fieldNameAmount, value);
              }
            } else {
              formik.setFieldValue(
                fieldNameAmount,
                integerPart.slice(0, 6) +
                  (decimalPart ? `.${decimalPart.slice(0, 2)}` : "")
              );
            }
          }}
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
          // maxLength="6"
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

export default JarPaymentItem;
