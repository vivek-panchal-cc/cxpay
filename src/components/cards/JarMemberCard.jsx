import Image from "components/ui/Image";
import { renameKeys } from "constants/all";
import { LoginContext } from "context/loginContext";
import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { getInitials, getRandomColorClass } from "constants/all";

const JarMemberCard = (props) => {
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
  const { id, imgUrl, title } = renameKeys(alias, item);
  const isChecked = selectedList.includes(id.toString());

  return (
    <div className={className}>
      <div className="cb-div">
        {isSelectable ? (
          <input
            id={`check${id}`}
            className={""}
            type={"checkbox"}
            value={id}
            onChange={handleSelect}
            checked={isChecked}
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
export default JarMemberCard;
