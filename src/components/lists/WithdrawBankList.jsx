import React from "react";
import WithdrawBankItem from "components/items/WithdrawBankItem";

const WithdrawBankList = (props) => {
  const { classNameList = "", classNameItem = "", list = [] } = props;

  return (
    <ul className={`${classNameList}`}>
      {list?.map((item, index) => (
        <WithdrawBankItem
          key={item?.transaction_id || index}
          className={`${classNameItem}`}
          itemDetails={item}
        />
      ))}
    </ul>
  );
};

export default WithdrawBankList;
