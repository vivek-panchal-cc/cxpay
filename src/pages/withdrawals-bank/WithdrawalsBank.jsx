import WithdrawBankList from "components/lists/WithdrawBankList";
import Pagination from "components/pagination/Pagination";
import TabsWithdrawOptions from "components/tabs/TabsWithdrawOptions";
import { WITHDRAW_OPTIONS_TABS_LIST } from "constants/all";
import React from "react";

const WithdrawalsBank = () => {
  return (
    <div>
      <div className="">
        <TabsWithdrawOptions tabsList={WITHDRAW_OPTIONS_TABS_LIST} />
        <WithdrawBankList />
        <Pagination
          active={1}
          size={5}
          siblingCount={2}
          onClickHandler={() => {}}
        />
      </div>
    </div>
  );
};

export default WithdrawalsBank;
