import React, { useEffect, useRef, useState } from "react";

const InputDropdown = (props) => {
  const { id = "", className = "", handleClick, value = "" } = props;
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
    <div id={id || `drop${randomStr}`} className={`${className}`}>
      <span className="anchor" onClick={(e) => setToggle((cs) => !cs)}>
        {value}
      </span>
      {toggle ? (
        <ul className="status-items" ref={dropRef}>
          <li>
            <input id="accepted" type="checkbox" />
            <label htmlFor="accepted">
              <span className="checkmark"></span>Accepted
            </label>
          </li>
          <li>
            <input id="pending" type="checkbox" />
            <label htmlFor="pending">
              <span className="checkmark"></span>Pending
            </label>
          </li>
          <li>
            <input id="ProcCessign" type="checkbox" />
            <label htmlFor="ProcCessign">
              <span className="checkmark"></span>Processing
            </label>
          </li>
        </ul>
      ) : null}
    </div>
  );
};

export default InputDropdown;
