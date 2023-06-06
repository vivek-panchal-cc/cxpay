import React from "react";
import SectionAmountDetails from "./components/SectionAmountDetails";
import SectionTransactionDetails from "./components/SectionTransactionDetails";
import SectionEligibility from "./components/SectionEligibility";
import SectionBankDetails from "./components/SectionBankDetails";
import SectionWithdrawHistory from "./components/SectionWithdrawHistory";
import SectionTransactionReceipt from "./components/SectionTransactionReceipt";
import SectionButtons from "./components/SectionButtons";

const WithdrawDetails = () => {
  return (
    <div className="w-75 shadow p-4">
      <h4 className="fs-4">Transaction Details</h4>
      <SectionAmountDetails
        amount={500}
        articles={[
          {
            title: "Sepecification",
            description:
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates asperiores veniam fugiat reprehenderit consequatur repellat, quibusdam eos labore omnis at eius tenetur ut esse inventore quas dolores commodi!",
          },
        ]}
      />
      <SectionTransactionDetails />
      <SectionBankDetails />
      <SectionEligibility />
      <SectionWithdrawHistory />
      <SectionTransactionReceipt />
      <SectionButtons />
    </div>
  );
};

export default WithdrawDetails;
