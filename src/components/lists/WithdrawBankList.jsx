import React from "react";
import WithdrawBankItem from "components/items/WithdrawBankItem";

const WithdrawBankList = () => {
  return (
    <ul className="my-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
        <WithdrawBankItem key={item} />
      ))}
    </ul>
  );
};

export default WithdrawBankList;
