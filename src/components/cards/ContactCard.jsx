import Image from "components/ui/Image";
import { renameKeys } from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { getInitials, getRandomColorClass } from "constants/all";

const ContactCard = (props) => {
  const {
    isSelectable,
    selectedList = [],
    handleSelect,
    fullWidth,
    item,
    alias = {},
    fallbackImgUrl,
    className = "",
  } = props;
  const { id, title, imgUrl } = renameKeys(alias, item);
  const isChecked = selectedList.includes(id.toString());
  const { group_id } = item || "";
  const { profile } = useSelector((state) => state?.userProfile);
  const { loginCreds } = useContext(LoginContext);
  const { show_renew_section } = loginCreds;

  const disabledCheckedBox = () => {
    if (profile.admin_approved) {
      return !item.admin_approved || !item.kyc_approved;
    } else {
      return true;
    }
  };

  return (
    <div className={className}>
      <div className="cb-div">
        {isSelectable ? (
          <input
            id={`check${id}`}
            className={`${
              !group_id &&
              (disabledCheckedBox() ||
                show_renew_section === "disable_fund_action" ||
                show_renew_section === "renew_limit_exceed_and_disable")
                ? "cursor-not-allowed"
                : ""
            }`}
            type={"checkbox"}
            value={id}
            onChange={handleSelect}
            checked={isChecked}
            disabled={
              group_id
                ? ""
                : disabledCheckedBox() ||
                  show_renew_section === "disable_fund_action" ||
                  show_renew_section === "renew_limit_exceed_and_disable"
            }
          />
        ) : null}
        <label
          htmlFor={`check${id}`}
          className={`cursor-pointer ${
            fullWidth ? "img-wrap" : "recent-con-img-wrap"
          } ${imgUrl ? "grp-user-up-img" : ""}`}
        >
          {/* <Image src={imgUrl} fallbacksrc={fallbackImgUrl} alt="contact img" /> */}
          {imgUrl ? (
            <Image src={imgUrl} className="blue-bg" alt="" />
          ) : (
            <div
              style={{ fontSize: fullWidth ? "35px" : "" }}
              className={`initials-circle d-flex align-items-center justify-content-center ${getRandomColorClass(
                title
              )}`}
            >
              {getInitials(title)}
            </div>
          )}
        </label>
      </div>
      <div className="contact-name">{title}</div>
    </div>
  );
};
export default ContactCard;
