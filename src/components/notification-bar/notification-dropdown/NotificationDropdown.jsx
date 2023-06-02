import NotificationListItem from "components/items/NotificationListItem";
import { notificationType } from "constants/all";
import { ActivityContext } from "context/activityContext";
import { LoaderContext } from "context/loaderContext";
import { fetchMarkAsRead } from "features/user/userNotificationSlice";
import LoaderNotificationDropdown from "loaders/LoaderNotificationDropdown";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconNotify } from "styles/svgs";

const NotificationDropdown = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownref = useRef(null);
  const { setIsLoading } = useContext(LoaderContext);
  const { handleActivityDetail } = useContext(ActivityContext);
  const { dropNotifications, initialLoading, pendingRead } = useSelector(
    (state) => state.userNotification
  );
  const [showDrop, setShowDrop] = useState(false);

  useEffect(() => {
    function handleclickOutside(event) {
      if (dropdownref.current && !dropdownref.current.contains(event.target)) {
        setShowDrop(false);
      }
    }
    document.addEventListener("mousedown", handleclickOutside);
    return () => {
      document.removeEventListener("mousedown", handleclickOutside);
    };
  }, [dropdownref]);

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
      toast.success(payload.message);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="notification-user-wrap">
      <div
        className="dashboard-notification-wrap"
        onClick={() => setShowDrop(true)}
      >
        <div className="notification-icon">
          <IconNotify />
          {pendingRead ? (
            <span className="notification-count">
              <span></span>
            </span>
          ) : null}
        </div>
      </div>
      {/* <!-- Notification Dropdown Start --> */}
      <div
        className="notification-dd-wrap"
        style={{ display: showDrop ? "block" : "none" }}
        ref={dropdownref}
      >
        <ul className="notification-list-wrap">
          {initialLoading
            ? [1, 2].map((item) => <LoaderNotificationDropdown key={item} />)
            : dropNotifications?.map((item, index) => (
                <NotificationListItem
                  key={item?.id || index}
                  Icon={notificationType[item?.type]?.icon}
                  className="notification-content-wrap"
                  notification={item}
                  showDeleteButton={false}
                  handleRead={handleMarkAsRead}
                  timeStampDirection="DOWN"
                />
              ))}
        </ul>
        {dropNotifications && dropNotifications.length > 0 ? (
          <div className="see-all-notifi">
            <Link
              to="/view-notification"
              replace={true}
              onClick={() => setShowDrop(false)}
            >
              See All
            </Link>
          </div>
        ) : (
          <div className="see-all-notifi">
            <p>Notifications not found</p>
          </div>
        )}
      </div>
      {/* <!-- Notification Dropdown End --> */}
    </div>
  );
};

export default NotificationDropdown;
