import Image from "components/ui/Image";
import { renameKeys } from "constants/all";
import React from "react";

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
