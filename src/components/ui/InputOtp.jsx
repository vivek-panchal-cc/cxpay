import React, { useEffect, useState } from "react";
import styles from "./input.module.scss";

function InputOtp(props) {
  const {
    labelname = "",
    error,
    otpSize = 4,
    onChange,
    className,
    name,
    value,
    isSubmitting = false,
    handleSubmit,
  } = props;

  const [inputArr] = useState(Array.from(Array(otpSize).keys()));
  const [otpInputs, setOtpInputs] = useState({});

  useEffect(() => {
    const otps = inputArr.reduce((acc, curr) => {
      const otpVal = value.charAt(curr).trim() ? value.charAt(curr) : "";
      acc[`otp${curr}`] = otpVal;
      return acc;
    }, {});
    setOtpInputs(otps);
  }, [value, inputArr]);

  useEffect(() => {
    const value = inputArr
      .map((item) => otpInputs[`otp${item}`] || " ")
      .toString()
      .replace(/,/g, "");
    onChange({ target: { name: name, value: value } });
  }, [otpInputs, inputArr, name, onChange]);

  const handleChange = (e) => {
    const tval = parseInt(e.target.value.charAt(0));
    const isNext = !isNaN(tval);
    setOtpInputs((cs) => ({
      ...cs,
      [e.target.name]: isNext ? tval.toString() : "",
    }));
    e.target?.select();
    isNext && e.target?.nextSibling?.focus();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        e.stopPropagation();
        const tval = otpInputs[e.target.name];
        const isPrev = tval.trim() ? false : true;
        setOtpInputs((cs) => ({
          ...cs,
          [e.target.name]: "",
        }));
        isPrev && e.target?.previousSibling?.focus();
        return;
      case "Enter":
        e.preventDefault();
        e.stopPropagation();
        if (handleSubmit && !isSubmitting) handleSubmit();
        return;
      default:
        return;
    }
  };

  return (
    <div className={`d-flex flex-column ${styles.otp_input}`}>
      {labelname ? (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      ) : null}
      <div className="d-flex">
        {inputArr?.map((item) => (
          <input
            key={item}
            type="text"
            min={0}
            max={9}
            name={`otp${item}`}
            value={otpInputs?.[`otp${item}`] || ""}
            className={`${className}`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoFocus={item === 0 ? true : false}
          />
        ))}
      </div>
      {error ? <p className="text-danger ps-2">{error}</p> : null}
    </div>
  );
}

export default InputOtp;
