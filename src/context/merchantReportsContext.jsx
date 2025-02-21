import React, { useContext, useMemo, useState } from "react";
import ModalMerchantDetailReports from "components/modals/ModalMerchantDetailReports";

export const MerchantReportsContext = React.createContext({});

const MerchantReportsProvider = ({ children }) => {
  const [merchantReportDetails, setMerchantReportDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [reloadList, setReloadList] = useState(false);

  const handleMerchantReportDetails = async (details) => {
    setShowDetails(true);
    setMerchantReportDetails(details);
  };

  const reportsDetails = useMemo(
    () => ({ reloadList, handleMerchantReportDetails }),
    [reloadList, handleMerchantReportDetails]
  );

  return (
    <MerchantReportsContext.Provider value={reportsDetails}>
      {children}
      <ModalMerchantDetailReports
        id="user-details-popup"
        className="user-details-modal"
        show={showDetails}
        setShow={setShowDetails}
        details={merchantReportDetails}
      />
    </MerchantReportsContext.Provider>
  );
};

export default MerchantReportsProvider;
