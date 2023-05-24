import React, { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationListItem from "components/items/NotificationListItem";
import Pagination from "components/pagination/Pagination";
import {
  fetchDeleteNotifications,
  fetchGetAllNotifications,
  fetchMarkAsRead,
} from "features/user/userNotificationSlice";
import { LoaderContext } from "context/loaderContext";
import {
  ACT_STATUS_DECLINED,
  ACT_TYPE_TRANSACTION,
  ACT_TYPE_REQUEST,
  ACT_REQUEST_RECEIVE,
  ACT_TRANSACT_CREDIT,
  ACT_TRANSACT_DEBIT,
  ACT_STATUS_PENDING,
  ACT_STATUS_PAID,
  NOTIFY_CON_REGISTER,
  NOTIFY_PAY_COMPLETE,
  NOTIFY_PAY_FAIL,
  NOTIFY_RECEIVE,
  NOTIFY_REQUEST,
  notificationType,
} from "constants/all";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";
import { apiRequest } from "helpers/apiRequests";
import ModalActivityDetail from "components/modals/ModalActivityDetail";
import { SendPaymentContext } from "context/sendPaymentContext";
import ModalConfirmation from "components/modals/ModalConfirmation";

function ViewNotification(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { handleSendContacts } = useContext(SendPaymentContext);
  const [activityDetails, setActivityDetails] = useState({});
  const [showActivityPopup, setShowActivityPopup] = useState(false);
  const [loadingPopupDetails, setLoadingPopupDetails] = useState(false);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const { setIsLoading } = useContext(LoaderContext);
  const { allNotifications, pagination } = useSelector(
    (state) => state.userNotification
  );
  const { current_page, total, last_page } = pagination || {};

  const handleNotificationPageChange = async (page) => {
    setIsLoading(true);
    try {
      await dispatch(fetchGetAllNotifications(page));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async ({ id, status, type, payload }) => {
    switch (type) {
      case NOTIFY_REQUEST:
        openRequestNotification(payload);
        break;
      case NOTIFY_RECEIVE:
        openRequestNotification(payload || '{"request_id":"55"}');
        break;
      case NOTIFY_PAY_FAIL:
        openRequestNotification(payload || '{"request_id":"55"}');
        break;
      case NOTIFY_PAY_COMPLETE:
        openRequestNotification(payload || '{"request_id":"57"}');
        break;
      default:
        navigate(notificationType[type].redirect);
        break;
    }
    if (status) return;
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(fetchMarkAsRead(id));
      if (error) throw payload;
      toast.success(payload.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async ({ id }) => {
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(
        fetchDeleteNotifications({ id })
      );
      if (error) throw payload;
      toast.success(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(
        fetchDeleteNotifications({ delete_all: true })
      );
      if (error) throw payload;
      toast.success(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // handle Request notification
  const openRequestNotification = async (payloadStr) => {
    if (!payloadStr) return;
    const { request_id } = JSON.parse(payloadStr);
    setShowActivityPopup(true);
    setLoadingPopupDetails(true);
    try {
      const { data } = await apiRequest.getActivityDetails({
        id: request_id,
      });
      if (!data.success) throw data.message;
      const details = data.data;
      if (!details) return setShowActivityPopup(false);
      setActivityDetails(details);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
      setShowActivityPopup(false);
    } finally {
      setLoadingPopupDetails(false);
    }
  };

  //
  // const handleAcceptRequest = async (actDetails) => {
  //   const { activity_type, request_type, status, request_id } =
  //     actDetails || {};
  //   setShowActivityPopup(false);
  //   const contact = {
  //     name: actDetails?.name,
  //     profile_image: actDetails?.image,
  //     specifications: actDetails?.specification,
  //     personal_amount: parseFloat(actDetails?.amount || "0").toFixed(2),
  //     receiver_account_number: actDetails?.account_number,
  //   };
  //   handleSendContacts([contact], request_id);
  // };

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

  const handleActivityRespond = (actDetails) => {
    const { activity_type, request_type, status, request_id } =
      actDetails || {};
    setShowActivityPopup(false);
    switch (`${activity_type}_${request_type}_${status}`) {
      case `${ACT_TYPE_REQUEST}_${ACT_REQUEST_RECEIVE}_${ACT_STATUS_PENDING}`:
        const contact = {
          name: actDetails?.name,
          profile_image: actDetails?.image,
          specifications: actDetails?.specification,
          personal_amount: parseFloat(actDetails?.amount || "0").toFixed(2),
          receiver_account_number: actDetails?.account_number,
        };
        handleSendContacts([contact], request_id);
        return;
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_CREDIT}_${ACT_STATUS_PAID}`:
        printActivityDetails(actDetails);
        return;
      case `${ACT_TYPE_TRANSACTION}_${ACT_TRANSACT_DEBIT}_${ACT_STATUS_PAID}`:
        printActivityDetails(actDetails);
        return;
    }
  };

  const handleDeclineRequest = async () => {
    setShowActivityPopup(false);
    setShowConfirmPopup(true);
  };

  const handleConfirmDeclineRequest = async () => {
    const { request_id } = activityDetails;
    if (!request_id) return;
    setShowConfirmPopup(false);
    setIsLoading(true);
    try {
      const { data } = await apiRequest.changeRequestStatus({
        request_id,
        status: ACT_STATUS_DECLINED,
      });
      if (!data.success) throw data.message;
      if (typeof data.message === "string") toast.success(data.message);
      handleNotificationPageChange(1);
    } catch (error) {
      if (typeof error === "string") toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleNotificationPageChange(1);
  }, []);

  return (
    <div>
      <div className="notification-list-sec">
        <div className="notification-top-sec d-flex justify-content-between align-items-center">
          <div className="title-content-wrap">
            <h3>Notifications</h3>
            <p> </p>
          </div>
          <div className="pr-4">
            {allNotifications && allNotifications.length > 0 && (
              <Button type="button" className="btn" onClick={handleDeleteAll}>
                Clear All
              </Button>
            )}
          </div>
        </div>
        <div className="notification-pg-list-wrap">
          <ul>
            {allNotifications?.map((item, index) => (
              <NotificationListItem
                key={index}
                Icon={notificationType[item?.type]?.icon}
                handleDelete={handleDelete}
                handleRead={handleMarkAsRead}
                notification={item}
                showDeleteButton={true}
                timeStampDirection={"UP"}
              />
            ))}
          </ul>
        </div>
        {pagination && !(current_page <= 1 && total <= 10) && (
          <Pagination
            {...{
              active: current_page,
              size: last_page,
              siblingCount: 2,
              onClickHandler: handleNotificationPageChange,
            }}
          />
        )}
      </div>
      <ModalActivityDetail
        id="user-details-popup"
        className="user-details-modal"
        show={showActivityPopup}
        setShow={setShowActivityPopup}
        loading={loadingPopupDetails}
        details={activityDetails}
        handleCancel={handleDeclineRequest}
        handleSubmit={handleActivityRespond}
      />
      <ModalConfirmation
        id="delete-group-member-popup"
        show={showConfirmPopup}
        setShow={setShowConfirmPopup}
        heading={"Decline Request"}
        subHeading={"Are you sure to decline the requested payment?"}
        handleCallback={handleConfirmDeclineRequest}
      />
    </div>
  );
}

export default ViewNotification;
