import React from "react";
import WithdrawBankItem from "components/items/WithdrawBankItem";

const WithdrawBankList = (props) => {
  const {
    classNameList = "",
    classNameItem = "",
    list = [],
    handleCancel = () => {},
  } = props;

  return (
    <ul className={`${classNameList}`}>
      {list?.map((item, index) => (
        <WithdrawBankItem
          key={item?.transaction_id || index}
          className={`${classNameItem}`}
          itemDetails={item}
          handleCancel={handleCancel}
        />
      ))}
    </ul>
  );
};

export default WithdrawBankList;
