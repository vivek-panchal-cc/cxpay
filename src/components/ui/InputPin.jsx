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

  // Update pinInputs based on initial `value` prop
  useEffect(() => {
    if (value === "") {
      // Reset pinInputs and maskInputs if value is empty
      setPinInputs({});
      setMaskInputs({});
    } else if (Object.keys(pinInputs).length === 0) {
      const initialPins = inputArr.reduce((acc, curr) => {
        acc[`pin${curr}`] = value.charAt(curr) || "";
        return acc;
      }, {});
      setPinInputs(initialPins);
      setMaskInputs(
        inputArr.reduce((acc, curr) => {
          acc[`pin${curr}`] = initialPins[`pin${curr}`] ? "•" : "";
          return acc;
        }, {})
      );
    }
  }, [value, inputArr]);

  // Trigger onChange only if the pin value has actually changed
  useEffect(() => {
    const pinValue = inputArr
      .map((item) => pinInputs[`pin${item}`] || " ")
      .join("");
    if (pinValue.trim()) {
      onChange({ target: { name, value: pinValue } });
    }
  }, [pinInputs, inputArr, name, onChange]);

  useEffect(() => {
    if (ref) {
      ref.current = firstInputRef.current;
    }
  }, [ref]);

  const handleChange = (e, index) => {
    const newValue = e.target.value.slice(-1);
    const isNext = Boolean(newValue && index < pinSize - 1);

    setPinInputs((cs) => ({
      ...cs,
      [e.target.name]: newValue,
    }));

    setMaskInputs((cs) => ({
      ...cs,
      [e.target.name]: newValue ? "•" : "",
    }));

    if (isNext) {
      e.target.nextSibling?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    switch (e.key) {
      case "Backspace":
        e.preventDefault();
        setPinInputs((cs) => ({
          ...cs,
          [e.target.name]: "",
        }));
        setMaskInputs((cs) => ({
          ...cs,
          [e.target.name]: "",
        }));
        if (!pinInputs[e.target.name] && index > 0) {
          e.target.previousSibling?.focus();
        }
        break;
      case "Enter":
        e.preventDefault();
        if (handleSubmit && !isSubmitting) handleSubmit();
        break;
      default:
        break;
    }
  };

  return (
    <div className={`d-flex flex-column ${styles.otp_input}`}>
      {labelname && <label className="mb-2">{labelname}</label>}
      <div className="d-flex">
        {inputArr.map((item, index) => (
          <input
            id={`pin-input-${item}`}
            key={item}
            type="text"
            name={`pin${item}`}
            value={maskInputs[`pin${item}`] || ""}
            className={className}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            ref={index === 0 ? firstInputRef : null}
            maxLength={1}
            autoComplete="one-time-code"
          />
        ))}
      </div>
      {error && <p className="text-danger ps-2 p-0">{error}</p>}
    </div>
  );
});

export default InputPin;
