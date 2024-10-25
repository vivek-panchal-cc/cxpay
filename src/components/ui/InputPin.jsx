import React, { useEffect, useRef, useState, forwardRef } from "react";
import styles from "./input.module.scss";

const InputPin = forwardRef((props, ref) => {
  const {
    labelname = "",
    error,
    pinSize = 5,
    onChange,
    className,
    name,
    value,
    isSubmitting = false,
    handleSubmit,
  } = props;

  const [inputArr] = useState(Array.from(Array(pinSize).keys()));
  const [pinInputs, setPinInputs] = useState({});
  const [maskInputs, setMaskInputs] = useState({});

  const firstInputRef = useRef(null);

  useEffect(() => {
    // Reset the inputs if the value is empty (error case)
    if (value === "") {
      setPinInputs({});
      setMaskInputs({});
      return;
    }

    const pins = inputArr.reduce((acc, curr) => {
      const pinVal =
        value && value.charAt(curr).trim() ? value.charAt(curr) : "";
      acc[`pin${curr}`] = pinVal;
      return acc;
    }, {});
    setPinInputs(pins);
  }, [value, inputArr]);

  useEffect(() => {
    const value = inputArr
      .map((item) => pinInputs[`pin${item}`] || " ")
      .toString()
      .replace(/,/g, "");
    onChange({ target: { name: name, value: value } });
  }, [pinInputs, inputArr, name, onChange]);

  useEffect(() => {
    if (ref) {
      ref.current = firstInputRef.current; // Pass the first input's ref to the forwarded ref
    }
  }, [ref]);

  const handleChange = (e) => {
    const tval = parseInt(e.target.value.charAt(0));
    const isNext = !isNaN(tval);
    setPinInputs((cs) => ({
      ...cs,
      [e.target.name]: isNext ? tval.toString() : "",
    }));
    // Set '•' in masked input for each pin
    setMaskInputs((cs) => ({
      ...cs,
      [e.target.name]: isNext ? "•" : "",
    }));
    e.target?.select();
    isNext && e.target?.nextSibling?.focus();
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        e.stopPropagation();
        const tval = pinInputs[e.target.name];
        const isPrev = tval.trim() ? false : true;
        setPinInputs((cs) => ({
          ...cs,
          [e.target.name]: "",
        }));
        setMaskInputs((cs) => ({
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
        <input
          type="text"
          style={{ display: "none" }}
          autoComplete="username"
        />
        <input
          type="password"
          style={{ display: "none" }}
          autoComplete="new-password"
        />
        {inputArr?.map((item, index) => (
          <input
            id={`pin-input-${item}`}
            key={item}
            type="text"
            min={0}
            max={9}
            name={`pin${item}`}
            value={maskInputs?.[`pin${item}`] || ""}
            className={`${className}`}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete="one-time-code"
            ref={index === 0 ? firstInputRef : null} // Set the ref for the first input
          />
        ))}
      </div>
      {error ? <p className="text-danger ps-2 p-0">{error}</p> : null}
    </div>
  );
});

export default InputPin;
