import WrapAmount from "components/wrapper/WrapAmount";
import {
  CURRENCY_SYMBOL,
  isAdminApprovedWithRenewCheck,
  isComponentDisabled,
} from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IconBin, IconEdit } from "styles/svgs";

const RecurringPaymentItem = (props) => {
  const { details, handleEdit, handleDelete } = props;
  const navigate = useNavigate();
  const today = new Date();
  const {
    id,
    name = "",
    dateTime = "",
    description = "",
    amount,
    profileImg = "",
    frequency,
    startDate = "",
  } = details || {};

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

  const isFutureDate = useMemo(() => {
    const start = new Date(startDate);
    return start > today;
  }, [startDate, today]);

  return (
    <li>
      <div className="left-activity-div">
        <div
          className="user-thumb-name"
          onClick={adminApprovedWithRenewCheck ? handleViewDetails : () => {}}
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
            adminApprovedWithRenewCheck && isFutureDate
              ? ""
              : "contacts-admin-approved-disabled"
          }`}
          onClick={() => handleEdit(id)}
          style={{
            background: "#0081C5",
            width: "33px",
            height: "32px",
          }}
          disabled={disableComponent || !isFutureDate}
        >
          <IconEdit style={{ stroke: "#FFF" }} />
        </button>
        <button
          className={`act-del-wrap rounded ${
            adminApprovedWithRenewCheck
              ? ""
              : "contacts-admin-approved-disabled"
          }`}
          onClick={() => handleDelete(id)}
          style={{ background: "#FF3333" }}
          disabled={disableComponent}
        >
          <IconBin style={{ stroke: "#F3F3F3" }} />
        </button>
      </div>
    </li>
  );
};

export default RecurringPaymentItem;
