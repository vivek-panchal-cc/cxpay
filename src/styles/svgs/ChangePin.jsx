import * as React from "react";
const ChangePin = (props) => (
  <svg
    width={72}
    height={72}
    viewBox="0 0 72 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text
      x={18}
      y={45}
      fontSize={28}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"      
    >
      {"*"}
    </text>
    <text
      x={36}
      y={45}
      fontSize={28}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"      
    >
      {"*"}
    </text>
    <text
      x={54}
      y={45}
      fontSize={28}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="middle"      
    >
      {"*"}
    </text>
  </svg>
);
export default ChangePin;
