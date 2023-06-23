import { WithdrawDetailsContext } from "context/withdrawDetailsContext";
import React, { useContext } from "react";

const SectionAdminComments = () => {
  const { isLoading, withdrawType, details } = useContext(
    WithdrawDetailsContext
  );
  const { comment } = details || {};

  if (withdrawType === "card") return null;
  return (
    <div className="wcr-innner-wrap wbr-innner-wrap-4">
      <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
        Admin Comments
      </div>
      <p className="font-12 dark_blue">{comment}</p>
    </div>
  );
};

export default SectionAdminComments;
