import React from "react";
import WithdrawCardItem from "components/items/WithdrawCardItem";

const WithdrawCardList = (props) => {
  const { classNameList = "", classNameItem = "" } = props;

  return (
    <ul className={`${classNameList}`}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <WithdrawCardItem key={item} className={`${classNameItem}`} />
      ))}
    </ul>
  );
};

export default WithdrawCardList;
