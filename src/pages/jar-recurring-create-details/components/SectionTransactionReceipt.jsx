import React, { useContext } from "react";
import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import {
  IconDownload,
  IconDownloadDocument,
  IconDownloadImage,
  IconDownloadPdf,
} from "styles/svgs";
import { apiRequest } from "helpers/apiRequests";
import { toast } from "react-toastify";
import { LoaderContext } from "context/loaderContext";
import { isValidFileType } from "constants/all";

const SectionTransactionReceipt = (props) => {
  const { setIsLoading } = useContext(LoaderContext);
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const { transaction_id, receipt_images = [] } = details || {};

  const downloadRecipt = async (reciptId) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.viewBankWithdrawReceipt({
        receipt_id: reciptId,
      });
      if (!data.success) throw data?.message;
      const { encoded_file, file_name } = data.data;
      const extension = file_name?.split(".")?.[1] || "";
      const dtnow = new Date().toISOString();
      const linkSource = `data:application/${extension};base64,${encoded_file}`;
      const downloadLink = document.createElement("a");
      const fileName = `${transaction_id}_${reciptId}_${dtnow}.${extension}`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.log(error);
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileName = "") => {
    switch (true) {
      case isValidFileType(fileName?.toLowerCase(), "image"):
        return <IconDownloadImage />;
      case isValidFileType(fileName?.toLowerCase(), "pdf"):
        return <IconDownloadPdf />;
      default:
        return <IconDownloadDocument />;
    }
  };

  if (withdrawType === "card") return null;
  return (
    <div className="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
      <div className="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
        Transaction Reciept
      </div>
      <div className="wr-dwld-wrap">
        <ul>
          {[1, 2, 3, 4]?.map((item, index) => {
            const { id = "", receipt = "" } = receipt_images?.[index] || {};
            return (
              <li key={item} className={`${id ? "bg-transparent" : ""}`}>
                {id ? (
                  <button
                    className="d-flex justify-content-center align-items-center p-0"
                    onClick={() => downloadRecipt(id)}
                    download
                  >
                    {getFileIcon(receipt)}
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
