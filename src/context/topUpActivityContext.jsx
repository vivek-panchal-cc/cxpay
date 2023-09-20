import React, { useContext, useMemo, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { SendPaymentContext } from "./sendPaymentContext";
import { LoaderContext } from "./loaderContext";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { toast } from "react-toastify";
import {
  ACT_REQUEST_RECEIVE,
  ACT_REQUEST_SEND,
  ACT_STATUS_APPROVED,
  ACT_STATUS_CANCELLED,
  ACT_STATUS_DECLINED,
  ACT_STATUS_PAID,
  ACT_STATUS_PENDING,
  ACT_STATUS_REJECTED,
  ACT_TRANSACT_CREDIT,
  ACT_TRANSACT_DEBIT,
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
} from "constants/all";
import ModalTopUpActivityDetail from "components/modals/ModalTopUpActivityDetail";

export const TopUpActivityContext = React.createContext({});

const TopUpActivityProvider = ({ children }) => {
  const { setIsLoading } = useContext(LoaderContext);
  const { handleSendContacts } = useContext(SendPaymentContext);
  const [activityDetails, setActivityDetails] = useState({});
  const [showDetails, setShowDetails] = useState(false);
  const [loadingActDetails, setLoadingActDetails] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [reloadList, setReloadList] = useState(false);
  const [discardActDetail, setDiscardActDetail] = useState({
    heading: "",
    subHeading: "",
    status: "",
    id: "",
  });

  const printTopUpActivityDetails = async ({
    id,
    topup_type,
    topup_ref_id,
  }) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getTopUpPrintDetails({
        transaction_id: id,
      });
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
      const base64pdf = data.data;
      const normalizedTopUpType = topup_type ? topup_type.toLowerCase() : "";
      const transactId =
        normalizedTopUpType === "card" || normalizedTopUpType === "cash"
          ? topup_ref_id
          : id;
      const dtnow = new Date().toISOString();
      const linkSource = `data:application/pdf;base64,${base64pdf}`;
      const fileName = `${transactId}_${dtnow}.pdf`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityDetail = async ({ id }) => {
    if (!id) return;
    setShowDetails(true);
    setLoadingActDetails(true);
    try {
      const { data } = await apiRequest.getTopupActivityDetails({ id });
      if (!data.success) throw data.message;
      const details = data.data;
      if (!details) return setShowDetails(false);
      setActivityDetails(details);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      setShowDetails(false);
    } finally {
      setLoadingActDetails(false);
    }
  };

  const changeActivityStatus = async (id, status) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.changeRequestStatus({
        id,
        status,
      });
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
      setReloadList((cs) => !cs);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleActivityDiscard = async (actDetails) => {
    const { activity_type, request_type, status, id } = actDetails || {};
    setShowDetails(false);
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
        setDiscardActDetail({
          heading: "Decline Request",
          subHeading: "Are you sure to decline the requested payment?",
          id,
          status: ACT_STATUS_DECLINED,
        });
        setShowConfirmPopup(true);
        return;
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PENDING}`:
        setDiscardActDetail({
          heading: "Cancel Request",
          subHeading: "Are you sure to cancel the request?",
          id,
          status: ACT_STATUS_CANCELLED,
        });
        setShowConfirmPopup(true);
        return;
      default:
        return;
    }
  };

  const handleConfirmActivityDiscard = async () => {
    const { id, status } = discardActDetail;
    if (!id || !status) return;
    setShowConfirmPopup(false);
    await changeActivityStatus(id, status);
  };

  const handleActivityRespond = (actDetails) => {
    setShowDetails(false);
    printTopUpActivityDetails(actDetails);
  };

  const activityValues = useMemo(
    () => ({ reloadList, handleActivityDetail }),
    [reloadList, handleActivityDetail]
  );

  return (
    <TopUpActivityContext.Provider value={activityValues}>
      {children}
      <ModalTopUpActivityDetail
        id="user-details-popup"
        className="user-details-modal"
        show={showDetails}
        setShow={setShowDetails}
        loading={loadingActDetails}
        details={activityDetails}
        handleCancel={handleActivityDiscard}
        handleSubmit={handleActivityRespond}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        heading={discardActDetail.heading}
        subHeading={discardActDetail.subHeading}
        handleCallback={handleConfirmActivityDiscard}
      />
    </TopUpActivityContext.Provider>
  );
};

export default TopUpActivityProvider;
