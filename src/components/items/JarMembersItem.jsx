import React, { useContext } from "react";
import { IconBin } from "styles/svgs";
import {
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
  isAdminApprovedWithRenewCheck,
  isComponentDisabled,
} from "constants/all";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

const JarMembersItem = (props) => {
  const { member, handleDeleteMember, tabName, flags } = props;
  const { is_owner, jar_status } = flags;

  const {
    account_number,
    name,
    mobile_number,
    profile_image,
    request_accept,
    user_type,
    is_deletable,
    display_text,
    total_amount,
    display_amount,
  } = member;

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;
  const adminApprovedWithRenewCheck = isAdminApprovedWithRenewCheck(
    admin_approved,
    show_renew_section
  );
  const disableComponent = isComponentDisabled(
    admin_approved,
    show_renew_section
  );

  return (
    <>
      <li>
        <label
          className={`${name ? "mer-listing-info" : "invited-con-info"}`}
          htmlFor={account_number}
        >
          <div className="con-list-uimg">
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
          </div>
          {name ? <div className="mer-list-uname">{name}</div> : mobile_number}
        </label>
        <div className="jar-member-display-text">
          <p>{display_text}</p>
        </div>
        <div
          className="d-flex"
          style={{ minWidth: "200px", maxWidth: "200px" }}
        >
          <div
            style={{ textTransform: "unset" }}
            className={`act-amt-wrap text-end cx-color-green`}
          >
            {display_amount}
          </div>
        </div>
        {is_owner && jar_status && (
          <div className="merchant-listing-last-wrap">
            <div className="right-activity-div w-0">
              <button
                className={`act-del-wrap ${
                  adminApprovedWithRenewCheck && is_deletable
                    ? ""
                    : "contacts-admin-approved-disabled"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMember(account_number);
                }}
                style={{ background: "#FF3333", borderRadius: "50px" }}
                disabled={disableComponent || !is_deletable}
              >
                <IconBin style={{ stroke: "#F3F3F3" }} />
              </button>
            </div>
          </div>
        )}
      </li>
    </>
  );
};

export default JarMembersItem;
