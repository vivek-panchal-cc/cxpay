import WrapAmount from "components/wrapper/WrapAmount";
import { CURRENCY_SYMBOL } from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBin, IconEdit } from "styles/svgs";

const RecurringPaymentItem = (props) => {
  const { details, handleEdit, handleDelete } = props;
  const navigate = useNavigate();
  const {
    id,
    name = "",
    dateTime = "",
    description = "",
    amount,
    profileImg = "",
    frequency,
  } = details || {};

  const { admin_approved } = useSelector(
    (state) => state?.userProfile?.profile
  );
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const { dtString } = useMemo(() => {
    if (!dateTime) return { dtString: "" };
    const dt = new Date(dateTime);
    const dtString = dt
      .toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
      .replace(", ", ", at ")
      .replace(/-/g, " ");
    return { dtString };
  }, [dateTime]);

  const handleViewDetails = (e) => {
    navigate(`/view-recurring-payment-details/${id}`);
  };

  return (
    <li>
      <div className="left-activity-div">
        <div
          className="user-thumb-name"
          onClick={
            admin_approved && show_renew_section !== "disable_fund_action"
              ? handleViewDetails
              : () => {}
          }
        >
          <img src={profileImg} alt="" />
          <span>{name}</span>
        </div>
        <div className="activity-date-rec">{dtString}</div>
        <div className="act-spec-add">{frequency.toUpperCase()}</div>
        <div className="seleted-value">
          <WrapAmount value={amount} prefix={`${CURRENCY_SYMBOL} `} />
        </div>
      </div>
      <div className="right-activity-div">
        <button
          className={`act-edit-wrap rounded ${
            admin_approved && show_renew_section !== "disable_fund_action"
              ? ""
              : "contacts-admin-approved-disabled"
          }`}
          onClick={() => handleEdit(id)}
          style={{
            background: "#0081C5",
            width: "33px",
            height: "32px",
          }}
          disabled={
            !admin_approved || show_renew_section === "disable_fund_action"
          }
        >
          <IconEdit style={{ stroke: "#FFF" }} />
        </button>
        <button
          className={`act-del-wrap rounded ${
            admin_approved && show_renew_section !== "disable_fund_action"
              ? ""
              : "contacts-admin-approved-disabled"
          }`}
          onClick={() => handleDelete(id)}
          style={{ background: "#FF3333" }}
          disabled={
            !admin_approved || show_renew_section === "disable_fund_action"
          }
        >
          <IconBin style={{ stroke: "#F3F3F3" }} />
        </button>
      </div>
    </li>
  );
};

export default RecurringPaymentItem;
