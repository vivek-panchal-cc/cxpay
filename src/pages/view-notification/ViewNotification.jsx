import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationListItem from "components/items/NotificationListItem";
import Pagination from "components/pagination/Pagination";
import {
  fetchDeleteNotifications,
  fetchGetAllNotifications,
  fetchMarkAsRead,
  fetchMarkAllAsRead,
} from "features/user/userNotificationSlice";
import { LoaderContext } from "context/loaderContext";
import { notificationType } from "constants/all";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "components/ui/Button";
import { ActivityContext } from "context/activityContext";

function ViewNotification(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { handleActivityDetail } = useContext(ActivityContext);
  const { allNotifications, pagination } = useSelector(
    (state) => state.userNotification
  );
  const { current_page, total, last_page } = pagination || {};
  const hasUnreadNotifications = allNotifications?.some(
    (notification) => !notification.status
  );

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
    const { request_id } =
      typeof payload === "string" && payload.length > 0
        ? JSON.parse(payload)
        : "";
    if (request_id) handleActivityDetail({ id: request_id });
    else navigate(notificationType[type].redirect);
    if (status) return;
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(fetchMarkAsRead(id));
      if (error) throw payload;
      // toast.success(payload.message);
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

  const handleMarkAllAsRead = async () => {
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(fetchMarkAllAsRead());      
      if (error) throw payload;
      toast.success(payload.message);
    } catch (error) {
      console.log(error);
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
            {hasUnreadNotifications && allNotifications.length > 0 ? (
              <Button
                type="button"
                className="btn me-2"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </Button>
            ) : null}
            {allNotifications && allNotifications.length > 0 ? (
              <Button type="button" className="btn" onClick={handleDeleteAll}>
                Clear all
              </Button>
            ) : null}
          </div>
        </div>
        <div className="notification-pg-list-wrap">
          <ul>
            {allNotifications?.map((item, index) => (
              <NotificationListItem
                key={item?.id || index}
                Icon={notificationType[item?.type]?.icon}
                handleDelete={handleDelete}
                handleRead={handleMarkAsRead}
                notification={item}
                showDeleteButton={true}
                timeStampDirection={"UP"}
              />
            ))}
          </ul>
          {allNotifications.length <= 0 ? (
            <div className="text-center py-4">
              <p className="fs-5">Notifications not found.</p>
            </div>
          ) : null}
        </div>
        {pagination && !(current_page <= 1 && total <= 10) ? (
          <Pagination
            {...{
              active: current_page,
              size: last_page,
              siblingCount: 2,
              onClickHandler: handleNotificationPageChange,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default ViewNotification;
