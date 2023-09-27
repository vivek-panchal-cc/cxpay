import React, { useContext } from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import LoaderWdrawHeader from "loaders/LoaderWdrawHeader";
import { withdrawConsts } from "constants/all";

const SectionHeader = (props) => {
  const { isLoading } = useContext(WithdrawDetailsContext);

  const {
    amount = "",
    image = "",
    is_group = "",
    name = "",
  } = props?.details || {};

  const profileURL =
    is_group === "1"
      ? "/assets/images/group_contact_profile.png"
      : image || "/assets/images/single_contact_profile.png";

  const { classText, classStatus } = withdrawConsts?.[status] || {};

  return (
    <>
      <div
        className="rcr-innner-wrap rcr-innner-wrap-1 d-flex flex-wrap w-100"
        // style={{ paddingBottom: "0px" }}
      >
        <div className="rcrc-img-wrap rcr-img-wrap">
          <span bg-color="#000" className="user-thumb-name">
            <img src={profileURL} alt="" />
          </span>
        </div>
        <div className="rcr-info-main">
          {isLoading ? (
            <div className="rcr-info-1 d-flex flex-wrap">
              <LoaderWdrawHeader
                loaderPorps={{ height: 20, width: "100%" }}
                divProps={{ rx: "5", ry: "5", width: "12%", height: "20" }}
              />
            </div>
          ) : (
            <div className="rcr-info-1 d-flex flex-wrap">
              <div className="rcr-card-data">
                <div style={{ marginBottom: "10px" }}></div>
                <h2>{name}</h2>
              </div>
              <div className="rcr-card-amt wbr-card-amt">
                <p className={`font-bold ${classText}`}>{status}</p>
                <h2 className={`${classText}`} style={{ color: "#56BE15" }}>
                  <WrapAmount value={amount} />
                  <p>Total Amount</p>
                </h2>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SectionHeader;
