import React from "react";
import { IconBank } from "styles/svgs";

const SectionHeader = (props) => {
  return (
    <>
      <div className="wcr-innner-wrap wcr-innner-wrap-1 d-flex flex-wrap w-100">
        <div className="wcr-img-wrap wbr-img-wrap">
          <span bg-color="#000">
            <IconBank stroke="#363853" />
          </span>
        </div>
        <div className="wcr-info-main">
          <div className="wcr-info-1 d-flex flex-wrap">
            <div className="wcr-card-data">
              <h2>Bank Name Here</h2>
              <p>xxxx xxxx xxxx 1234</p>
            </div>
            <div className="wcr-card-amt wbr-card-amt">
              <p className="green font-bold">Accepted</p>
              <h2>90.00 NAFl</h2>
            </div>
          </div>
        </div>
      </div>
      <div className="wcr-info-2">
        <h4 className="font-16-quick">Specifications</h4>
        <p>
          Lorem Ipsum Dolor Sit amet. Lorem Ipsum Dolor Sit amet.Lorem Ipsum
          Dolor Sit amet.Lorem Ipsum Dolor Sit amet.
        </p>
      </div>
    </>
  );
};

export default SectionHeader;
