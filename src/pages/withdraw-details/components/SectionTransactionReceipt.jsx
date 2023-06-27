import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import React, { useContext } from "react";
import { IconDownload } from "styles/svgs";

const SectionTransactionReceipt = (props) => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const { receipt_images = [] } = details || {};

  if (withdrawType === "card") return null;
  return (
    <div className="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
      <div className="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
        Transection Reciept
      </div>
      <div className="wr-dwld-wrap">
        <ul>
          {receipt_images?.map((item) => {
            return (
              <li key={item}>
                <button>
                  <IconDownload stroke="black" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SectionTransactionReceipt;
