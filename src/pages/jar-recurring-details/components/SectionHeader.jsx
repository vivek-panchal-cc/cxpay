import React from "react";
import WrapAmount from "components/wrapper/WrapAmount";
import LoaderWdrawHeader from "loaders/LoaderWdrawHeader";
import {
  getInitials,
  getRandomColorClass,
  withdrawConsts,
} from "constants/all";
import { IconAlert } from "styles/svgs";

const SectionHeader = (props) => {
  const { loading, details } = props;
  const {
    amount = "",
    profile_image = "",
    is_group = "",
    name = "",
    is_deleted = false,
  } = details || {};

  const profileURL =
    is_group.toString() === "1"
      ? profile_image || "/assets/images/group_contact_profile.png"
      : profile_image || "/assets/images/single_contact_profile.png";

  const { classText, classStatus } = withdrawConsts?.[status] || {};

  return (
    <>
      <div
        className="rcr-innner-wrap rcr-innner-wrap-1 pb-0 d-flex flex-wrap w-100"
        // style={{ paddingBottom: "0px" }}
      >
        <div className="rcrc-img-wrap rcr-img-wrap">
          <span bg-color="#000" className="user-thumb-name">
            {/* <img src={profileURL} alt="" /> */}
            {profile_image ? (
              <img src={profile_image} className="blue-bg" alt="" />
            ) : (
              <div
                className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                  name
                )}`}
              >
                {getInitials(name)}
              </div>
            )}
          </span>
        </div>
        <div className="rcr-info-main">
          {loading ? (
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
        {is_deleted && (
          <div>
            <p className="text-danger">
              <IconAlert height="20px" width="20px" /> You have deleted this
              group.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default SectionHeader;
