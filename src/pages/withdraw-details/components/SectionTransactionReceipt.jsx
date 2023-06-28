import axios from "axios";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import React, { useContext } from "react";
import { IconDownload } from "styles/svgs";

const SectionTransactionReceipt = (props) => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const { receipt_images = [] } = details || {};

  const downloadRecipt = async (recipt) => {
    try {
      const link = `https://cors-anywhere.herokuapp.com/${recipt}`;
      fetch(link, {
        headers: {
          "Access-Control-Allow-Headers": "X-Requested-With",
          "X-Requested-With": "XMLHttpRequest",
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const blobURL = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = blobURL;
          a.style = "display: none";
          a.download = "cwnecowencwe";
          document.body.appendChild(a);
          a.click();
        })
        .catch(() => {
          console.log("ERROR");
        });
    } catch (error) {
      console.log(error);
    }
  };

  if (withdrawType === "card") return null;
  return (
    <div className="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
      <div className="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
        Transection Reciept
      </div>
      <div className="wr-dwld-wrap">
        <ul>
          {[1, 2, 3, 4]?.map((item, index) => {
            const recipt = receipt_images?.[index];
            return (
              <li key={item}>
                {recipt && recipt.length > 0 ? (
                  <button onClick={() => downloadRecipt(recipt)} download>
                    <IconDownload stroke="black" />
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SectionTransactionReceipt;
