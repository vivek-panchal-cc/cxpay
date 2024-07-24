import React from "react";
import WithdrawCardItem from "components/items/WithdrawCardItem";

const WithdrawCardList = (props) => {
  const { classNameList = "", classNameItem = "", list = [] } = props;

  return (
    <ul className={`${classNameList}`}>
      {list?.map((item, index) => (
        <WithdrawCardItem
          key={item?.transaction_id || index}
          className={`${classNameItem}`}
          itemDetails={item}
        />
      ))}
    </ul>
  );
};

export default WithdrawCardList;
