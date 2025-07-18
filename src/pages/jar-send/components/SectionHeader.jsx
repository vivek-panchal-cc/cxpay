import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import LoaderJarWdrawHeader from "loaders/LoaderJarWdrawHeader";

const SectionHeader = (props) => {
  const { details } = props;
  const { total_amount = "" } = details || {};

  return (
    <>
      <div className="d-flex w-100 justify-content-center">
        <div className="rcr-info-1 d-flex flex-wrap">
          <div className="wbr-card-amt text-center">
            <h2 style={{ color: "#56BE15" }}>
              <WrapAmount value={total_amount} />
              <p>Total Amount</p>
            </h2>
          </div>
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
