import Image from "components/ui/Image";
import { renameKeys } from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext } from "react";
import { useSelector } from "react-redux";

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
      return !(item.admin_approved) || !(item.kyc_approved);
    } else {
      return true
    }
  }

  return (
    <div className={className}>
      <div className="cb-div">
        {isSelectable ? (
          <input
            id={`check${id}`}
            type={"checkbox"}
            value={id}
            onChange={handleSelect}
            checked={isChecked}
            disabled={group_id ? "" : disabledCheckedBox()}
          />
        ) : null}
        <label
          htmlFor={`check${id}`}
          className={`cursor-pointer ${
            fullWidth ? "img-wrap" : "recent-con-img-wrap"
          } ${imgUrl ? "grp-user-up-img" : ""}`}
        >
          <Image src={imgUrl} fallbacksrc={fallbackImgUrl} alt="contact img" />
        </label>
      </div>
      <div className="contact-name">{title}</div>
    </div>
  );
};
export default ContactCard;
