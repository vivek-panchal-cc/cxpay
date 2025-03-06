import WrapAmount from "components/wrapper/WrapAmount";
import {
  CURRENCY_SYMBOL,
  getInitials,
  getRandomColorClass,
  isAdminApprovedWithRenewCheck,
  isComponentDisabled,
} from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBackgroundStar, IconBin, IconDelete, IconEdit } from "styles/svgs";

const OwnJarListItem = (props) => {
  const { details, handleEdit, handleDelete } = props;
  const navigate = useNavigate();

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

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/view-recurring-payment-details/${id}`);
  };

  const renderButtons = () => {
    if (admin_approved) {
      if (
        show_renew_section !== "disable_fund_action" &&
        show_renew_section !== "renew_limit_exceed_and_disable"
      ) {
        return (
          <div className="con-listing-btn-wrap">
            <button
              className="btn btn-primary con-req-btn"
              onClick={() => handleSendRequest([contact])}
            >
              Share Jar
            </button>
            <button
              className="btn btn-primary con-send-btn"
              onClick={() => handleSendContacts([contact])}
            >
              Add Fund
            </button>
          </div>
        );
      } else {
        return (
          <div className="con-listing-btn-wrap">
            <button className="btn btn-primary contacts-admin-approved-disabled">
              Share Jar
            </button>
            <button className="btn btn-primary contacts-admin-approved-disabled">
              Add Fund
            </button>
          </div>
        );
      }
    }
  };

  return (
    <li>
      <label className={`con-listing-info`}>
        <div className="jar-con-list-uimg">
          {details?.jar_icon ? (
            <img src={details?.jar_icon} className="blue-bg" alt="" />
          ) : (
            <div
              className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                details?.jar_name
              )}`}
            >
              {getInitials(details?.jar_name)}
            </div>
          )}
        </div>

        <div className="con-list-uname">{details?.jar_name}</div>
      </label>
      <div className="con-listing-phone">
        {/* <p>{details?.jar_category_name}</p> */}
        <div className="jar-avatar-group">
          {details.members.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="jar-avatar-item"
              style={{ left: `${index * 20}px` }}
            >
              {member.profile_image ? (
                <img
                  src={member.profile_image}
                  alt={member.member_name}
                  className="jar-avatar-img"
                />
              ) : (
                <div
                  className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                    member.member_name
                  )}`}
                  style={{ fontSize: "12px", borderRadius: "0px" }}
                >
                  {getInitials(member.member_name)}
                </div>
              )}
            </div>
          ))}
          {details.members.length > 3 && (
            <div
              className="jar-avatar-item jar-more-members"
              style={{ left: `${3 * 20}px` }}
            >
              +{details.members.length - 3}
            </div>
          )}
        </div>
      </div>
      <div className="jar-con-listing">
        <div className="jar-deposited-amount">
          <WrapAmount
            value={details?.deposite_amount}
            prefix={`${CURRENCY_SYMBOL} `}
          />
          &nbsp;
          <span className="jar-targeted-amount">
            <WrapAmount
              value={details?.target_amount}
              prefix={`/ ${CURRENCY_SYMBOL} `}
            />
          </span>
        </div>
        <div className="jar-progress-bar-container">
          <div
            className="jar-progress-bar"
            style={{
              width: `${
                (details?.deposite_amount / details?.target_amount) * 100
              }%`,
              background:
                (details?.deposite_amount / details?.target_amount) * 100 > 80
                  ? "#93DF6F"
                  : "#007bff",
            }}
          ></div>
        </div>
      </div>

      <div className="cont-listing-last-wrap">
        {/* <div className="con-listing-edit-wrap">
          <a className="conlist-edit-a con-list-edit-star">
            <IconBackgroundStar
              fillBack={details?.is_favourite ? "#F9DB3E" : "#F3F3F3"}
              fillStar={details?.is_favourite ? "#fff" : ""}
            />
          </a>
          <button className="conlist-del-a con-list-up">
            <IconDelete />
          </button>
        </div> */}
        {renderButtons()}
      </div>
    </li>
  );
};

export default OwnJarListItem;
