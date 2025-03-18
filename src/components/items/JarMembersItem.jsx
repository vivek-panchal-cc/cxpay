import React, { useContext } from "react";
import { IconBin, IconQR } from "styles/svgs";
import {
  capitalizeWordByWord,
  getInitials,
  getRandomColorClass,
  isAdminApprovedWithRenewCheck,
  isComponentDisabled,
} from "constants/all";
import { useSelector } from "react-redux";
import { LoginContext } from "context/loginContext";

const JarMembersItem = (props) => {
  const { member, handleCallback, handleDeleteMember, tabName } = props;
  const {
    account_number,
    member_name,
    mobile_number,
    profile_image,
    request_accept,
    user_type,
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
          className={`${member_name ? "mer-listing-info" : "invited-con-info"}`}
          htmlFor={account_number}
        >
          <div className="con-list-uimg">
            {profile_image ? (
              <img src={profile_image} className="blue-bg" alt="" />
            ) : (
              <div
                className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                  member_name
                )}`}
              >
                {getInitials(member_name)}
              </div>
            )}
          </div>
          {member_name ? (
            <div className="mer-list-uname">{member_name}</div>
          ) : (
            mobile_number
          )}
        </label>

        <div className="merchant-listing-category">
          <p>{capitalizeWordByWord(user_type)}</p>
        </div>

        <div
          className="merchant-icon-wrap"
          onClick={() => handleCallback(member)}
        >
          <span className="merchant-listing-second-last-wrap merchant-icon-settings">
            <IconQR />
          </span>
        </div>
        {tabName === "own" && (
          <div className="merchant-listing-last-wrap">
            <div className="right-activity-div w-0">
              <button
                className={`act-del-wrap ${
                  adminApprovedWithRenewCheck
                    ? ""
                    : "contacts-admin-approved-disabled"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteMember(account_number);
                }}
                style={{ background: "#FF3333", borderRadius: "50px" }}
                disabled={disableComponent}
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
