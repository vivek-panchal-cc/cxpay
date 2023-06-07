import React, { useEffect, useRef, useState } from "react";
import { IconRightArrowBig } from "styles/svgs";

const InputDropdown = (props) => {
  const { className, handleClick, value } = props;
  const randomStr = `${Math.round(Math.random() * 1000)}`;

  const dropRef = useRef(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    function handleclickOutside(event) {
      if (!dropRef.current) return;
      if (!dropRef?.current?.contains(event.target)) setToggle(false);
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [dropRef]);

  return (
    <div className="position-relative">
      <div
        className={`form-field position-relative z-1 ${className}`}
        onClick={handleClick}
      >
        <input
          id={`dropIn${randomStr}`}
          type="text"
          className="form-control"
          value={value}
          onClick={() => setToggle((e) => !e)}
          readOnly
        />
        <label
          htmlFor={`dropIn${randomStr}`}
          className="position-absolute"
          style={{ top: "6px", right: "15px" }}
        >
          <IconRightArrowBig
            style={{ stroke: "#0081c5", transform: "rotate(90deg)" }}
          />
        </label>
      </div>
      {toggle ? (
        <div
          className="position-absolute p-4 bg-white shadow w-100"
          ref={dropRef}
        >
          hello
        </div>
      ) : null}
    </div>
  );
};

export default InputDropdown;
