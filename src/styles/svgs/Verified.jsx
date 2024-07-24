import * as React from "react";
const Verified = (props) => (
  <svg
    fill="#93e06f"
    width={25}
    height={25}
    viewBox="0 0 24 24"
    id="verified"
    data-name="Flat Line"
    xmlns="http://www.w3.org/2000/svg"
    className="icon flat-line"
    {...props}
  >
    <circle
      cx={12}
      cy={12}
      r={10}
      style={{
        fill: "#93e06f",
        strokeWidth: 2,
      }}
    />
    <polyline
      id="primary"
      points="8 12 11 15 16 10"
      style={{
        fill: "none",
        stroke: "#ffff",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
    <path id="primary-2" data-name="primary" />
  </svg>
);
export default Verified;
