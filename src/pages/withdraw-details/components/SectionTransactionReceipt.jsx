import React from "react";
import { IconDownload } from "styles/svgs";

const SectionTransactionReceipt = () => {
  return (
    <div class="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
      <div class="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
        Transection Reciept
      </div>
      <div class="wr-dwld-wrap">
        <ul>
          <li>
            <button>
              <IconDownload stroke="black" />
            </button>
          </li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
    </div>
  );
};

export default SectionTransactionReceipt;
