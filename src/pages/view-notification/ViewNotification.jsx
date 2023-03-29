import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NotificationListItem from "components/items/NotificationListItem";
import Pagination from "components/pagination/Pagination";
import { fetchGetAllNotifications } from "features/user/userNotificationSlice";
import { LoaderContext } from "context/loaderContext";

function ViewNotification(props) {
  const dispatch = useDispatch();
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
                notification={item}
                showDeleteButton={true}
                key={index}
              />
            ))}
          </ul>
        </div>
        <Pagination
          {...{
            active: current_page,
            size: last_page,
            siblingCount: 2,
            onClickHandler: handleNotificationPageChange,
          }}
        />
      </div>
    </div>
  );
}

export default ViewNotification;
