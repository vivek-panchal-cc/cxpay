import Image from "components/ui/Image";
import React from "react";

const ContactCard = (props) => {
  const {
    isSelectable,
    isSelected = false,
    handleSelect,
    fullWidth,
    id,
    title,
    imgUrl,
    bgColor,
    fallbackImgUrl,
    className = "",
  } = props;
  return (
    <div className={className}>
      <div className="cb-div">
        {isSelectable && (
          <input
            type={"checkbox"}
            value={id}
            onChange={handleSelect}
            checked={isSelected}
          />
        )}
        <div
          className={`${fullWidth ? "img-wrap" : "recent-con-img-wrap"} ${
            imgUrl ? "grp-user-up-img" : ""
          }`}
        >
          <Image src={imgUrl} fallbacksrc={fallbackImgUrl} alt="contact img" />
        </div>
      </div>
      <div className="contact-name">{title}</div>
    </div>
  );
};
export default ContactCard;
