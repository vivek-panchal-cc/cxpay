import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationListItem from "components/items/NotificationListItem";
import Pagination from "components/pagination/Pagination";
import {
  fetchDeleteNotification,
  fetchGetAllNotifications,
  fetchMarkAsRead,
} from "features/user/userNotificationSlice";
import { LoaderContext } from "context/loaderContext";
import { notificationType } from "constants/all";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ViewNotification(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setIsLoading } = useContext(LoaderContext);
  const { allNotifications, pagination } = useSelector(
    (state) => state.userNotification
  );
  const { current_page, total, from, to, last_page } = pagination || {};

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

  const handleMarkAsRead = async ({ id, status, type }) => {
    if (status) return navigate(notificationType[type]?.redirect);
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(fetchMarkAsRead(id));
      if (error) throw payload;
      toast.success(payload);
      navigate(notificationType[type]?.redirect);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async ({ id }) => {
    setIsLoading(true);
    try {
      const { error, payload } = await dispatch(fetchDeleteNotification(id));
      if (error) throw payload;
      toast.success(payload);
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
        <div className="notification-top-sec">
          <div className="title-content-wrap">
            <h3>Notifications</h3>
            <p>Lorem Ipsum Dolor</p>
          </div>
        </div>
        <div className="notification-pg-list-wrap">
          <ul>
            {allNotifications?.map((item, index) => (
              <NotificationListItem
                Icon={notificationType[item?.type]?.icon}
                handleDelete={handleDelete}
                handleRead={handleMarkAsRead}
                notification={item}
                showDeleteButton={true}
                key={index}
              />
            ))}
          </ul>
        </div>
        {!(current_page <= 1 && total < 10) && (
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
    </div>
  );
}

export default ViewNotification;
