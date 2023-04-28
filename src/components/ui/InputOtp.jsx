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
    handleSubmit,
  } = props;

  const [inputArr] = useState(Array.from(Array(otpSize).keys()));
  const [otpInputs, setOtpInputs] = useState({});

  useEffect(() => {
    const otps = inputArr.reduce((acc, curr) => {
      acc[`otp${curr}`] = value.charAt(curr);
      return acc;
    }, {});
    setOtpInputs(otps);
  }, [value, inputArr]);

  useEffect(() => {
    const value = inputArr
      .map((item) => otpInputs[`otp${item}`])
      .toString()
      .replace(/,/g, "");
    onChange({ target: { name: name, value: value } });
  }, [otpInputs, inputArr, name, onChange]);

  const handleChange = (e) => {
    const tval = parseInt(e.target.value.charAt(0));
    setOtpInputs((cs) => ({
      ...cs,
      [e.target.name]: tval >= 0 && tval <= 9 ? tval.toString() : "",
    }));
    tval >= 0 && tval <= 9
      ? e.target?.nextSibling?.focus()
      : e.target?.previousSibling?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.name === `otp${inputArr.length - 1}`) {
      e.preventDefault();
      e.stopPropagation();
      handleSubmit && handleSubmit();
    }
  };

  return (
    <div className={`d-flex flex-column ${styles.otp_input}`}>
      {labelname && (
        <label htmlFor="" className="mb-2">
          {labelname}
        </label>
      )}
      <div className="d-flex">
        {inputArr?.map((item) => (
          <input
            key={item}
            type="text"
            min={0}
            max={9}
            maxLength={1}
            name={`otp${item}`}
            value={otpInputs?.[`otp${item}`] || ""}
            className={`${className}`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            inputMode="numeric"
          />
        ))}
      </div>
      {error && <p className="text-danger ps-2">{error}</p>}
    </div>
  );
}

export default InputOtp;
