import React from "react";
import WithdrawBankItem from "components/items/WithdrawBankItem";

const WithdrawBankList = (props) => {
  const { classNameList = "", classNameItem = "" } = props;

  return (
    <ul className={`${classNameList}`}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <WithdrawBankItem key={item} className={`${classNameItem}`} />
      ))}
    </ul>
  );
};

export default WithdrawBankList;
