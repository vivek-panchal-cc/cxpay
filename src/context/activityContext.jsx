import React, { useContext, useState } from "react";
import { apiRequest } from "helpers/apiRequests";
import { SendPaymentContext } from "./sendPaymentContext";
import { LoaderContext } from "./loaderContext";
import ModalActivityDetail from "components/modals/ModalActivityDetail";
import ModalConfirmation from "components/modals/ModalConfirmation";
import { toast } from "react-toastify";
import {
  ACT_REQUEST_RECEIVE,
  ACT_REQUEST_SEND,
  ACT_STATUS_CANCELLED,
  ACT_STATUS_DECLINED,
  ACT_STATUS_PAID,
  ACT_STATUS_PENDING,
  ACT_TRANSACT_CREDIT,
  ACT_TRANSACT_DEBIT,
  ACT_TYPE_REQUEST,
  ACT_TYPE_TRANSACTION,
} from "constants/all";

export const ActivityContext = React.createContext({});

const ActivityProvider = ({ children }) => {
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
    request_id: "",
  });

  const printActivityDetails = async ({
    request_id,
    activity_type,
    ref_id,
  }) => {
    setIsLoading(true);
    try {
      const { data } = await apiRequest.getPrintDetails({ id: request_id });
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
      const base64pdf = data.data;
      const transactId =
        activity_type === ACT_TYPE_TRANSACTION ? ref_id : request_id;
      const dtnow = new Date().toISOString();
      const linkSource = `data:application/pdf;base64,${base64pdf}`;
      const downloadLink = document.createElement("a");
      const fileName = `${transactId}_${dtnow}.pdf`;
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
      const { data } = await apiRequest.getActivityDetails({ id });
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

  const changeActivityStatus = async (request_id, status) => {
    if (!request_id) return;
    setIsLoading(true);
    try {
      const { data } = await apiRequest.changeRequestStatus({
        request_id,
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
    const { activity_type, request_type, status, request_id } =
      actDetails || {};
    setShowDetails(false);
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
        setDiscardActDetail({
          heading: "Decline Request",
          subHeading: "Are you sure to decline the requested payment?",
          request_id,
          status: ACT_STATUS_DECLINED,
        });
        setShowConfirmPopup(true);
        return;
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PENDING}`:
        setDiscardActDetail({
          heading: "Cancel Request",
          subHeading: "Are you sure to cancel the request?",
          request_id,
          status: ACT_STATUS_CANCELLED,
        });
        setShowConfirmPopup(true);
        return;
    }
  };

  const handleConfirmActivityDiscard = async () => {
    const { request_id, status } = discardActDetail;
    if (!request_id || !status) return;
    setShowConfirmPopup(false);
    await changeActivityStatus(request_id, status);
  };

  const handleActivityRespond = (actDetails) => {
    const { activity_type, request_type, status, request_id } =
      actDetails || {};
    setShowDetails(false);
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
        const contact = {
          name: actDetails?.name,
          profile_image: actDetails?.image,
          specifications: actDetails?.specification,
          personal_amount:
            typeof actDetails?.amount === "number"
              ? actDetails.amount?.toFixed(2)
              : "0",
          receiver_account_number: actDetails?.account_number,
        };
        handleSendContacts([contact], request_id);
        return;
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_SEND}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PAID}`:
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_DEBIT}_${ACT_STATUS_PAID}`:
        printActivityDetails(actDetails);
        return;
    }
  };

  return (
    <ActivityContext.Provider value={{ reloadList, handleActivityDetail }}>
      {children}
      <ModalActivityDetail
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
    </ActivityContext.Provider>
  );
};

export default ActivityProvider;
