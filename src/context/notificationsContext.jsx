import React, { useMemo, useState } from "react";
import ModalAlert from "components/modals/ModalAlert";

export const NotificationContext = React.createContext({});

const NotificationDetailsProvider = ({ children }) => {
  const [notificationDetails, setNotificationDetails] = useState({
    heading: "",
    subHeading: "",
  });
  const [showDetails, setShowDetails] = useState(false);
  const [reloadList, setReloadList] = useState(false);

  const handleNotificationDetails = async (details) => {
    setShowDetails(true);
    setNotificationDetails(details);
  };

  const notifiDetails = useMemo(
    () => ({ reloadList, handleNotificationDetails }),
    [reloadList, handleNotificationDetails]
  );

  const handleModalCallback = () => {
    setShowDetails(false);
  };

  return (
    <NotificationContext.Provider value={notifiDetails}>
      {children}
      <ModalAlert
        id="money_sent_modal"
        className="money-sent-modal"
        show={showDetails}
        heading={notificationDetails.heading}
        subHeading={notificationDetails.subHeading}
        headingImg={"/assets/images/notification-bell.svg"}
        btnText={"Ok"}
        handleBtnClick={handleModalCallback}
      />
    </NotificationContext.Provider>
  );
};

export default NotificationDetailsProvider;
